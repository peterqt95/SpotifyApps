import { Component, Input, OnInit } from '@angular/core';
import { PCACord } from '@app/models/SpotifyAudioAnalysis';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';
import { BubbleChartDataItem } from '@swimlane/ngx-charts';
import { TrackStatsModalComponent } from './track-stats-modal/track-stats-modal.component';

@Component({
  selector: 'app-outlier-map',
  templateUrl: './outlier-map.component.html',
  styleUrls: ['./outlier-map.component.css']
})
export class OutlierMapComponent implements OnInit {

  @Input() spotifyTracks: SpotifyTrack[];
  @Input() spotifyCords: PCACord[] = [];
  @Input() trackFeatures: SpotifyTrackFeatures[] = [];

  results: BubbleChartData[] = [];
  modalComponent = TrackStatsModalComponent;

  constructor() {
  }

  ngOnInit() {
    // Filter out the coordinates
    const outlierCords: PCACord[] = this.spotifyCords.filter((pcaCord) => pcaCord.anomaly === 1);
    const nonOutlierCords: PCACord[] = this.spotifyCords.filter((pcaCord) => pcaCord.anomaly === 0);

    // Filter out the tracks
    const outlierIds: string[] = outlierCords.map(track => track.id);
    const nonOutlierCordIds: string[] = nonOutlierCords.map(track => track.id);
    const outlierTracks: SpotifyTrack[] = this.spotifyTracks.filter(track => outlierIds.includes(track.id));
    const nonOutlierTracks: SpotifyTrack[] = this.spotifyTracks.filter(track => nonOutlierCordIds.includes(track.id));

    // Create the points
    this.results.push(this.populatePoints('Outliers', outlierTracks, outlierCords));
    this.results.push(this.populatePoints('Regular', nonOutlierTracks, nonOutlierCords));
  }

  private populatePoints(chartName: string, tracks: SpotifyTrack[], cords: PCACord[]): BubbleChartData {
    // Create new bubble chart data
    const bubbleChartData = new BubbleChartData();
    bubbleChartData.name = chartName;

    // Get the data points from the outliers
    const points: BubbleChartDataItem[] = [];
    tracks.forEach((track: SpotifyTrack) => {
      const outlierCord = cords.filter((cord: PCACord) => cord.id === track.id)[0];
      points.push({
        name: track.name,
        x: outlierCord.x,
        y: outlierCord.y,
        r: track.popularity,
        extra: track.id
      });
    });

    // Set the datapoints to our bubble chart series
    bubbleChartData.series = points;

    return bubbleChartData;
  }

}
