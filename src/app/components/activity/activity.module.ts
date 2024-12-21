import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from "@angular/router";
import { SharedModule } from '../../sharedmodule/common.module';
import { ActivityRoutingModule } from './activity-routing.module';
import { ActivityComponent } from './activity.component';

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from './../../service/interceptor.service';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; 

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    SharedModule,
    ActivityRoutingModule,
    FullCalendarModule // register FullCalendar with you app
  ],
  declarations: [
    ActivityComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }
  ],
})
export class ActivityModule { }