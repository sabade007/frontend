import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy, NavParams } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatProgressBarModule } from "@angular/material/progress-bar";//taiga modules
import {
  PREVIEW_DIALOG_PROVIDER,
  TuiPreviewModule,
} from "@taiga-ui/addon-preview";
import { TuiSwipeModule } from "@taiga-ui/cdk";
import {
  TuiButtonModule,
  TuiDialogModule,
  TuiLoaderModule,
  TuiNotificationModule,
  TuiSvgModule,
} from "@taiga-ui/core";
import { PolymorpheusModule } from "@tinkoff/ng-polymorpheus";

// Shared Modules
import { SharedModule } from "./sharedmodule/common.module";
//components
import { PublicShareComponent } from "./components/public-share/public-share.component";
import { ForgotPasswordComponent } from "./components/auth/forgot-password/forgot-password.component";
import { SignupComponent } from "./components/auth/signup/signup.component";
import { HeaderComponent } from "./components/layouts/header/header.component";
import { FooterComponent } from "./components/layouts/footer/footer.component";
import { SidebarComponent } from "./components/layouts/sidebar/sidebar.component";
import { MainComponent } from "./components/main/main.component";
import { FileDeleteConfirmComponent } from "./components/modalpage/file-delete-confirm/file-delete-confirm.component";
import { ProfileComponent } from "./components/settings/profile/profile.component";
import { LogoutComponent } from "./components/modalpage/logout/logout.component";
import { SessionTimeoutComponent } from "./components/modalpage/session-timeout/session-timeout.component";
import { MoveCopyComponent } from "./components/modalpage/move-copy/move-copy.component";
import { MoreDetailsComponent } from "./components/modalpage/more-details/more-details.component";
import { ChangePasswordComponent } from "./components/auth/change-password/change-password.component";
import { EmailVerificationComponent } from "./components/modalpage/email-verification/email-verification.component";
import { PdfViwerComponent } from "./components/modalpage/pdf-viwer/pdf-viwer.component";
import { SessionExpiredComponent } from "./components/modalpage/session-expired/session-expired.component";
import { ResetPasswordComponent } from "./components/auth/reset-password/reset-password.component";
import { NotificationModelComponent } from "./components/modalpage/notification-model/notification-model.component";
// Services
import { CommonService } from "./service/common.service";
import { UserDetailService } from "./service/user-detail.service";
import { FilesService } from "./service/files.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { InterceptorService } from "./service/interceptor.service";
import { JwtInterceptorService } from "./service/jwt-interceptor.service";
import { ActivityServiceService } from "./service/activity-service.service";
import { TextEditorComponent } from "./components/modalpage/text-editor/text-editor.component";
import { VideoPlayerComponent } from "./components/modalpage/video-player/video-player.component";
import { AudioPlayerComponent } from "./components/modalpage/audio-player/audio-player.component";
import { SharingComponent } from "./components/modalpage/sharing/sharing.component";
import { PhotoViewerComponent } from "./components/modalpage/photo-viewer/photo-viewer.component";
import { MatPasswordStrengthModule } from "@angular-material-extensions/password-strength";
import { UserIdleModule } from "angular-user-idle";
import { HighchartsService } from "./components/highcharts.service";
import { SearchedResultComponent } from "./components/searched-result/searched-result.component";
import { NgxFileDropModule } from "ngx-file-drop";
import { ChatComponent } from "./components/chat/chat.component";
import { AuthGuardService } from "./service/auth-guard.service";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { SetupWizardComponent } from "./components/auth/setup-wizard/setup-wizard.component";
import { MatStepperModule } from "@angular/material/stepper";
import { FileuploadErrorComponent } from "./components/modalpage/fileupload-error/fileupload-error.component";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { DailogPopUpComponent } from "./components/modalpage/dailog-pop-up/dailog-pop-up.component";
import { RenameFilesComponent } from "./components/modalpage/rename-files/rename-files.component";
import { UpgradestorageRequestComponent } from "./components/modalpage/upgradestorage-request/upgradestorage-request.component";
import { SetPasswordComponent } from "./components/auth/set-password/set-password.component";
import { FullScreenPopupComponent } from "./components/modalpage/full-screen-popup/full-screen-popup.component";
import { PublicShareExpiredComponent } from "./components/public-share-expired/public-share-expired.component";
import { DuplicateFilesComponent } from "./components/modalpage/duplicate-files/duplicate-files.component";
import { Login4Component } from "./components/auth/login4/login4.component";
import { ServerMaintenanceComponent } from "./components/modalpage/server-maintenance/server-maintenance.component";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { CookieService } from "ngx-cookie-service";
import { AddGroupMembersComponent } from "./components/chat/add-group-members/add-group-members.component";
import { RemoveParticipantsPromptComponent } from "./components/chat/remove-participants-prompt/remove-participants-prompt.component";
import { LinkifyPipe } from './pipe/linkify.pipe';
import { DateFormatPipe } from './pipe/date-format.pipe';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { LandingComponent } from "./components/landing/landing.component";
import { CreateContactComponent } from "./components/modalpage/create-contact/create-contact.component";
import { EditContactComponent } from "./components/modalpage/edit-contact/edit-contact.component";
import { ViewContactComponent } from "./components/modalpage/view-contact/view-contact.component";
import { ViewGroupComponent } from "./components/modalpage/view-group/view-group.component";
import { DeleteGroupComponent } from "./components/modalpage/delete-group/delete-group.component";
import { CreateGroupComponent } from "./components/modalpage/create-group/create-group.component";
import { CreateChatGroupComponent } from "./components/chat/create-group/create-group.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StickyPopoverDirective } from "./validation/sticky-popover.directive";
import { ManageVersionsComponent } from "./components/modalpage/manage-versions/manage-versions.component";
import { DeleteFileVersionComponent } from "./components/modalpage/delete-file-version/delete-file-version.component";
import { MakeCurrentVersionComponent } from "./components/modalpage/make-current-version/make-current-version.component";
import { ContactAdminComponent } from "./components/auth/contact-admin/contact-admin.component";
import { WorkspaceComponent } from "./components/workspace/workspace.component";
import { CreateWorkspaceComponent } from "./components/modalpage/create-workspace/create-workspace.component";
import { WorkSpaceInfoComponent } from "./components/modalpage/work-space-info/work-space-info.component";
import { DeleteWorkSpaceComponent } from "./components/modalpage/delete-work-space/delete-work-space.component";
import { EditWorkspaceComponent } from "./components/modalpage/edit-workspace/edit-workspace.component";
import { ImportfilesWorkSpaceComponent } from "./components/modalpage/importfiles-work-space/importfiles-work-space.component";
import { NewChatComponent } from "./components/chat/new-chat/new-chat.component";
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ShareComponent } from "./components/modalpage/share/share.component";
import { GeneratelinkComponent } from "./components/modalpage/generatelink/generatelink.component";
import { EditpubliclinkComponent } from "./components/modalpage/editpubliclink/editpubliclink.component";
import { DeletePublicLinkComponent } from "./components/modalpage/delete-public-link/delete-public-link.component";
import { DisablAllPublicLinksComponent } from "./components/modalpage/disabl-all-public-links/disabl-all-public-links.component";

