import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PhotosComponent } from './photos.component';
import { PhotosFavoritesComponent } from './photos-favorites/photos-favorites.component';

import { VideosComponent } from './videos/videos.component';

import { VideoPlayerComponent } from '../modalpage/video-player/video-player.component';


const routes: Routes = [
  {
    path: 'all',
    component: PhotosComponent
  },
  { path: 'favorite', component: PhotosFavoritesComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotosRoutingModule {}