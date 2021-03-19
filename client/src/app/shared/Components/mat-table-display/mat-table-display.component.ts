import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { SpotifyTrack } from '@app/models/SpotifyTrack';

@Component({
  selector: 'app-mat-table-display',
  templateUrl: './mat-table-display.component.html',
  styleUrls: ['./mat-table-display.component.css']
})
export class MatTableDisplayComponent implements OnInit {

  // Displayed Columns
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  tableData: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // Set the table
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRemoveModal(remove: boolean, selected: SelectionModel<SpotifyTrack>) {
    if (remove) {
      selected.selected.forEach( (spotifyTrack: SpotifyTrack) => {
        const trackId = spotifyTrack.id;
        const index = this.dataSource.data.findIndex((sourceSpotifyTrack: SpotifyTrack) => sourceSpotifyTrack.id === trackId);
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = [...this.dataSource.data];
      });
    } else {
      console.log('adding');
    }
  }

}
