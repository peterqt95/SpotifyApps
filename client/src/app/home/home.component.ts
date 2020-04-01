import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LoginService } from '@app/services/login.service';
import { PartialObserver, Observable } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { SpotifyService } from '@app/services/spotify.service';
import { SpotifyAuthUrl } from '@app/models/SpotifyAuthUrl';
import { Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { SpotifyUser } from '@app/models/SpotifyUser';
import { SpotifyPlaylistInfo } from '@app/models/SpotifyPlaylist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  // SpotifyUser
  spotifyUser: SpotifyUser = new SpotifyUser;

  // SpotifyPlaylistInfos
  spotifyPlaylists: SpotifyPlaylistInfo[] = [];

  // Load status
  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private loginService: LoginService,
    private spotifyService: SpotifyService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.getSpotifyLogin();
  }

  private getSpotifyLogin(): void {
    this.spotifyService.getSpotifyAuthToken().pipe(mergeMap( (results: SpotifyAuthUrl) => {
      return this.getSpotifyUser(results);
    })).subscribe(this.getSpotifyUserSub());
  }

  private getSpotifyCurrentUserPlaylists(): void {
    this.spotifyService.getSpotifyCurrentUserPlaylists().subscribe(this.getSpotifyCurrentUserPlaylistSub());
  }

  private getSpotifyCurrentUserPlaylistSub(): PartialObserver<any> {
    return {
      next: (results: SpotifyPlaylistInfo[]) => {
        this.spotifyPlaylists = results;
        console.log(results);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.loadStatus.isLoaded = true;
      }
    };
  }

  private getSpotifyUser(results: SpotifyAuthUrl): Observable<any> {
      const spotifyCode = this.router.parseUrl(this.router.url).queryParamMap.get('code');
      
      // Validate code
      if (spotifyCode == null) {
        window.location.href = results.authUrl;
      }

      return this.spotifyService.getSpotifyUser(spotifyCode);
  }

  private getSpotifyUserSub(): PartialObserver<any> {
    return {
      next: (results: SpotifyUser) => {
        this.spotifyUser = results;
      },
      error: (err) => {
        // Need to route back to login
        this.loginService.logout();
        this.router.navigate(['/login']);
      },
      complete: () => {
        // Fetch user playlists
        this.getSpotifyCurrentUserPlaylists();
      }
    };
  }
}
