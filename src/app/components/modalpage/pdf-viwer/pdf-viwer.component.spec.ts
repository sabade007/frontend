import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { environment } from 'src/environments/environment.prod';

import { PdfViwerComponent } from './pdf-viwer.component';

describe('PdfViwerComponent', () => {
  let component: PdfViwerComponent;
  let fixture: ComponentFixture<PdfViwerComponent>;
  let service : FilesService;
  let service1 : CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(PdfViwerComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfViwerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PdfViwerComponent);
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

  it('check getbase64 response', (done) => {
    service.getBase64ofFile(2225,"files","2223",'','').subscribe( (resp: any) => {
     expect(resp.responseCode).not.toBe('');
     done();
    })
  });

  it('open pdf response', () => {
    const previewData= {
      "password": service.encryptpassword('root'+"ROxB0YMgztxHd4VLG5oMkzOBzJoeKE"),
      "token": "ROxB0YMgztxHd4VLG5oMkzOBzJoeKE"
    }
    spyOn(service, 'OpenDocument').and.returnValue(of(previewData))
    component.OnOpenDoc();
    expect(service.OpenDocument).toHaveBeenCalled();
  })
  
});
