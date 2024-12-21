import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import * as forge from "node-forge";
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';
const publickey = environment.LOGIN_PUB_KEY;

interface Options {
  value: string;
  viewValue: string;
}

interface Industry {
  value: string;
  viewValue: string;
}

interface Size {
  value: string;
  viewValue: string;
}

interface Country {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-setup-wizard',
  templateUrl: './setup-wizard.component.html',
  styleUrls: ['./setup-wizard.component.scss'],
})
export class SetupWizardComponent implements OnInit {

  options: Options[] = [
    { value: "Nonprofit", viewValue: "Nonprofit" },
    { value: "Enterprise", viewValue: "Enterprise" },
    { value: "Government", viewValue: "Government" },
    { value: "Community", viewValue: "Community" },
  ];
  industry: Industry[] = [
    { value: "IT/Software", viewValue: "IT/Software" },
    { value: "Consulting", viewValue: "Consulting" },
    { value: "Manufacturing", viewValue: "Manufacturing" },
    { value: "Insurance", viewValue: "Insurance" },
  ];
  size: Size[] = [
    { value: "1-10 People", viewValue: "1-10 People" },
    { value: "11-50 People", viewValue: "11-50 People" },
    { value: "51-100 People", viewValue: "51-100 People" },
    { value: "101-500 People", viewValue: "101-500 People" },
    { value: "501-1000 People", viewValue: "501-1000 People" },
    { value: "1001-10000 People", viewValue: "1001-1000 People" },
  ];
  countries: Country[] = [
    { value: "India", viewValue: "India" },
    { value: "Australia", viewValue: "Australia" },
    { value: "Algeria", viewValue: "Algeria" },
    { value: "France", viewValue: "France" },
  ];
  setupwizardForm: FormGroup;
  hide: boolean = true;
  firstForm: FormGroup;
  secondFormGroup: FormGroup;
  storageForm: FormGroup;
  datafolderinput: boolean = false;
  minioinput: boolean = false;
  productName = environment.productname;

  constructor(private fb: FormBuilder,
              private commonService: CommonService,
              private toastr: ToastrService,
              private router: Router,) { }

  ngOnInit() {
    this.setupwizardForm = this.fb.group({
      name: new FormControl("", [Validators.required]),
      username: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required, Validators.email]),
      phone: new FormControl("", [Validators.required,Validators.pattern("[0-9]+"),Validators.minLength(10),]),
      password: new FormControl("", [Validators.required,
        Validators.pattern("^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"),]),
    });
    this.firstForm = this.fb.group({
      option: ['', Validators.required],
      oname: ['', Validators.required],
      industrys: ['', Validators.required],
      sizes:['', Validators.required],
      country:['', Validators.required],
      website:['', Validators.required],
    });
    this.storageForm = this.fb.group({
      path: ['', Validators.required],
      minio: ['', Validators.required],
    });
  }

  get setupwizardFormControls() {
    return this.setupwizardForm.controls;
  }

  OnselectDatafolder(){
    this.datafolderinput = true;
    this.minioinput = false;
  }

  OnselectMinio(){
    this.minioinput = true;
    this.datafolderinput = false;
  }

  setupwizard(){
    var rsa = forge.pki.publicKeyFromPem(publickey);
      var encryptedpassword = window.btoa(
        rsa.encrypt(this.setupwizardForm.value.password)
      );
      this.setupwizardForm.value.password = encryptedpassword;
    let data = {
      "country": this.firstForm.value.country,
      "industry": this.firstForm.value.industrys,
      "organizationalName": this.firstForm.value.oname,
      "organizationalType": this.firstForm.value.option,
      "size": this.firstForm.value.sizes,
      "website": this.firstForm.value.website,
      "email": this.setupwizardForm.value.email,
      "fullName": this.setupwizardForm.value.name,
      "userName": this.setupwizardForm.value.username,
      "password": this.setupwizardForm.value.password,
      "phone": this.setupwizardForm.value.phone,
      "storageType": this.storageForm.value.path + "/",
      "storage": "local",
    }
    this.commonService.setupwizared(data).subscribe((data: any) => {
      if (data["responseCode"] == 200) {
        this.toastr.error(data["message"]);
        this.router.navigate(["login"]);
        this.setupwizardForm.reset();
        this.firstForm.reset();
        this.storageForm.reset();
      }
      else if (data["responseCode"] == 406) {
        this.toastr.error(data["message"]);
      }
    });
  }

}
