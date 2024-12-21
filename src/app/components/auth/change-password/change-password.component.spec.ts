import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from '../../../unit-testing-module';
import { ChangePasswordComponent } from './change-password.component';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let service : CommonService;
  let captcha;
  UnitTestingModule.setUpTestBed(ChangePasswordComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('currentpassword', () => {
    let currentpassword = component.changepasswordForm.controls['currentpassword'];
    expect(currentpassword.valid).toBeFalsy();
    currentpassword.setValue('');
    expect(currentpassword.hasError('required')).toBeTruthy();
  })

  it('newpassword', () => {
    let errors = {};
    let newpassword = component.changepasswordForm.controls['newPassword'];
    expect(newpassword.valid).toBeFalsy();
    errors = newpassword.errors || {};
    expect(errors['required']).toBeTruthy();

    newpassword.setValue('root');
    errors = newpassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    newpassword.setValue("Root@123");
    errors = newpassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  })

  it('confirmpassword', () => {
    let confirmpassword = component.changepasswordForm.controls['confirmPassword'];
    expect(confirmpassword.valid).toBeFalsy();
    confirmpassword.setValue('');
    expect(confirmpassword.hasError('required')).toBeTruthy();
  })

  it('Form validation', () => {
    let newpassword;
    let confirmpassword;
    expect(component.changepasswordForm.valid).toBeFalsy();
    component.changepasswordForm.controls.currentpassword.setValue('Test@123');
    newpassword=component.changepasswordForm.controls.newPassword.setValue('Root@123');
    confirmpassword=component.changepasswordForm.controls.confirmPassword.setValue('Root@123');
    if(newpassword == confirmpassword){
      expect(component.changepasswordForm.valid).toBeTruthy();
    }
    else{
      expect(component.changepasswordForm.valid).toBeFalsy();
    }
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

  it('check change password response', (done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
    let data ={
      'currentPassword': service.encryptpassword('Root@123'),
      'newPassword': service.encryptpassword('Mouna@123')
    }
    service.changepassword(data).subscribe((resp: any) => {
      expect(resp.responseCode).toBe(200);
      done();
    })
  });

});
