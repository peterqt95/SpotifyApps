import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SpotifyService } from '@app/services/spotify.service';
import { ActivatedRoute } from '@angular/router';
import { Subscriber, Subscription, PartialObserver, forkJoin } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { LoginService } from '@app/services/login.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyPlaylistInfo } from '@app/models/SpotifyPlaylist';


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

  // Tracks
  spotifyTracks: SpotifyTrack[] = [];

  // Spotify Playlist Info
  spotifyPlaylistInfo: SpotifyPlaylistInfo = null;

  // Displayed Columns
  displayedColumns: string[] = ['name', 'artists', 'album', 'duration'];
  dataSource: MatTableDataSource<SpotifyTrack>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

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
    this.getPlaylistInformation(this.playlistId);
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();
  }

  private getPlaylistInformation(playlistId: string): void {
    forkJoin(
      this.spotifyService.getPlaylistInfo(this.userId, playlistId),
      this.spotifyService.getPlaylistTracks(this.userId, playlistId)
    ).subscribe(this.getPlaylistInformationSub());
  }

  private getPlaylistInformationSub(): PartialObserver<any> {
    return {
      next: ([spotifyPlayListInfo, spotifyTracks]: [SpotifyPlaylistInfo, SpotifyTrack[]]) => {
        // Populate playlsit information
        this.spotifyPlaylistInfo = spotifyPlayListInfo;

        // Populate track list
        this.spotifyTracks = spotifyTracks;
        this.dataSource = new MatTableDataSource(this.spotifyTracks);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {},
      complete: () => {
        this.loadStatus.isLoaded = true;
      }

    };
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
