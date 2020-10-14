import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material';

@Component({
  selector: 'app-mat-table-display',
  templateUrl: './mat-table-display.component.html',
  styleUrls: ['./mat-table-display.component.css']
})
export class MatTableDisplayComponent implements OnInit {

  // Displayed Columns
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;
  data: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // Set the table
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public addRemoveModal(remove: boolean) {
    if (remove) {
      console.log('removing');
    } else {
      console.log('adding');
    }
  }

}
