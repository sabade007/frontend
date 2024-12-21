import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TextEditorComponent } from './text-editor.component';
import { UnitTestingModule } from 'src/app/unit-testing-module';
import { CommonService } from 'src/app/service/common.service';
import { of } from 'rxjs/internal/observable/of';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';

describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;
  let service : FilesService;
  let service1 :CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(TextEditorComponent);
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TextEditorComponent ],
    }).compileComponents();
    service = TestBed.inject(FilesService);
    service1 = TestBed.inject(CommonService);
    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
  }));

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
      "username": 'mouni'
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
    service.getBase64ofFile(2207,"files","541",'','').subscribe( (resp: any) => {
     expect(resp.responseCode).not.toBe('');
     done();
    })
  });

  it('get data', () => {
    const response: any = {
      "password": service.encryptpassword('Root'+"ZBWHcB9im3MNHB0Nj3uJdEj6n4qh97"),
      "token": "ZBWHcB9im3MNHB0Nj3uJdEj6n4qh97"
    };
    spyOn(service, 'OpenDocument').and.returnValue(of(response))
    component.OnOpenDoc();
    expect(service.OpenDocument).toHaveBeenCalled();
  })

  it('get data', () => {
    const response: any = {
      'content': window.btoa('mouna'),
      'fileName': 'pdfvikkewm123.txt',
      'id': 2207,
      'newFile': false
    };
    spyOn(service1, 'saveTextFile').and.returnValue(of(response))
    component.getdata();
    expect(service1.saveTextFile).toHaveBeenCalled();
  })

});
