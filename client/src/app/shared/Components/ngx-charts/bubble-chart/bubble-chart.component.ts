import { Component, Input, OnInit } from '@angular/core';
import { BubbleChartData } from '@app/shared/Classes/ngx-charts/BubbleChartData';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css']
})
export class BubbleChartComponent implements OnInit {

  @Input() results: BubbleChartData[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;

  bubbleData: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  maxRadius = 20;
  minRadius = 5;
  yScaleMin = 0;
  yScaleMax = 100;

  colorScheme = {
    domain: ['#3f51b5']
  };

  constructor() {
  }

  ngOnInit() {
  }

  public onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  public onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  public onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

}