@NgModule({
    declarations: [
        AppComponent,
        ForgotPasswordComponent,
        ContactAdminComponent,
        SignupComponent,
        HeaderComponent,
        FooterComponent,
        SidebarComponent,
        MainComponent,
        ProfileComponent,
        LogoutComponent,
        SessionTimeoutComponent,
        MoveCopyComponent,
        MoreDetailsComponent,
        SessionExpiredComponent,
        FileDeleteConfirmComponent,
        ResetPasswordComponent,
        ChangePasswordComponent,
        EmailVerificationComponent,
        PdfViwerComponent,
        TextEditorComponent,
        VideoPlayerComponent,
        AudioPlayerComponent,
        SharingComponent,
        PhotoViewerComponent,
        PublicShareComponent,
        SearchedResultComponent,
        NotificationModelComponent,
        ChatComponent,
        AddGroupMembersComponent,
        PageNotFoundComponent,
        SetupWizardComponent,
        FileuploadErrorComponent,
        DailogPopUpComponent,
        RenameFilesComponent,
        UpgradestorageRequestComponent,
        SetPasswordComponent,
        FullScreenPopupComponent,
        PublicShareExpiredComponent,
        DuplicateFilesComponent,
        Login4Component,
        ServerMaintenanceComponent,
        RemoveParticipantsPromptComponent,
        LinkifyPipe,
        DateFormatPipe,
        LandingComponent,
        CreateContactComponent,
        EditContactComponent,
        ViewContactComponent,
        ViewGroupComponent,
        DeleteGroupComponent,
        StickyPopoverDirective,
        ManageVersionsComponent,
        DeleteFileVersionComponent,
        CreateGroupComponent,
        CreateChatGroupComponent,
        StickyPopoverDirective,
        MakeCurrentVersionComponent,
        WorkspaceComponent,
        CreateWorkspaceComponent,
        WorkSpaceInfoComponent,
        DeleteWorkSpaceComponent,
        EditWorkspaceComponent,
        ImportfilesWorkSpaceComponent,
        NewChatComponent,
        ShareComponent,
        GeneratelinkComponent,
        EditpubliclinkComponent,
        DeletePublicLinkComponent,
        DisablAllPublicLinksComponent
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SharedModule,
        MatPasswordStrengthModule,
        // CookieService,
        MatSnackBarModule,
        MatStepperModule,
        NgxFileDropModule,
        UserIdleModule.forRoot({ idle: 600, timeout: 5, ping: 30 }),
        MatProgressBarModule,
        TuiPreviewModule,
        TuiSwipeModule,
        TuiButtonModule,
        TuiLoaderModule,
        TuiNotificationModule,
        TuiSvgModule,
        PolymorpheusModule,
        TuiDialogModule,
        MatProgressBarModule,
        InfiniteScrollModule,
        PickerModule,
        ScrollingModule,
    ],
    exports: [
        LinkifyPipe,
        NgbModule,
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        CommonService,
        PREVIEW_DIALOG_PROVIDER,
        AuthGuardService,
        UserDetailService,
        FilesService,
        ActivityServiceService,
        HighchartsService,
        MatSnackBar,
        CookieService,
        MatStepperModule,
        NavParams,
        { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
