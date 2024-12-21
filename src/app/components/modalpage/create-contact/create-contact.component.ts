import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss'],
})
export class CreateContactComponent implements OnInit {

  contactForm: FormGroup;
  imgsrc = "NC";
  imageSrc: string = "";
  contactImgSrc: any;
  maxDate = new Date();
  fileUpdate: any = null;
  clicked = false;
  productName = environment.productname;

  constructor(private fb: FormBuilder,
              public _d: DomSanitizer,
              private commonService: CommonService,
              private NgxService: NgxUiLoaderService,
              private popoverController: PopoverController,
              private toastr: ToastrService,) { }

  ngOnInit() {
    this.contactForm = this.fb.group({
      fname: new FormControl(""),
      lname: new FormControl(""),
      phone: new FormControl(""),
      email: new FormControl("", [Validators.email, 
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      address: new FormControl(""),
      postcode: new FormControl(""),
      city: new FormControl(""),
      state: new FormControl(""),
      country: new FormControl(""),
      dob: new FormControl(""),
    });
  }

  //Upload image
  fileChange(e) {
    // const file = e.srcElement.files[0];
    // this.imgsrc = window.URL.createObjectURL(file);
    // this.contactImgSrc = this.imgsrc;
    // var reader = new FileReader();
    // reader.onload = this._handleReaderLoaded.bind(this);
    // reader.readAsDataURL(file);
    this.fileUpdate = e.srcElement.files[0];
    this.imgsrc = window.URL.createObjectURL(this.fileUpdate);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.imageSrc = this.imageSrc.replace("data:image/png;base64,", "");
  }

    // Add Contact
  OnAddContact() {
    //this.ngxService.start();
    let emailValue = this.contactForm.value.email;
    let convertedValue = emailValue.toLowerCase();
    this.contactForm.value.dob = moment(this.contactForm.value.dob).format("DD/MM/YYYY");
    if (this.contactForm.invalid) {
      this.NgxService.stop();
      this.toastr.error("Please fill all required fields");
      return;
    }
    else{
      this.clicked = true;
      let payload = new FormData();
      payload.append("addedBy", "string");
      payload.append("address", this.contactForm.value.address);
      payload.append("dob", this.contactForm.value.dob);
      payload.append("firstName", this.contactForm.value.fname);
      payload.append("lastName", this.contactForm.value.lname);
      payload.append("mailId", convertedValue);
      payload.append("mobileNumber", this.contactForm.value.phone);
      payload.append("city", this.contactForm.value.city);
      payload.append("state", this.contactForm.value.state);
      payload.append("country", this.contactForm.value.country);
      payload.append("postalCode", this.contactForm.value.postcode);
      payload.append("file", this.fileUpdate);
    this.commonService.createContact(payload).subscribe((data: any) => {
      if (data["responseCode"] == 200) {
        this.NgxService.stop();
        this.contactForm.reset();
        this.imageSrc = "";
        Object.keys(this.contactForm.controls).forEach((key) => {
          this.contactForm.get(key).setErrors(null);
        });
        this.toastr.success(data.message);
        this.imgsrc = "NC";
        this.popoverController.dismiss();
      }
    },
    (error) => {
      this.NgxService.stop();
    });
    }
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
