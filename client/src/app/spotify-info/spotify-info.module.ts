import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { SpotifyInfoRoutingModule } from '@app/spotify-info/spotify-info-routing.module';

import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';
import { OutlierModalComponent } from './playlist/outlier-modal/outlier-modal.component';

@NgModule({
  declarations: [
    HomeComponent,
    PlaylistComponent,
    OutlierModalComponent,
  ],
  imports: [
    SharedModule,
    SpotifyInfoRoutingModule
  ],
  entryComponents: [
    OutlierModalComponent
  ],
})
export class SpotifyInfoModule { }
