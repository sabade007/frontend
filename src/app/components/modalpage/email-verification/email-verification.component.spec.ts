import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CommonService } from 'src/app/service/common.service';
import { UnitTestingModule } from '../../../unit-testing-module';
import { EmailVerificationComponent } from './email-verification.component';
import { environment } from 'src/environments/environment.prod';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let service : CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(EmailVerificationComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailVerificationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('email', () => {
    let errors = {};
    let email = component.emailUpdateForm.controls['newEmail'];
    expect(email.valid).toBeFalsy();
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();

    email.setValue('test');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['email']).toBeTruthy();

    email.setValue("test@gmail.com");
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['email']).toBeFalsy();
  })

  it('Form validation', () => {
    expect(component.emailUpdateForm.valid).toBeFalsy();
    component.emailUpdateForm.controls.newEmail.setValue('test@gmail.com');
    expect(component.emailUpdateForm.valid).toBeTruthy();
  })

  it('check captcha response', (done) => {
    service.captcha().subscribe((resp: any) => {
    expect(resp.captchaId).not.toBe(null);
        captcha = resp['captchaId'];
        done();
    });
  });

  it('check login response', (done) => {
    let data = {
      "captchaId": captcha ,
      "captchaValue": '12345',
      "password": service.encryptpassword('Root@123'),
      "username": 'mouna'
    }
    service.userSignIn(data).subscribe( (resp: any) => {
      environment.isLoggedIn= true
      sessionStorage.setItem('token', resp.token);
     expect(resp.responseCode).toBe(200);
      done();
    })
  });

  it('check emailVerification response', (done) => {
    service.emailVerification().subscribe( (resp: any) => {
     expect(resp.responseCode).toBe(200);
     done();
    })
  });

  it('check emailUpdate response', (done) => {
    let result = {
      "mailid": 'admin@indryve.com',
    }
    service.emailUpdate('admin@indryve.com').subscribe( (resp: any) => {
     expect(resp.responseCode).toBe(200);
     done();
    })
  });

});
