import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { OutlierData } from '@app/models/OutlierData';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { SpotifyService } from '@app/services/spotify.service';
import { PartialModule } from '@angular/compiler';
import { PartialObserver } from 'rxjs';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { mergeMap } from 'rxjs/operators';
import { SpotifyAudioAnalysis, DescriptiveStats } from '@app/models/SpotifyAudioAnalysis';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { GroupedBarChartComponent } from '@app/shared/Components/ngx-charts/grouped-bar-chart/grouped-bar-chart.component';
import { GroupedBarChartData } from '@app/shared/Classes/ngx-charts/GroupedBarChartData';
import { ChartDataPoint } from '@app/shared/Classes/ngx-charts/ChartDataPoint';

@Component({
  selector: 'app-outlier-modal',
  templateUrl: './outlier-modal.component.html',
  styleUrls: ['./outlier-modal.component.css']
})
export class OutlierModalComponent implements OnInit, ModalComponent {

  @Input() data: OutlierData;

  // Spotify Track Features
  trackFeatures: SpotifyTrackFeatures[] = [];

  // Audio analysis
  audioAnalysis: SpotifyAudioAnalysis = null;

  // Outliers
  outliers: SpotifyTrack[] = [];

  // Table Load Status
  loadStatus: LoadStatus = new LoadStatus();

  // Full Details Load status
  detailsLoadStatus: LoadStatus = new LoadStatus();

  // Track comparisson details
  trackFeatureComparissonData: GroupedBarChartData[] = [];

  // Displayed Columns
  displayedColumns: string[] = ['name', 'artists', 'album', 'duration', 'analysis'];
  dataSource: MatTableDataSource<SpotifyTrack>;
  
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    const tracks: SpotifyTrack[] = this.data.tracks;

    this.getTrackAudioFeatures(tracks);
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
        const tracks: SpotifyTrack[] = this.data.tracks;
        this.outliers = tracks.filter(track => this.audioAnalysis.outliers.includes(track.id));

        // Set the table
        this.dataSource = new MatTableDataSource(this.outliers);
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {},
      complete: () => { this.loadStatus.isLoaded = true; }
    };
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public showFullDetails(trackId: string): void {
    // Reset data
    this.trackFeatureComparissonData = [];
    
    // Build chart data
    const currentTrackFeatures = this.trackFeatures.find(track => track.id === trackId);
    const featureNames = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'];
    featureNames.forEach(feature => {
      // Get the average of the entire playlist
      const playlistFeatureStats = this.audioAnalysis.featureDescriptions.find((stats: DescriptiveStats) => stats.type === feature);
      
      // Add the series data for the chart
      const seriesData: ChartDataPoint[] = [];
      const currentFeatureStat = new ChartDataPoint({name: 'Current', value: currentTrackFeatures[feature]});
      const playlistStat = new ChartDataPoint({name: 'Average', value: playlistFeatureStats.mean});
      seriesData.push(currentFeatureStat, playlistStat);

      // Scale tempo down
      if (feature === 'tempo') {
        seriesData[0].value = seriesData[0].value / 100;
        seriesData[1].value = seriesData[1].value / 100;
      }

      // Add to GroupedBarChart Data
      this.trackFeatureComparissonData.push(new GroupedBarChartData({name: feature, series: seriesData}));
    });

    // Set which components loaded
    this.loadStatus.isLoaded = false;
    this.detailsLoadStatus.isLoaded = true;
  }

  public back(): void {
    this.loadStatus.isLoaded = true;
    this.detailsLoadStatus.isLoaded = false;
  }

}
