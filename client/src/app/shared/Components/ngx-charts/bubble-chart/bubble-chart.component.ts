import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { TrackStats } from '@app/models/TrackStats';
import { ModalItem } from '@app/shared/Classes/ModalItem';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';
import { TrackStatsModalComponent } from '@app/spotify-info/playlist/outlier/outlier-map/track-stats-modal/track-stats-modal.component';
import { ModalComponentFactoryComponent } from '../../modal-component-factory/modal-component-factory.component';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {

  @Input() results: BubbleChartData[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() extra?: any;

  bubbleData: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  maxRadius = 20;
  minRadius = 5;
  yScaleMin = -5;
  yScaleMax = 5;

  colorScheme = {
    domain: ['#ff0000', '#3f51b5']
  };

  constructor(
    private dialog: MatDialog
  ) {}

  ngOnInit() {
  }

  public onSelect(data): void {
    if (this.extra) {
      // Get spotify track info
      const trackInfo: SpotifyTrack = this.extra.spotifyTracks.find(track => data.extra === track.id);
      const trackAudioFeature: SpotifyTrackFeatures = this.extra.trackFeatures.find(feature => data.extra === feature.id);
      const trackStats: TrackStats = new TrackStats(<TrackStats>{trackInfo: trackInfo, trackAudioFeature: trackAudioFeature});

      const MODAL_TITLE = 'Song Info: ' + trackInfo.name;
      const dialogRef = this.dialog.open(ModalComponentFactoryComponent, {
        width: '800px',
        data: new ModalItem(TrackStatsModalComponent, MODAL_TITLE, trackStats)
      });
    }
  }

  public onActivate(data): void {
  }

  public onDeactivate(data): void {
  }

}
