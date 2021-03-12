import { Component, Input, OnInit } from '@angular/core';
import { PCACord } from '@app/models/SpotifyAudioAnalysis';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';
import { BubbleChartDataItem } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-outlier-map',
  templateUrl: './outlier-map.component.html',
  styleUrls: ['./outlier-map.component.css']
})
export class OutlierMapComponent implements OnInit {

  @Input() outliers: SpotifyTrack[];
  @Input() outlierCords: PCACord[] = [];

  outlierPoints: BubbleChartData[] = [];

  constructor() {
  }

  ngOnInit() {
    // Initialize outlier points
    this.outlierPoints.push(this.populateOutlierPoints(this.outliers, this.outlierCords));
  }

  private populateOutlierPoints(outliers: SpotifyTrack[], outlierCords: PCACord[]): BubbleChartData {
    // Create new bubble chart data
    const bubbleChartData = new BubbleChartData();
    bubbleChartData.name = 'Outliers';

    // Get the data points from the outliers
    const outlierPoints: BubbleChartDataItem[] = [];
    outliers.forEach((outlier: SpotifyTrack) => {
      const outlierCord = outlierCords.filter((cord: PCACord) => cord.id === outlier.id)[0];
      outlierPoints.push({
        name: outlier.name,
        x: outlierCord.x,
        y: outlierCord.y,
        r: outlier.popularity
      });
    });

    // Set the datapoints to our bubble chart series
    bubbleChartData.series = outlierPoints;

    return bubbleChartData;
  }

}
