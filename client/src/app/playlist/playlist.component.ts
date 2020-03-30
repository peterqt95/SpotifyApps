import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpotifyService } from '@app/services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, PartialObserver } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { LoginService } from '@app/services/login.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  // Get route id
  idSub: Subscription;

  // Playlist id
  playlistId: string = null;

  // User id
  userId: string = null;

  // Load status
  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private spotifyService: SpotifyService,
    private route: ActivatedRoute
  ) {
    // Get route
    this.idSub = this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      this.userId = params['user'];
    });
  }

  ngOnInit() {

    // Get track information
    this.getPlaylistTracks(this.playlistId);
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  private getPlaylistTracks(playlistId: string) {
    this.spotifyService.getPlaylistTracks(this.userId, playlistId).subscribe(this.getPlaylistTracksSub());
  }

  private getPlaylistTracksSub(): PartialObserver<any> {
    return {
      next: (results: any) => {
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



}
