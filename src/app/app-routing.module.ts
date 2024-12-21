import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PublicShareComponent } from './components/public-share/public-share.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component'
import { QuicklinkStrategy } from 'ngx-quicklink';
import { AuthGuardService } from './service/auth-guard.service';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SetupWizardComponent } from './components/auth/setup-wizard/setup-wizard.component';
import { SetPasswordComponent } from './components/auth/set-password/set-password.component';
import { VideoPlayerComponent } from './components/modalpage/video-player/video-player.component';
import { PublicShareExpiredComponent } from './components/public-share-expired/public-share-expired.component';
import { Login4Component } from './components/auth/login4/login4.component';
import { LandingComponent } from './components/landing/landing.component';

const routes: Routes = [
  { path: 'login', component: Login4Component},
  { path: 'create-account', component: SignupComponent, canActivate : [AuthGuardService] },
  // { path: 'setupWizard', component: SetupWizardComponent },
  { path: 'publicShare/:token', component: PublicShareComponent},
  { path: 'user', 
      loadChildren: () => import('./components/pages.module').then(m => m.PagesModule), canActivate: [AuthGuardService],
    // loadChildren: './components/pages.module#PagesModule'
  },
  { path: '', component: LandingComponent },
  { path: 'resetpassword/:token', component: ResetPasswordComponent},
  { path: 'setpassword/:token', component: SetPasswordComponent},
  { path: 'setupWizard', component: SetupWizardComponent},
  { path: 'videos', component: VideoPlayerComponent},
  { path: 'publicShare-expired', component: PublicShareExpiredComponent},
  { path: '**', component: PageNotFoundComponent}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    // RouterModule.forRoot(
    //   routes,
    //   {
    //     useHash: true,
    //     preloadingStrategy: QuicklinkStrategy
    //   }
    // )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
