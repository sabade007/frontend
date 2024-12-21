import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"; 
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from '../../../service/common.service';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from 'src/app/validation/password-validator';
import { environment } from 'src/environments/environment.prod';
import * as forge from 'node-forge';

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
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnInit {
  productName = environment.productname;
  changeForm : FormGroup;
  token:string;
  passwordNotMatched:boolean=false ;
  hide = true;
  hide1 = true;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private toastr: ToastrService,
    private commonService:CommonService) { }

  ngOnInit() {

    this.token = this.route.snapshot.paramMap.get("token")
    this.changeForm = this.fb.group({
      newPassword: new FormControl('',Validators.compose([
        Validators.required,
        Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")]),
      ),
      confirmPassword: new FormControl('', [Validators.required])
    }, {
      validator :MustMatch('newPassword', 'confirmPassword')
    });
  }
  get changeFormControls() { return this.changeForm.controls; }

  submit(){
   if (this.changeForm.invalid) {
    this.toastr.error("Please fill all required fields");
    }
    else{
      let  newpassword = this.changeForm.value.newPassword;
      let  confirmpassword =this.changeForm.value.confirmPassword;
      if(newpassword === confirmpassword){
        var rsa = forge.pki.publicKeyFromPem(environment.LOGIN_PUB_KEY);
        var encryptedpassword = window.btoa(rsa.encrypt(confirmpassword))
        confirmpassword = encryptedpassword;
        let data ={
          'newPassword': confirmpassword,
          'token': this.token
        }
        this.commonService.resetpassword(data).subscribe((data: any) => { 
        if(data['code']==200){
          this.toastr.success(data['message']);
          this.router.navigate(['/login'])
        }
        else{
        this.toastr.error(data['message']);
        }
        });
      }
      else{
      this.passwordNotMatched =true;
      }  
    }
  }
}

