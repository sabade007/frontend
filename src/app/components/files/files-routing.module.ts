import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FilesComponent } from './files.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { VideoPlayerComponent } from '../modalpage/video-player/video-player.component';

const routes: Routes = [
  {
    path: 'all',
    component: FilesComponent
  },
  { path: 'favorite', component: FavoritesComponent },
  { path: 'videos', component: VideoPlayerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilesRoutingModule { }