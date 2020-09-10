import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@env/environment';
import { SpotifyAuthUrl } from '@app/models/SpotifyAuthUrl';
import { map } from 'rxjs/operators';
import { SpotifyUser } from '@app/models/SpotifyUser';
import { SpotifyPlaylistInfo } from '@app/models/SpotifyPlaylist';
import { LoginService } from './login.service';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { SpotifyAudioAnalysis } from '@app/models/SpotifyAudioAnalysis';

const flaskUrl = environment.flaskApi;

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  flaskUrl = flaskUrl;

  constructor(
    private http: HttpClient,
  ) { }

  public getSpotifyAuthToken() {
    return this.http.get<SpotifyAuthUrl>(this.flaskUrl + '/spotify_auth').pipe(
      map((result: SpotifyAuthUrl) => {
        let returnResult = null;
        if (result) {
          returnResult = new SpotifyAuthUrl(result);
        }
        return returnResult;
      })
    );
  }

  public getSpotifyUser(code: string) {
    return this.http.get<SpotifyUser>(this.flaskUrl + '/spotify_user/' + code).pipe(
      map((result: SpotifyUser) => {
        let returnResult = null;
        if (result) {
          returnResult = new SpotifyUser(result);
        }
        return returnResult;
      })
    );
  }

  public getSpotifyCurrentUserPlaylists() {
    return this.http.get<SpotifyPlaylistInfo[]>(this.flaskUrl + '/playlists').pipe(
      map((results: SpotifyPlaylistInfo[]) => {
        const returnResults = [];
        if (results) {
          results.forEach(result => {
            returnResults.push(new SpotifyPlaylistInfo(result));
          });
        }
        return returnResults;
      })
    );
  }

  public getPlaylistInfo(user: string, playlistId: string) {
    return this.http.get<SpotifyPlaylistInfo>(this.flaskUrl + '/user/' + user + '/playlist/' + playlistId).pipe(
      map((result: SpotifyPlaylistInfo) => {
        let returnResult = null;
        if (result) {
          returnResult = new SpotifyPlaylistInfo(result);
        }
        return returnResult;
      })
    );
  }

  public getPlaylistTracks(user: string, playlistId: string) {
    return this.http.get<SpotifyTrack[]>(this.flaskUrl + '/user/' + user + '/playlist/' + playlistId + '/tracks').pipe(
      map((results: SpotifyTrack[]) => {
        const returnResults = [];
        if (results) {
          results.forEach(result => {
            returnResults.push(new SpotifyTrack(result));
          });
        }
        return returnResults;
      })
    );
  }

  public getTrackAudioFeatures(tracks: string[]) {
    return this.http.get<SpotifyTrackFeatures[]>(this.flaskUrl + '/audio_features', { params: this.buildParams({tracks: tracks}) }).pipe(
      map((results: SpotifyTrackFeatures[]) => {
        const returnResults = [];
        if (results) {
          results.forEach(result => {
            returnResults.push(new SpotifyTrackFeatures(result));
          });
        }
        return returnResults;
      })
    );
  }

  public getPlaylistAudioAnalysis(trackFeatures: string) {
    return this.http.get<SpotifyAudioAnalysis>(this.flaskUrl + '/audio_analysis',
      { params: this.buildParams({trackFeatures: trackFeatures}) }).pipe(
        map((result: SpotifyAudioAnalysis) => {
          let returnResult = null;
          if (result) {
            returnResult = new SpotifyAudioAnalysis(result);
          }
          return returnResult;
        })
    );
  }

  // Cookie code management for spotify
  public getCode(): string {
    const name = 'spotifyCode=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  public setCode(value: string): void {
    const d = new Date();
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = 'spotifyCode=' + value + ';' + expires + ';path=/';
  }

  // Need to move to utility
  private buildParams(parameters: any): HttpParams {
    let httpParams = new HttpParams();
    Object.keys(parameters).forEach(parameter => {
      const value = parameters[parameter];
      if (Array.isArray(value)) {
        value.forEach(item => {
          httpParams = httpParams.append(parameter, item);
        });
      } else {
        httpParams = httpParams.append(parameter, value);
      }
    });

    return httpParams;
  }
}
