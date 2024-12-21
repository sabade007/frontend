import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../sharedmodule/common.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { DashboardComponent } from "./dashboard.component";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./../../service/interceptor.service";
import { NgxFileDropModule } from "ngx-file-drop";
import { StorageChartComponent } from "./storage-chart/storage-chart.component";

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SharedModule,
    DashboardRoutingModule,
    NgxFileDropModule,
  ],
  declarations: [DashboardComponent, StorageChartComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
})
export class DashboardModule {}
