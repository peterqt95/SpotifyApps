import { Component, OnInit } from '@angular/core';
import { LeetcodeNoteService } from '@app/services/leetcode-note.service';
import { PartialObserver } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { ActivatedRoute } from '@angular/router';
import { LeetcodeNote } from '@app/models/LeetcodeNote';

@Component({
  selector: 'app-problem',
  templateUrl: './problem.component.html',
  styleUrls: ['./problem.component.css']
})
export class ProblemComponent implements OnInit {

  // Note
  note: LeetcodeNote;

  // Load status
  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private leetcodeService: LeetcodeNoteService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Get the leetcode id
    const id = +this.route.snapshot.params['id'];
    this.getLeetcodeNote(id);
  }

  private getLeetcodeNote(noteId: number): void {
    this.leetcodeService.getNote(noteId, {}).subscribe(this.getLeetcodeNoteSub());
  }

  private getLeetcodeNoteSub(): PartialObserver<any> {
    return {
      next: (result) => {
        this.note = result;
        console.log(this.note);
      },
      complete: () => {
        this.loadStatus.isLoaded = true;
        if (this.note.myId == null) {
          this.loadStatus.isError = true;
        }
        console.log(this.loadStatus);
      }
    };
  }
}
