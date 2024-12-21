import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from "@angular/router";
import { PhotosRoutingModule } from './photos-routing.module';
import { PhotosComponent } from './photos.component';
import { PhotosFavoritesComponent } from './photos-favorites/photos-favorites.component';
import { SharedModule } from '../../sharedmodule/common.module';
import { NgImageFullscreenViewModule } from 'ng-image-fullscreen-view';
import {TuiPreviewModule} from '@taiga-ui/addon-preview';
import {PolymorpheusModule} from '@tinkoff/ng-polymorpheus';
import {TuiButtonModule} from '@taiga-ui/core';
import {TuiSvgModule} from '@taiga-ui/core';
import {
  TuiNotificationsModule,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import {

  TuiLoaderModule,
  TuiNotificationModule,
  
} from '@taiga-ui/core';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    PhotosRoutingModule,
    SharedModule,
    NgImageFullscreenViewModule ,
    TuiPreviewModule,
    PolymorpheusModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiNotificationsModule,
    TuiDialogModule,
    TuiRootModule,
    TuiLoaderModule,
  TuiNotificationModule
  ],
  declarations: [
      PhotosComponent,
      PhotosFavoritesComponent
      
  ]
})
export class PhotosModule { }