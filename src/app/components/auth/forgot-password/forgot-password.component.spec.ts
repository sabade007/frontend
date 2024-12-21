import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from '../../../unit-testing-module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { CommonService } from 'src/app/service/common.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let service : CommonService;
  UnitTestingModule.setUpTestBed(ForgotPasswordComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('email', () => {
    let errors = {};
    let email = component.forgotpasswordForm.controls['email'];
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
    expect(component.forgotpasswordForm.valid).toBeFalsy();
    component.forgotpasswordForm.controls.email.setValue('test@gmail.com');
    expect(component.forgotpasswordForm.valid).toBeTruthy();
  })

  it('check forgot response', (done) => {
    let data = {
      "mailid": 'mouna@gmail.com',
    }
    service.forgotpassword(data).subscribe( (resp: any) => {
     expect(resp.code).toBe(200);
     done();
    })
  });
});
