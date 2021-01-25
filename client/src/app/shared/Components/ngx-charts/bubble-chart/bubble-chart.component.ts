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
  yScaleMin = 70;
  yScaleMax = 85;

  colorScheme = {
    domain: ['#3f51b5']
  };

  constructor() {
    this.bubbleData = [
      {
        name: 'Outliers',
        series: [
          {
            name: 'Song 1',
            x: 1.2,
            y: 80.3,
            r: 80.4
          },
          {
            name: 'Song 2',
            x: 3.5,
            y: 80.3,
            r: 78
          },
          {
            name: 'Song 3',
            x: 8,
            y: 75.4,
            r: 79
          }
        ]
      }
    ];
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
