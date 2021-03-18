import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { SpotifyInfoRoutingModule } from '@app/spotify-info/spotify-info-routing.module';

import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { OutlierModalComponent } from './playlist/outlier-modal/outlier-modal.component';
import { OutlierComponent } from './playlist/outlier/outlier.component';
import { RemoveDataComponent } from './playlist/outlier/remove-data/remove-data.component';
import { OutlierMapComponent } from './playlist/outlier/outlier-map/outlier-map.component';
import { TrackStatsModalComponent } from './playlist/outlier/outlier-map/track-stats-modal/track-stats-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    PlaylistComponent,
    OutlierModalComponent,
    OutlierComponent,
    RemoveDataComponent,
    OutlierMapComponent,
    TrackStatsModalComponent,
  ],
  imports: [
    SharedModule,
    SpotifyInfoRoutingModule
  ],
  entryComponents: [
    OutlierModalComponent,
    TrackStatsModalComponent
  ],
})
export class SpotifyInfoModule { }
