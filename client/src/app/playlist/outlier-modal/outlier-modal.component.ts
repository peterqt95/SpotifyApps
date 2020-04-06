import { Component, OnInit, Input } from '@angular/core';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { OutlierData } from '@app/models/OutlierData';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { SpotifyService } from '@app/services/spotify.service';
import { PartialModule } from '@angular/compiler';
import { PartialObserver } from 'rxjs';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { mergeMap } from 'rxjs/operators';
import { SpotifyAudioAnalysis } from '@app/models/SpotifyAudioAnalysis';

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

  // Load Status
  loadStatus: LoadStatus = new LoadStatus();

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

        console.log(this.outliers);
      },
      error: (err) => {},
      complete: () => { this.loadStatus.isLoaded = true; }
    };
  }

}
