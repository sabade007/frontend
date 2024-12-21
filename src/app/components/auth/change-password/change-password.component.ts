import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"; 
import { CommonService } from '../../../service/common.service';
import { ToastrService } from 'ngx-toastr';
import { PopoverController } from '@ionic/angular';
import { MustMatch } from 'src/app/validation/password-validator';
import { environment } from 'src/environments/environment.prod';
import * as forge from 'node-forge';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

function patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (!control.value) {
      return null;
    }
    const valid = regex.test(control.value);
    return valid ? null : error;
  };
}

function passwordMatchValidator(control: AbstractControl) {
  const password: string = control.get('password').value; 
  const confirmPassword: string = control.get('confirmPassword').value;
  if (password !== confirmPassword) {
    control.get('confirmPassword').setErrors({ NoPassswordMatch: true });
  }
}

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  changepasswordForm: FormGroup;
  passwordNotMatched:boolean=false ;
  hide = true;
  hide1 = true;
  hide2 = true;
  laterbtn: boolean = false;
  changePassword : any;

  constructor(private fb: FormBuilder,
    private toastr: ToastrService,
    private commonService:CommonService,
    private popoverController: PopoverController,
    private localService: LocalService ) { }

  ngOnInit() {
    this.changepasswordForm = this.fb.group({
      currentpassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]),
      ),
      confirmPassword:  new FormControl('', [Validators.required])
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
    this.changePassword = this.localService.getJsonValue(localData.changePassword);
    if(this.changePassword == true){
      this.laterbtn = true;
    }
  }

  get changepasswordFormControls(){
    return this.changepasswordForm.controls;
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  updatePassword(){
    if (this.changepasswordForm.invalid) {
      this.toastr.error("Please fill all required fields / Password is not matching");
    }else{
      if(this.changepasswordForm.value.newPassword === this.changepasswordForm.value.confirmPassword){
        var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
        var encryptedpassword = window.btoa(rsa.encrypt(this.changepasswordForm.value.confirmPassword))
        let confirmPassword = encryptedpassword;
        var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
        var encryptedpassword = window.btoa(rsa.encrypt(this.changepasswordForm.value.currentpassword))
        let currentpassword = encryptedpassword;
        let data ={
          'currentPassword': currentpassword,
          'newPassword': confirmPassword
        }
        this.commonService.changepassword(data).subscribe((data: any) => { 
         if(data['code']==200){
          this.toastr.success(data['message']);
          this.popoverController.dismiss();
         }else{
          this.toastr.error(data['message']);
         }
        });
      }else{
        this.passwordNotMatched =true;
      }  
    }
  }

  later(){
    setTimeout(() => {
      this.popoverController.dismiss(); 
    }, 500);
  }

}
