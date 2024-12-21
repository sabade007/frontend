import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { SharedModule } from '../../sharedmodule/common.module';
import { DeletedFilesComponent } from './deleted-files.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from './../../service/interceptor.service';
import { DeletedRoutingModule } from './deleted-routing.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    InfiniteScrollModule,
    DeletedRoutingModule
  ],
  declarations: [
    DeletedFilesComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
})
export class DeletedModule { }