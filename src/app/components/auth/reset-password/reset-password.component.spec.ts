import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UnitTestingModule } from '../../../unit-testing-module';
import { CommonService } from 'src/app/service/common.service';

import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let service : CommonService;
  let activatedRoute : ActivatedRoute;
  UnitTestingModule.setUpTestBed(ResetPasswordComponent);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPasswordComponent ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: {get:(token:string)=>{token:'bTYCX3tbn0hK1de3jCc9V4cs0mZwZ5SAt4v3texiVxVAOeSmx2A'}}}} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(CommonService);
    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('newPassword', () => {
    let errors = {};
    let newPassword = component.changeForm.controls['newPassword'];
    expect(newPassword.valid).toBeFalsy();
    errors = newPassword.errors || {};
    expect(errors['required']).toBeTruthy();

    newPassword.setValue('root');
    errors = newPassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeTruthy();

    newPassword.setValue("Root@123");
    errors = newPassword.errors || {};
    expect(errors['required']).toBeFalsy();
    expect(errors['pattern']).toBeFalsy();
  })

  it('confirmpassword', () => {
    let confirmpassword = component.changeForm.controls['confirmPassword'];
    expect(confirmpassword.valid).toBeFalsy();
    confirmpassword.setValue('');
    expect(confirmpassword.hasError('required')).toBeTruthy();
  })

  it('Form validation', () => {
    let newpassword;
    let confirmpassword;
    expect(component.changeForm.valid).toBeFalsy();
    newpassword=component.changeForm.controls.newPassword.setValue('Root@123');
    confirmpassword=component.changeForm.controls.confirmPassword.setValue('Root@123');
    if(newpassword == confirmpassword){
      expect(component.changeForm.valid).toBeTruthy();
    }
    else{
      expect(component.changeForm.valid).toBeFalsy();
    }
  })

  it('check reset password response', (done) => {
    let data ={
      'newPassword': service.encryptpassword('Root@123'),
      'token': 'bTYCX3tbn0hK1de3jCc9V4cs0mZwZ5SAt4v3texiVxVAOeSmx2A'
    }
    service.resetpassword(data).subscribe((resp: any) => {
      expect(resp.code).toBe(200);
      done();
    })
  });

});
