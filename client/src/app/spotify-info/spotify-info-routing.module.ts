import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@app/auth.guard';
import { HomeComponent } from './home/home.component';
import { PlaylistComponent } from './playlist/playlist.component';

const routes: Routes = [
  {
    path: 'spotify', component: HomeComponent, canActivate: [AuthGuard],
    children: [
      { path: 'user/:user/playlist/:id', component: PlaylistComponent, canActivate: [AuthGuard], runGuardsAndResolvers: 'always'},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class SpotifyInfoRoutingModule { }
