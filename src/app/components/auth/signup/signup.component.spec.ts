import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UnitTestingModule } from '../../../unit-testing-module';
import { CommonService } from 'src/app/service/common.service';
import { SignupComponent } from './signup.component';
import { By } from '@angular/platform-browser';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let service : CommonService;
  UnitTestingModule.setUpTestBed(SignupComponent);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    fixture.detectChanges();
  });
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('fullName', () => {
    let errors = {};
    let fullName = component.signupForm.controls['fullName'];
    expect(fullName.valid).toBeFalsy();
    errors = fullName.errors || {};
    expect(errors['required']).toBeTruthy();

    fullName.setValue('12345');
    errors = fullName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    fullName.setValue("test");
    errors = fullName.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  })

  it('userName', () => {
    let userName = component.signupForm.controls['userName'];
    expect(userName.valid).toBeFalsy();
    userName.setValue('');
    expect(userName.hasError('required')).toBeTruthy();
  })

  it('email', () => {
    let errors = {};
    let email = component.signupForm.controls['email'];
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

  it('password', () => {
    let errors = {};
    let password = component.signupForm.controls['password'];
    expect(password.valid).toBeFalsy();
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    password.setValue('test');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    password.setValue("Test@123");
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  })

  it('phone', () => {
    let errors = {};
    let phone = component.signupForm.controls['phone'];
    expect(phone.valid).toBeFalsy();
    errors = phone.errors || {};
    expect(errors['required']).toBeTruthy();

    phone.setValue('test');
    errors = phone.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    phone.setValue("9876543210");
    errors = phone.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  })

  it('checkbox', () => {
    let checkbox = fixture.debugElement.query(By.css('#checkbox')).nativeElement;
    checkbox.click();
    expect(checkbox.checked).toEqual(true);
    component.privatUserCheckbox['checked'] = false;
    if (component.privatUserCheckbox['checked']) {
      component.signup();
      expect(component.submitted).toBeTruthy();
      expect(component.signupForm.valid).toBeTruthy();
    } else {
      expect(component.submitted).toBeFalsy();
      expect(component.signupForm.valid).toBeFalsy();
    }
  })

  it('Form validation', () => {
    expect(component.signupForm.valid).toBeFalsy();
    component.signupForm.controls.fullName.setValue('test')
    component.signupForm.controls.userName.setValue('test');
    component.signupForm.controls.email.setValue('test@gmail.com');
    component.signupForm.controls.password.setValue('Test@123');
    component.signupForm.controls.phone.setValue('9876543210');
    expect(component.signupForm.valid).toBeTruthy();
  })

  it('check signup response', (done) => {
    let data = {
      "fullName": 'mounamb',
      "userName": 'mounamb',
      "email": 'mounabm1@gmail.com',
      "password": service.encryptpassword('Root@123'),
      "phone": '9876543210'
    }
    service.signUp(data).subscribe((resp: any) => {
      expect(resp.responseCode).toBe(200);
      done();
    })
  });
});
