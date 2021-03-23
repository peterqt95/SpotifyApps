import { Component, Input, OnInit } from '@angular/core';
import { BarChartData } from '@app/shared/Classes/ngx-charts/BarChartData';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  @Input() results: BarChartData[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;

  single: any[];
  multi: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  showYAxisLabel = true;

  colorScheme = {
    domain: ['#237FA2', '#314EAF']
  };


  constructor() { }

  ngOnInit() {
  }

  public onSelect(event): void {
    console.log(event);
  }

}
