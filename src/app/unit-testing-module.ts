import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

//common imports
import { PopoverController, IonicModule, NavParams } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InterceptorService } from './service/interceptor.service';
import { JwtInterceptorService } from './service/jwt-interceptor.service';
import { CommonService } from './service/common.service';
import { UserDetailService } from './service/user-detail.service';
import { FilesService } from './service/files.service';
import { ActivityServiceService } from './service/activity-service.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './sharedmodule/common.module';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { UserIdleModule } from 'angular-user-idle';
import { CommonModule } from '@angular/common';
import { FilesRoutingModule } from './components/files/files-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuicklinkModule } from 'ngx-quicklink';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgDatePipesModule, NgPipesModule } from 'ngx-pipes';
import { LightboxModule } from 'ngx-acuw';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: "#1D5686",
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 50,
  bgsType: SPINNER.squareJellyBox, // background spinner type
  fgsType: SPINNER.squareJellyBox, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 0, // progress bar thickness
  overlayColor: "rgba(40, 40, 40, 0.8)",
};

export class UnitTestingModule {
  public static setUpTestBed = (TestingComponent: any) => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
           CommonService,
           UserDetailService,
           FilesService,
           ActivityServiceService,
           FormBuilder,HttpClient,NavParams,
        { provide: ActivatedRoute, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: PopoverController, useValue: {} },
        { provide: ToastrService, useValue: {} },
        { provide: PopoverController, useValue: {} },
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
        ],

        imports: [
          CommonModule,
          BrowserModule, 
          IonicModule.forRoot(), 
          AppRoutingModule,
          BrowserAnimationsModule,
          HttpClientModule,
          SharedModule,
          MatPasswordStrengthModule,
          UserIdleModule.forRoot({idle: 600, timeout: 5, ping: 30}),
          FilesRoutingModule,
          InfiniteScrollModule,
          CommonModule,
          IonicModule,
          FormsModule,
          ReactiveFormsModule,
          RouterModule,
          ToastrModule.forRoot({
              preventDuplicates: true
          }),
          NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
          MatCardModule,
          MatDialogModule,
          MatFormFieldModule,
          MatInputModule,
          MatIconModule,
          MatButtonModule,
          MatSlideToggleModule,
          MatTabsModule,
          MatTableModule,
          MatPaginatorModule,
          MatSelectModule,
          MatCheckboxModule,
          MatSortModule,
          MatToolbarModule,
          MatSidenavModule,
          MatListModule,
          MatRadioModule,
          MatTooltipModule,
          MatAutocompleteModule,
          MatDividerModule,
          MatRippleModule,
          MatBadgeModule,
          MatMenuModule,
          MatChipsModule,
          LightboxModule,
          NgPipesModule,
          NgDatePipesModule,
          NgxExtendedPdfViewerModule,
          QuicklinkModule,
          MatProgressBarModule,
          NgMultiSelectDropDownModule.forRoot(),
          ClipboardModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatCheckboxModule,
          MatMenuModule,
        ]

      });
    });
  }
}
