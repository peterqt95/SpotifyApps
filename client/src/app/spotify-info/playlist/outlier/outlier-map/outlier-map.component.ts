import { Component, Input, OnInit } from '@angular/core';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';

@Component({
  selector: 'app-outlier-map',
  templateUrl: './outlier-map.component.html',
  styleUrls: ['./outlier-map.component.css']
})
export class OutlierMapComponent implements OnInit {

  @Input() outliers: SpotifyTrack[];

  outlierPoints: BubbleChartData[] = [];

  constructor() {
  }

  ngOnInit() {
    // Initialize outlier points
    this.outlierPoints = this.populateOutlierPoints(this.outliers);
    console.log(this.outliers);
  }

  private populateOutlierPoints(outliers: SpotifyTrack[]): BubbleChartData[] {
    const outlierPoints = [];

    // {
    //   name: 'Outliers',
    //   series: [
    //     {
    //       name: 'Song 1',
    //       x: 1.2,
    //       y: 80.3,
    //       r: 80.4
    //     },
    //     {
    //       name: 'Song 2',
    //       x: 3.5,
    //       y: 80.3,
    //       r: 78
    //     },
    //     {
    //       name: 'Song 3',
    //       x: 8,
    //       y: 75.4,
    //       r: 79
    //     }
    //   ]
    // }

    // Generate point for each track
    // outliers.forEach((outlier: SpotifyTrack) => {
    //   outlierPoints.push({
    //     name: outlier.name,
    //     x: 
    //   });
    // });

    return outlierPoints;
  }

}
