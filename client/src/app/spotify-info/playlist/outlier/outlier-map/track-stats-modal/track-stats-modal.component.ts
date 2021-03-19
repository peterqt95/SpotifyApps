import { Component, Input, OnInit } from '@angular/core';
import { SpotifyAlbum } from '@app/models/SpotifyAlbum';
import { SpotifyTrack } from '@app/models/SpotifyTrack';
import { TrackStats } from '@app/models/TrackStats';
import { SpotifyService } from '@app/services/spotify.service';
import { LoadStatus } from '@app/shared/Classes/LoadStatus';
import { ModalComponent } from '@app/shared/Classes/ModalComponent';
import { MatTableDisplayComponent } from '@app/shared/Components/mat-table-display/mat-table-display.component';
import { PartialObserver } from 'rxjs';

@Component({
  selector: 'app-track-stats-modal',
  templateUrl: './track-stats-modal.component.html',
  styleUrls: ['./track-stats-modal.component.css']
})
export class TrackStatsModalComponent extends MatTableDisplayComponent implements OnInit, ModalComponent {
  
  // Spotify Track
  @Input() data: TrackStats;

  // Album Info
  spotifyAlbum: SpotifyAlbum = null;

  loadStatus: LoadStatus = new LoadStatus();

  constructor(
    private spotifyService: SpotifyService,
  ) {
    super();
  }

  ngOnInit() {
    // Fetch album information
    this.getAlbumInformation(this.data.trackInfo.albumId);
  }

  private getAlbumInformation(albumId: string): void {
    this.spotifyService.getAlbumInfo(albumId).subscribe(this.getAlbumInformationSub());
  }

  private getAlbumInformationSub(): PartialObserver<any> {
    return {
      next: (result: SpotifyAlbum) => {
        this.spotifyAlbum = result;
        console.log(this.spotifyAlbum);
        
        // Initialize table
        this.tableData = this.spotifyAlbum.tracks;
        this.displayedColumns = ['name', 'duration'];
        super.ngOnInit();
      },
      error: (err) => {},
      complete: () => {
        this.loadStatus.isLoaded = true;
      }

    };
  }

}
