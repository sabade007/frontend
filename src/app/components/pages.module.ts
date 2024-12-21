import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PagesRoutingModule } from "./pages-routing.module";

import { SharedModule } from "../sharedmodule/common.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { SharedDocModule } from "./shared/shared.module";
import { ContactsComponent } from "./contacts/contacts.component";
import { AllnotificationComponent } from "./allnotification/allnotification.component";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./../service/interceptor.service";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { VideoPlayerComponent } from './modalpage/video-player/video-player.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    PagesRoutingModule,
    DashboardModule,
    SharedDocModule,
    MatDialogModule,
  ],
  declarations: [
    ContactsComponent,
    AllnotificationComponent,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {
      provide: MatDialogRef,
      useValue: {},
    },
  ],
})
export class PagesModule {}
