import json
from app import api, jwt, db, sp_oauth
from .models import User, UserSchema
from flask import request, session, current_app
from flask_restful import Resource, Api
from http import HTTPStatus
from flask_jwt_extended import (
    jwt_required, create_access_token, get_jwt_identity, create_refresh_token,
    jwt_refresh_token_required
)
import spotipy
import spotipy.util as sp_util

class Error():
    def __init__(self):
        self.status = False
        self.error = None
    
    def to_json(self):
        return {
            "error": self.error,
            "status": self.status
        }

class Token(Error):
    def __init__(self):
        super().__init__()
        self.access_token = ''
        self.refresh_token = ''
        self.name = ''
        self.user_id = -1
    
    def to_json(self):
        return {
            "error": self.error,
            "status": self.status,
            "accessToken": self.access_token,
            "refreshToken": self.refresh_token,
            "name": self.name,
            "userId": self.user_id,
        }

class DefaultResource(Resource):
    def get(self):
        return {'task': 'Hello world'}
        
class UsersResource(Resource):
    def __init__(self):
        self.users_schema = UserSchema(many=True)

    @jwt_required
    def get(self):
        users = User.query.all()
        return self.users_schema.dump(users)
    
    @jwt_required
    def post(self):
        return_status = HTTPStatus.CREATED
        data = request.get_json(force = True)
        try:
            user = User(data['name'], data['password'])
            user.post()
        except Exception as e:
            print(e)
            return_status = HTTPStatus.FORBIDDEN

        return data, return_status

class UserResource(Resource):
    def __init__(self):
        self.user_schema = UserSchema()

    @jwt_required
    def get(self, id):
        return_status = HTTPStatus.OK
        try:
            user = User.query.get(id)
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return self.user_schema.dump(user)

    @jwt_required
    def put(self, id):
        return_status = HTTPStatus.CREATED
        data = request.get_json(force = True)
        try:
            # Get the information
            user = User.query.filter_by(myid=id).first()

            # Update information from request
            user.put(data)
        except Exception as e:
            print(e)
            return_status = HTTPStatus.FORBIDDEN

        return data, return_status

class LoginRequired(Resource):
    @jwt_required
    def get(self):
        return_status = HTTPStatus.OK
        status = Error()
        try:
            current_user = get_jwt_identity()
            if current_user:
                status.status = True
            else:
                status.error = "Not logged in"
        except Exception as e:
            status.error = str(e)
            return_status = HTTPStatus.BAD_REQUEST

        return status.to_json(), return_status

    def post(self):
        return_status = HTTPStatus.OK
        status = Token()
        data = request.get_json(force = True)
        try:
            # Get the info
            user = User.query.filter_by(name=data['name']).first()
            if user and data['password'] == user.password:
                session[user.name] = True
                status.status = True
                status.access_token = create_access_token(identity=user.name)
                status.refresh_token = create_refresh_token(identity=user.name)
                status.name = user.name
                status.user_id = user.myid
            else:
                status.error = "Invalid username or password"
        except Exception as e:
            status.error = str(e)
            return_status = HTTPStatus.BAD_REQUEST
        
        return status.to_json(), return_status

class RefreshTokenResource(Resource):
    @jwt_refresh_token_required
    def get(self):
        return_status = HTTPStatus.OK
        status = Token()
        current_user = get_jwt_identity()
        if current_user:
            status.status = True
            status.access_token = create_access_token(identity=current_user)
        else:
            status.error = "Invalid refresh token"

        return status.to_json(), return_status

class SpotifyAuthResource(Resource):
    def get(self):
        return_status = HTTPStatus.OK
        data = {}
        try:
            data['authUrl'] = sp_oauth.get_authorize_url()
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

class SpotifyRedirectResource(Resource):
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

    def _convert_params(self, data):
        # Convert snake to camel
        display_name = data['display_name']
        data['displayName'] = display_name
        del data['display_name']
        return data

    def get(self, code):
        return_status = HTTPStatus.OK
        data = {}
        access_token = None

        # Check to see if spotify session already active
        if 'spotify_token' in session:
            access_token = session['spotify_token']

        # Fetch the token if there is none
        if access_token is None:
            token_info = sp_oauth.get_cached_token()
            if token_info is None:
                token_info = sp_oauth.get_access_token(code)
            access_token = token_info['access_token']
        
        try:
            # Fetch the user and store the spotify token
            sp = spotipy.Spotify(auth=access_token)
            data = self._convert_params(sp.current_user())
            session['spotify_token'] = access_token
        except Exception as e:
            print(e)
            return_status = HTTPStatus.NOT_FOUND
        
        return data, return_status

api.add_resource(DefaultResource, '/')
api.add_resource(UsersResource, '/users')
api.add_resource(UserResource, '/users/<int:id>')
api.add_resource(LoginRequired, '/login')
api.add_resource(RefreshTokenResource, '/refresh')
api.add_resource(SpotifyAuthResource, '/spotify_auth')
api.add_resource(SpotifyRedirectResource, '/spotify_redirect')
api.add_resource(SpotifyUserResource, '/spotify_user/<string:code>')
