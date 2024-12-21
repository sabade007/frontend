import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../../sharedmodule/common.module";
import { SharedRoutingModule } from "./shared-routing.module";
import { SharedComponent } from "./shared.component";

import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./../../service/interceptor.service";

@NgModule({
  declarations: [SharedComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    SharedModule,
    SharedRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  ],
})
export class SharedDocModule {}
