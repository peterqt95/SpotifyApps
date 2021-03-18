import { Component, Input, OnInit } from '@angular/core';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { TrackStats } from '@app/models/TrackStats';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';

@Component({
  selector: 'app-track-stats-modal',
  templateUrl: './track-stats-modal.component.html',
  styleUrls: ['./track-stats-modal.component.css']
})
export class TrackStatsModalComponent implements OnInit, ModalComponent {
  
  // Spotify Track
  @Input() data: TrackStats;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
  }

}
