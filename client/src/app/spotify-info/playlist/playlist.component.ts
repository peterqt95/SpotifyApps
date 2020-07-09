import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { SpotifyService } from '@app/services/spotify.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscriber, Subscription, PartialObserver, forkJoin } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { LoginService } from '@app/services/login.service';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyPlaylistInfo } from '@app/models/SpotifyPlaylist';
import { OutlierModalComponent } from './outlier-modal/outlier-modal.component';
import { ModalComponentFactoryComponent } from '@app/shared/Components/modal-component-factory/modal-component-factory.component';
import { ModalItem } from '@app/shared/Classes/ModalItem';
import { OutlierData } from '@app/models/OutlierData';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit, OnDestroy {

  // Get route id
  idSub: Subscription;
  navSub: Subscription;

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
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) {
    // Get route
    this.idSub = this.route.params.subscribe(params => {
      this.playlistId = params['id'];
      this.userId = params['user'];
    });

    // Check for reload
    this.navSub = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initPlaylistInfo();
      }
    });
  }

  ngOnInit() {
    this.initPlaylistInfo();
  }

  ngOnDestroy() {
    this.idSub.unsubscribe();

    if (this.navSub) {
      this.navSub.unsubscribe();
    }
  }

  private initPlaylistInfo(): void {
    // Fetch playlsit information
    this.loadStatus.isLoaded = false;
    this.getPlaylistInformation(this.playlistId);
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

  public openOutlierModal(): void {
    const MODAL_TITLE = 'Song Outliers';
    const outlierData = new OutlierData(this.spotifyTracks);
    const dialogRef = this.dialog.open(ModalComponentFactoryComponent, {
      width: '800px',
      data: new ModalItem(OutlierModalComponent, MODAL_TITLE, outlierData)
    });
  }

}
