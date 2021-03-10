import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, PartialObserver } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyPlaylistInfo } from '@app/models/SpotifyPlaylist';
import { MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { SpotifyService } from '@app/services/spotify.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { SpotifyAudioAnalysis, DescriptiveStats } from '@app/models/SpotifyAudioAnalysis';
import { mergeMap } from 'rxjs/internal/operators/mergeMap';
import { GroupedBarChartData } from '@app/shared/Classes/ngx-charts/GroupedBarChartData';
import { ChartDataPoint } from '@app/shared/Classes/ngx-charts/ChartDataPoint';

@Component({
  selector: 'app-outlier',
  templateUrl: './outlier.component.html',
  styleUrls: ['./outlier.component.css']
})
export class OutlierComponent implements OnInit, OnDestroy {
  // Get route id
  idSub: Subscription;
  navSub: Subscription;

  // Playlist id
  playlistId: string = null;

  // User id
  userId: string = null;

  // Load status
  loadStatus: Map<string, LoadStatus> = new Map<string, LoadStatus>([
    ['main', new LoadStatus()],
    ['outliers', new LoadStatus()],
    ['outlierDetails', new LoadStatus()]
  ]);

  // Tracks
  spotifyTracks: SpotifyTrack[] = [];

  // Spotify Playlist Info
  spotifyPlaylistInfo: SpotifyPlaylistInfo = null;

  // Spotify Track Features
  trackFeatures: SpotifyTrackFeatures[] = [];

  // Audio analysis
  audioAnalysis: SpotifyAudioAnalysis = null;

  // Outliers
  outliers: SpotifyTrack[] = [];

  // Track comparisson details
  trackFeatureComparissonData: GroupedBarChartData[] = [];

  // Displayed Columns
  displayedColumns: string[] = ['name', 'artists', 'album', 'duration', 'analysis'];
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
    this.loadStatus.get('main').isLoaded = false;
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
      },
      error: (err) => {},
      complete: () => {
        this.loadStatus.get('main').isLoaded = true;

        // Get Audio Features
        this.getTrackAudioFeatures(this.spotifyTracks);
      }

    };
  }

  private getTrackAudioFeatures(tracks: SpotifyTrack[]): void {
    // Pull out the track ids
    const trackIds = tracks.map(track => track.id);
    this.spotifyService.getTrackAudioFeatures(trackIds).pipe(mergeMap((results: SpotifyTrackFeatures[]) => {
      this.trackFeatures = results;
      return this.spotifyService.getPlaylistAudioAnalysis(JSON.stringify(this.trackFeatures));
    })).subscribe(this.getPlaylistAudioAnalysisSub());
  }

  private getPlaylistAudioAnalysisSub(): PartialObserver<any> {
    return {
      next: (results: SpotifyAudioAnalysis) => {
        this.audioAnalysis = results;

        // Map the outliers
        const tracks: SpotifyTrack[] = this.spotifyTracks;
        this.outliers = tracks.filter(track => this.audioAnalysis.outliers.includes(track.id));

        console.log(this.audioAnalysis);
      },
      error: (err) => {},
      complete: () => { this.loadStatus.get('outliers').isLoaded = true; }
    };
  }

}
