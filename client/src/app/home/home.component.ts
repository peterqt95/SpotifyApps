import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LoginService } from '@app/services/login.service';
import { LeetcodeNote } from '@app/models/LeetcodeNote';
import { LeetcodeNoteService } from '@app/services/leetcode-note.service';
import { PartialObserver } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  // User notes
  leetcodeNotes: LeetcodeNote[] = [];

  // Load status
  loadStatus: LoadStatus = new LoadStatus();

  // Displayed Columns
  displayedColumns: string[] = ['myId', 'title', 'edit'];
  dataSource: MatTableDataSource<LeetcodeNote>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private loginService: LoginService,
    private leetcodeService: LeetcodeNoteService
  ) { }

  ngOnInit() {
    this.getLeetcodeNotes(this.loginService.currentUserValue.userId);
  }

  private getLeetcodeNotes(userId: number): void {
    this.leetcodeService.get({userId}).subscribe(this.getLeetcodeNotesSub());
  }

  private getLeetcodeNotesSub(): PartialObserver<any> {
    return {
      next: (results) => {
        this.leetcodeNotes = results;
        this.dataSource = new MatTableDataSource(this.leetcodeNotes);
        this.dataSource.paginator = this.paginator;
      },
      complete: () => {
        this.loadStatus.isLoaded = true;
      }
    };
  }

}
