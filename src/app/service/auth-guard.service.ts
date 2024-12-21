import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { environment } from './../../environments/environment.prod';
import { Observable, of } from 'rxjs';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Injectable()
export class AuthGuardService implements CanActivate{

Environment: any = environment;
isLogin: any;
allowSignup: any;

constructor(
    public router: Router,
    private localService: LocalService
    ) { }
canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.isLogin = this.localService.getJsonValue(localData.isLogin)
        this.allowSignup = this.localService.getJsonValue(localData.allowSignUp)
        if(!this.isLogin && this.allowSignup === 'true'){
            this.router.navigate(['/login']);
            return false;
        }
        else if(!this.isLogin && this.allowSignup === 'false'){
            this.router.navigate(['/login']);
            return false;
        }
        return true;    
    }

}
