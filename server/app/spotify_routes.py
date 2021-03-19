import json
import sys, os
from app import api, jwt, db, sp_oauth, app
from flask import request, session, current_app, jsonify
from flask_restful import Resource, Api
from http import HTTPStatus
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, create_refresh_token,
    jwt_refresh_token_required
)
from functools import wraps
import spotipy
import spotipy.util as sp_util

from app import spotify_analysis as spa

# Utility function
# Converts ms to min:second format
def convert_ms_to_min_sec(ms):
    minutes = str(int(ms / (1000 * 60) % 60))
    seconds = str(int((ms / 1000) % 60))
    
    # Prepend zero if seconds is length 1
    if len(seconds) == 1:
        seconds = '0' + seconds
    return (minutes + ":" + seconds)

def log_error(e):
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print(exc_type, fname, exc_tb.tb_lineno, e)

# ToDo - If I want some random wrapper function on all my resources ¯\_(ツ)_/¯
def timing(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept, x-auth"
    return response

class SpotifyAuthResource(Resource):

    # ToDo: Use method_decorators to add our response header
    method_decorators = [timing]

    @jwt_required
    def get(self):
        return_status = HTTPStatus.OK
        data = {}

        # if 'spotify_token' in session:
            # del session['spotify_token']

        try:
            data['authUrl'] = sp_oauth.get_authorize_url()
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

class SpotifyRedirectResource(Resource):

    method_decorators = [timing]

    @jwt_required
    def get(self):
        return_status = HTTPStatus.OK
        data = {}
        try:
            data['token'] = current_app.config["SPOTIFY"]
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

class SpotifyUserResource(Resource):

    method_decorators = [timing]

    def _convert_params(self, data):
        # Convert snake to camel
        display_name = data['display_name']
        data['displayName'] = display_name
        del data['display_name']
        return data

    @jwt_required
    def get(self, code):
        return_status = HTTPStatus.OK
        data = jsonify()

        # Fetch token
        token_info = sp_oauth.get_cached_token()
        if token_info is None:
            token_info = sp_oauth.get_access_token(code)
        access_token = token_info['access_token']
        
        try:
            # Fetch the user and store the spotify token
            sp = spotipy.Spotify(auth=access_token)
            data = self._convert_params(sp.current_user())
            session['spotify_token'] = access_token
            session.modified = True
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND

        return data, return_status

class SpotifyPlaylistsResource(Resource):

    method_decorators = [timing]

    @jwt_required
    def get(self):
        return_status = HTTPStatus.OK
        data = {}

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            data = sp.current_user_playlists()
            playlists = data["items"]
            final_data = []

            # Get info for playlists
            for playlist in playlists:
                playlist_info = {}
                playlist_info["name"] = playlist["name"]
                playlist_info["id"] = playlist["id"]
                playlist_info["owner"] = playlist["owner"]["id"]
                playlist_info["externalUrl"] = playlist["external_urls"]["spotify"]
                playlist_info["image"] = playlist["images"][0]["url"] if len(playlist["images"]) > 0 else None
                playlist_info["playlistLength"] = playlist["tracks"]["total"]
                final_data.append(playlist_info)

            data = final_data
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        # return data, return_status, {'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, x-auth"}
        return data, return_status

class SpotifyPlaylistTracksResource(Resource):

    method_decorators = [timing]

    def _get_artists(self, artists):
        artists_info = []
        for artist in artists:
            artist_info = {}
            artist_info["name"] = artist["name"]
            artist_info["id"] = artist["id"]
            artist_info["artistUrl"] = artist["external_urls"].get("spotify", None)
            artists_info.append(artist_info)
        
        return artists_info

    @jwt_required
    def get(self, user, id):
        return_status = HTTPStatus.OK
        data = []

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            tracks, offset = [], 0
            while True:
                track_response = sp.user_playlist_tracks(user, id, offset=offset)
                tracks += track_response["items"]
                offset = len(tracks)
                if len(track_response["items"]) < 100:
                    break

            
            # Return all track information for playlist
            for track in tracks:
                track_info = {}
                _track = track["track"]
                track_info["album"] = _track["album"]["name"]
                track_info["albumId"] = _track["album"]["id"]
                track_info["albumUrl"] = _track["album"]["external_urls"].get("spotify", None)
                track_info["artists"] = self._get_artists(_track["artists"])
                track_info["url"] = _track["external_urls"].get("spotify", None)
                track_info["name"] = _track["name"]
                track_info["id"] = _track["id"]
                track_info["duration"] = convert_ms_to_min_sec(_track["duration_ms"])
                track_info["popularity"] = _track["popularity"]
                data.append(track_info)

        except Exception as e:
            log_error(e)
            return_status = HTTPStatus.NOT_FOUND
        
        # return data, return_status, {'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, x-auth"}
        return data, return_status

class SpotifyPlaylistInfoResource(Resource):

    method_decorators = [timing]

    def _convert_params(self, data):
        temp = {}
        temp["name"] = data["name"]
        temp["id"] = data["id"]
        temp["owner"] = data["owner"]["id"]
        temp["externalUrl"] = data["external_urls"]["spotify"]
        temp["image"] = data["images"][0]["url"] if len(data["images"]) > 0 else None
        temp["playlistLength"] = data["tracks"]["total"]
        return temp

    @jwt_required
    def get(self, user, id):
        return_status = HTTPStatus.OK
        data = {}

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            data = self._convert_params(sp.user_playlist(user, id))
        except Exception as e:
            log_error(e)
            return_status = HTTPStatus.NOT_FOUND
        
        # return data, return_status, {'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, x-auth"}
        return data, return_status

class SpotifyTrackAudioFeaturesResource(Resource):

    method_decorators = [timing]

    def _convert_params(self, audio_feature):
        # Convert params
        audio_feature['duration'] = convert_ms_to_min_sec(audio_feature['duration_ms'])

        # Remove unneccessary params
        del audio_feature['type']
        del audio_feature['track_href']
        del audio_feature['analysis_url']
        del audio_feature['uri']
        del audio_feature['duration_ms']

        return audio_feature

    @jwt_required
    def get(self):
        track_ids = request.args.getlist('tracks')
        return_status = HTTPStatus.OK
        data = []

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            audio_features = []
            while track_ids:
                length = 50 if len(track_ids) > 50 else len(track_ids)
                audio_features += sp.audio_features(track_ids[:length])
                track_ids = track_ids[length:]
            
            # Remove any none types
            audio_features = [audio_feature for audio_feature in audio_features if audio_feature is not None]
            
            for audio_feature in audio_features:
                data.append(self._convert_params(audio_feature))

        except Exception as e:
            log_error(e)
            return_status = HTTPStatus.NOT_FOUND
        
        # return data, return_status, {'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept, x-auth"}
        return data, return_status

class SpotifyTrackAudioAnalysisResource(Resource):

    method_decorators = [timing]

    @jwt_required
    def get(self):
        tracks_audio_features = json.loads(request.args.getlist('trackFeatures')[0])
        return_status = HTTPStatus.OK
        data = {}

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            sp_analysis = spa.SpotifyAnalysis(tracks_audio_features)
            feature_descriptions = sp_analysis.find_average()
            outliers, spotify_cords = sp_analysis.find_outliers()

            data = {
                'featureDescriptions': feature_descriptions,
                'outliers': outliers,
                'spotifyCords': spotify_cords
            }

        except Exception as e:
            log_error(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

class SpotifyAlbumResource(Resource):

    method_decorators = [timing]

    def _convert_params(self, data):
        def _get_artists(artists):
            artists_info = []
            for artist in artists:
                artist_info = {}
                artist_info["name"] = artist["name"]
                artist_info["id"] = artist["id"]
                artist_info["artistUrl"] = artist["external_urls"].get("spotify", None)
                artists_info.append(artist_info)
            
            return artists_info

        def _get_tracks(tracks):
            _tracks = []
            for track in tracks:
                _tracks.append({
                    'url': track['external_urls'].get('spotify', None),
                    'name': track['name'],
                    'id': track['id'],
                    'duration': convert_ms_to_min_sec(track['duration_ms']),
                })

            return _tracks

        temp = {}
        temp['name'] = data['name']
        temp['id'] = data['id']
        temp['image'] = data["images"][0]["url"] if len(data["images"]) > 0 else None
        temp['url'] = data['external_urls'].get('spotify', None)
        temp['releaseDate'] = data['release_date']
        temp['popularity'] = data['popularity']
        temp['artists'] = _get_artists(data['artists'])
        temp['tracks'] = _get_tracks(data['tracks']['items'])
        return temp

    @jwt_required
    def get(self, id):
        return_status = HTTPStatus.OK
        data = {}

        try:
            access_token = session['spotify_token']
            sp = spotipy.Spotify(auth=access_token)
            data = self._convert_params(sp.album(id))
            # data = sp.album(id)
        except Exception as e:
            log_error(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

def add_routes():
    api.add_resource(SpotifyAuthResource, '/spotify_auth')
    api.add_resource(SpotifyRedirectResource, '/spotify_redirect')
    api.add_resource(SpotifyUserResource, '/spotify_user/<string:code>')
    api.add_resource(SpotifyPlaylistsResource, '/playlists')
    api.add_resource(SpotifyPlaylistInfoResource, '/user/<string:user>/playlist/<string:id>')
    api.add_resource(SpotifyPlaylistTracksResource, '/user/<string:user>/playlist/<string:id>/tracks')
    api.add_resource(SpotifyTrackAudioFeaturesResource, '/audio_features')
    api.add_resource(SpotifyTrackAudioAnalysisResource, '/audio_analysis')
    api.add_resource(SpotifyAlbumResource, '/album/<string:id>')
