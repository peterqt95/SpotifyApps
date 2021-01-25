import { Component, OnInit } from '@angular/core';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';

@Component({
  selector: 'app-outlier-map',
  templateUrl: './outlier-map.component.html',
  styleUrls: ['./outlier-map.component.css']
})
export class OutlierMapComponent implements OnInit {

  outliers: BubbleChartData[] = [];

  constructor() { }

  ngOnInit() {
  }

}
