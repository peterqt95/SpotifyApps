import { Component, OnInit, Input } from '@angular/core';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { OutlierData } from '@app/models/OutlierData';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { SpotifyService } from '@app/services/spotify.service';
import { PartialModule } from '@angular/compiler';
import { PartialObserver } from 'rxjs';

@Component({
  selector: 'app-outlier-modal',
  templateUrl: './outlier-modal.component.html',
  styleUrls: ['./outlier-modal.component.css']
})
export class OutlierModalComponent implements OnInit, ModalComponent {

  @Input() data: OutlierData;

  // Load Status
  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private spotifyService: SpotifyService
  ) { }

  ngOnInit() {
    const tracks: SpotifyTrack[] = this.data.tracks;
    // this.loadStatus.isLoaded = true;

    this.getTrackAudioFeatures(tracks);
  }

  private getTrackAudioFeatures(tracks: SpotifyTrack[]): void {
    // Pull out the track ids
    const trackIds = tracks.map(track => track.id);
    this.spotifyService.getTrackAudioFeatures(trackIds).subscribe(this.getTrackAudioFeaturesSub());
  }

  private getTrackAudioFeaturesSub(): PartialObserver<any> {
    return {
      next: (results) => {
        console.log(results);
      },
      error: (err) => {},
      complete: () => { this.loadStatus.isLoaded = true; }
    };
  }

}
