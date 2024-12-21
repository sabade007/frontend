import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { UserIdleService } from 'angular-user-idle';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  token: any;

  constructor(private commonService:CommonService,
    private userIdle: UserIdleService,
    private localService: LocalService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token =this.localService.getJsonValue(localData.token);
    if (this.token) {
      this.userIdle.resetTimer();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.token}`
        }
      });
    }
    return next.handle(request)
  }z
}
