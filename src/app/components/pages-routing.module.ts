import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { ContactsComponent } from "./contacts/contacts.component";
import { AllnotificationComponent } from "./allnotification/allnotification.component";
import { ProfileComponent } from "./settings/profile/profile.component";
import { SearchedResultComponent } from "./searched-result/searched-result.component";
import { ChatComponent } from "./chat/chat.component";
import { VideoPlayerComponent } from "./modalpage/video-player/video-player.component";
import { WorkspaceComponent } from "./workspace/workspace.component";

const routes: Routes = [
  {
    path: "",
    component: MainComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: () =>
          import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
        // loadChildren: './components/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: "files",
        loadChildren: () =>
          import("./files/files.module").then((m) => m.FilesModule),
        // loadChildren: './files/files.module#FilesModule'
      },
      {
        path: "photos",
        loadChildren: () =>
          import("./photos/photos.module").then((m) => m.PhotosModule),
        // loadChildren: './photos/photos.module#PhotosModule'
      },
      {
        path: "activity",
        loadChildren: () =>
          import("./activity/activity.module").then((m) => m.ActivityModule),
      },
      {
        path: "trash",
        loadChildren: () =>
          import("./deleted-files/deleted.module").then((m) => m.DeletedModule),
      },
      {
        path: "contacts",
        component: ContactsComponent,
      },
      {
        path: "allnotifications",
        component: AllnotificationComponent,
      },
      {path:"videos",component :VideoPlayerComponent},
      {
        path: "settings/profile",
        component: ProfileComponent,
      },
      {
        path: "searched-results",
        component: SearchedResultComponent,
      },
      {
        path: "chat",
        component: ChatComponent,
      },
      {
        path: "workSpace",
        component: WorkspaceComponent,
      },
      {
        path: "shared",
        loadChildren: () =>
          import("./shared/shared.module").then((m) => m.SharedDocModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
