import { Component, Input, OnInit } from '@angular/core';
import { SpotifyAlbum } from '@app/models/SpotifyAlbum';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { TrackStats } from '@app/models/TrackStats';
import { SpotifyService } from '@app/services/spotify.service';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { BarChartData } from '@app/shared/Classes/ngx-charts/BarChartData';
import { MatTableDisplayComponent } from '@app/shared/Components/mat-table-display/mat-table-display.component';
import { PartialObserver } from 'rxjs';

@Component({
  selector: 'app-track-stats-modal',
  templateUrl: './track-stats-modal.component.html',
  styleUrls: ['./track-stats-modal.component.css']
})
export class TrackStatsModalComponent extends MatTableDisplayComponent implements OnInit, ModalComponent {
  
  // Spotify Track
  @Input() data: TrackStats;

  // Album Info
  spotifyAlbum: SpotifyAlbum = null;

  // Track Features
  trackFeatureChartData: BarChartData[] = [];

  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private spotifyService: SpotifyService,
  ) {
    super();
  }

  ngOnInit() {
    // Fetch album information and create table
    this.getAlbumInformation(this.data.trackInfo.albumId);
    this.trackFeatureChartData = this.getTrackAudioFeatures(this.data.trackAudioFeature);
  }

  private getAlbumInformation(albumId: string): void {
    this.spotifyService.getAlbumInfo(albumId).subscribe(this.getAlbumInformationSub());
  }

  private getAlbumInformationSub(): PartialObserver<any> {
    return {
      next: (result: SpotifyAlbum) => {
        this.spotifyAlbum = result;
        
        // Initialize table
        this.tableData = this.spotifyAlbum.tracks;
        this.displayedColumns = ['name', 'duration'];
        super.ngOnInit();
      },
      error: (err) => {},
      complete: () => {
        this.loadStatus.isLoaded = true;
      }

    };
  }

  private getTrackAudioFeatures(trackAudioFeature: SpotifyTrackFeatures): BarChartData[] {
    const data = [];
    const featureNames = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'];
    featureNames.forEach(feature => {
      const currentFeatureStat = new BarChartData(<BarChartData>{name: feature, value: trackAudioFeature[feature]});
      if (feature === 'tempo') {
        currentFeatureStat.value = currentFeatureStat.value / 100;
      }
      data.push(currentFeatureStat);
    });

    return data;
  }

}
