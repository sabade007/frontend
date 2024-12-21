import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs/internal/observable/of';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { environment } from 'src/environments/environment.prod';

import { PhotoViewerComponent } from './photo-viewer.component';

describe('PhotoViewerComponent', () => {
  let component: PhotoViewerComponent;
  let fixture: ComponentFixture<PhotoViewerComponent>;
  let service : FilesService;
  let service1 : CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(PhotoViewerComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoViewerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoViewerComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
   // fixture.detectChanges();
  }));
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check captcha response', (done) => {
    service1.captcha().subscribe((resp: any) => {
      expect(resp.captchaId).not.toBe(null);
      captcha = resp['captchaId'];
      done();
    });
  });

  it('check login response', (done) => {
    let data = {
      "captchaId": captcha,
      "captchaValue": '12345',
      "password": service.encryptpassword('Root@123'),
      "username": 'anushats'
    }
    service1.userSignIn(data).subscribe((resp: any) => {
      environment.isLoggedIn = true
     sessionStorage.setItem('token', resp.token);
     sessionStorage.setItem('parentId', resp.parentId);
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

  // it('check getbase64 response', (done) => {
  //   service.getBase64ofFile(2244,"files","2223",'').subscribe( (resp: any) => {
  //    expect(resp.responseCode).not.toBe('');
  //    done();
  //   })
  // });

  it('open photo response', () => {
    const previewData= {
      "password": service.encryptpassword('root'+"C0V5CuTRU0RCkx4bI6r0spa48wayl5"),
      "token": "C0V5CuTRU0RCkx4bI6r0spa48wayl5"
    }
    spyOn(service, 'OpenDocument').and.returnValue(of(previewData))
    component.OnOpenDoc();
    expect(service.OpenDocument).toHaveBeenCalled();
  })

});
