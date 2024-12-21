import { QuicklinkModule } from 'ngx-quicklink';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
// import { NgxUiLoaderModule, NgxUiLoaderConfig } from "ngx-ui-loader";
import { LightboxComponent, LightboxModule } from "ngx-acuw";
import { NgPipesModule, NgDatePipesModule } from 'ngx-pipes';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//Taiga-ui
import {TuiDialogModule, TuiRootModule} from '@taiga-ui/core';
import {TuiPreviewModule} from '@taiga-ui/addon-preview';
import {TuiButtonModule} from '@taiga-ui/core';
import {PREVIEW_DIALOG_PROVIDER} from '@taiga-ui/addon-preview';
import {TuiSwipeModule} from '@taiga-ui/cdk';
import {
    TuiLoaderModule,
    TuiNotificationModule,
    TuiSvgModule,
} from '@taiga-ui/core';
import {PolymorpheusModule} from '@tinkoff/ng-polymorpheus';

// Angular Material
import { MatCardModule} from '@angular/material/card';
import { MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule }  from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { IonicModule } from '@ionic/angular';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatStepperModule} from '@angular/material/stepper';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxFileDropModule } from 'ngx-file-drop';

// Custom Directives
import { StringDirective } from "../validation/stringOnly.directive";
import { NumberDirective } from "../validation/numbers-only.directive";
import { AlphaNumericDirective } from "../validation/alpha-numeric.directive";

import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from "ngx-ui-loader";
import { TuiTabsModule } from '@taiga-ui/kit';
import {TuiLazyLoadingModule} from '@taiga-ui/kit'
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

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        ToastrModule.forRoot({
            timeOut: 5000,
            maxOpened: 1,
            preventDuplicates: true,
            closeButton: true,
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
        IonicModule,
        MatProgressBarModule,
        NgMultiSelectDropDownModule.forRoot(),
        ClipboardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxFileDropModule,
        MatStepperModule,
        TuiRootModule,
        TuiPreviewModule,
        TuiButtonModule,
        TuiSwipeModule,
        TuiLoaderModule,
        TuiNotificationModule,
        TuiSvgModule,
        TuiTabsModule,
        PolymorpheusModule, TuiDialogModule,
        MatExpansionModule,
        TuiLazyLoadingModule
    ],
    exports: [
        CommonModule,
        IonicModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule,
        ToastrModule,
        NgxUiLoaderModule,
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
        IonicModule,
        MatProgressBarModule,
        ClipboardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatStepperModule,
        TuiRootModule,
        TuiPreviewModule,
        TuiButtonModule,
        TuiSwipeModule,
        TuiLoaderModule,
        TuiNotificationModule,
        TuiSvgModule,
        TuiTabsModule,
        PolymorpheusModule, TuiDialogModule,
        MatExpansionModule
    ],
    declarations: [
        NumberDirective,
        StringDirective,
        AlphaNumericDirective
    ]
})
export class SharedModule {}