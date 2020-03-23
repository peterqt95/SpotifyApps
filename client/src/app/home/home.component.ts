import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { LoginService } from '@app/services/login.service';
import { LeetcodeNote } from '@app/models/LeetcodeNote';
import { LeetcodeNoteService } from '@app/services/leetcode-note.service';
import { PartialObserver, Observable } from 'rxjs';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SpotifyService } from '@app/services/spotify.service';
import { SpotifyAuthUrl } from '@app/models/SpotifyAuthUrl';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, mergeMap } from 'rxjs/operators';
import { SpotifyUser } from '@app/models/SpotifyUser';

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
    private leetcodeService: LeetcodeNoteService,
    private spotifyService: SpotifyService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    // this.getLeetcodeNotes(this.loginService.currentUserValue.userId);
    this.getSpotifyLogin();
  }

  private getSpotifyLogin(): void {
    // this.spotifyService.getSpotifyAuthToken().subscribe(this.getSpotifyLoginSub());

    this.spotifyService.getSpotifyAuthToken().pipe(mergeMap( (results: SpotifyAuthUrl) => {
      return this.getSpotifyUser(results);
    })).subscribe(this.getSpotifyUserSub());
  }

  private getSpotifyUser(results: SpotifyAuthUrl): Observable<any> {
      const spotifyCode = this.router.parseUrl(this.router.url).queryParamMap.get('code');
      
      // Validate code
      if (spotifyCode == null) {
        window.location.href = results.authUrl;
      }

      return this.spotifyService.getSpotifyUser(spotifyCode);
  }

  private getSpotifyUserSub(): PartialObserver<any> {
    return {
      next: (results: SpotifyUser) => {
        console.log(results);
      },
      error: (err) => {
        // Need to route back to login
        this.loginService.logout();
        this.router.navigate(['/login']);
      },
      complete: () => {
        this.loadStatus.isLoaded = true;
      }
    };
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
