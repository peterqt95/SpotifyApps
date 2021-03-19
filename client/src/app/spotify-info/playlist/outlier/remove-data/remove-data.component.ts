import { Component, OnInit, Input } from '@angular/core';
import { MatTableDisplayComponent } from '@app/shared/Components/mat-table-display/mat-table-display.component';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { SpotifyTrackFeatures } from '@app/models/SpotifyTrackFeatures';
import { DescriptiveStats } from '@app/models/SpotifyAudioAnalysis';
import { GroupedBarChartData } from '@app/shared/Classes/ngx-charts/GroupedBarChartData';
import { ChartDataPoint } from '@app/shared/Classes/ngx-charts/ChartDataPoint';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-remove-data',
  templateUrl: './remove-data.component.html',
  styleUrls: ['./remove-data.component.css']
})
export class RemoveDataComponent extends MatTableDisplayComponent implements OnInit {

  @Input() outliers: SpotifyTrack[];
  @Input() trackFeatures: SpotifyTrackFeatures[];
  @Input() featureDescriptions: DescriptiveStats[];
  @Input() playlistLoaded: boolean;
  @Input() detailsLoaded: boolean;

  // Track comparisson details
  trackFeatureComparissonData: GroupedBarChartData[] = [];

  // Selected tracks to remove
  selectedForRemoval: SelectionModel<SpotifyTrack> = new SelectionModel<SpotifyTrack>(true, []);

  ngOnInit() {
    this.tableData = this.outliers;
    this.displayedColumns = ['checked', 'name', 'artists', 'album', 'duration', 'analysis'];
    super.ngOnInit();
  }

  public showFullDetails(trackId: string): void {
    // Reset data
    this.trackFeatureComparissonData = [];
    
    // Build chart data
    const currentTrackFeatures = this.trackFeatures.find(track => track.id === trackId);
    const featureNames = ['danceability', 'energy', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo'];
    featureNames.forEach(feature => {
      // Get the average of the entire playlist
      const playlistFeatureStats = this.featureDescriptions.find((stats: DescriptiveStats) => stats.type === feature);
      
      // Add the series data for the chart
      const seriesData: ChartDataPoint[] = [];
      const currentFeatureStat = new ChartDataPoint({name: 'Current', value: currentTrackFeatures[feature]});
      const playlistStat = new ChartDataPoint({name: 'Average', value: playlistFeatureStats.mean});
      seriesData.push(currentFeatureStat, playlistStat);

      // Scale tempo down
      if (feature === 'tempo') {
        seriesData[0].value = seriesData[0].value / 100;
        seriesData[1].value = seriesData[1].value / 100;
      }

      // Add to GroupedBarChart Data
      this.trackFeatureComparissonData.push(new GroupedBarChartData({name: feature, series: seriesData}));
    });

    // Set which components loaded
    this.toggle();
  }

  public toggle(): void {
    this.playlistLoaded = !this.playlistLoaded;
    this.detailsLoaded = !this.detailsLoaded;
  }

  public isAllSelected(): boolean {
    const numSelected = this.selectedForRemoval.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAll(): void {
    this.isAllSelected()
    ? this.selectedForRemoval.clear()
    : this.dataSource.data.forEach(row => this.selectedForRemoval.select(row));
  }

}
