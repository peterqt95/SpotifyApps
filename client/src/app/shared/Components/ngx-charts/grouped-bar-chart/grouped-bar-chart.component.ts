import { Component, OnInit, Input } from '@angular/core';
import { GroupedBarChartData } from '@app/shared/Classes/ngx-charts/GroupedBarChartData';

@Component({
  selector: 'app-grouped-bar-chart',
  templateUrl: './grouped-bar-chart.component.html',
  styleUrls: ['./grouped-bar-chart.component.css']
})
export class GroupedBarChartComponent implements OnInit {

  @Input() results: GroupedBarChartData[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendPosition = 'right';
  showXAxisLabel = true;
  yAxisLabel = 'Value';
  showYAxisLabel = true;
  xAxisLabel = 'Feature';

  colorScheme = {
    domain: ['#237FA2', '#314EAF']
  };
  
  constructor() { }

  ngOnInit() {
  }

}
