import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, PopoverController } from '@ionic/angular';
import * as moment from "moment";
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {

  contactForm: FormGroup;
  imgsrcUpload: any;
  editContactList: any;
  firstName: any;
  lname: any;
  phone: any;
  email: any;
  address: any;
  city: any;
  state: any;
  country: any;
  postcode: any;
  dob: any;
  etherosUser: any;
  id: any;
  contactImgSrc: any;
  imageSrcUpdate: any;
  maxDate = new Date();
  fileUpdate: any = null;
  productName = environment.productname;
  
  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              public _d: DomSanitizer,
              private toastr: ToastrService,
              private popoverController: PopoverController,
              private commonService: CommonService,
              ) { }

  ngOnInit() {
    var dobdate:any = new Date(this.navParams.data["dob"]);
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
    this.contactForm.patchValue({
      imgsrcUpload : this.navParams.data["imgsrcUpload"],
      editContactList : this.navParams.data["editContactList"],
      fname : this.navParams.data["firstName"],
      lname : this.navParams.data["lname"],
      phone : this.navParams.data["phone"],
      email : this.navParams.data["email"],
      address : this.navParams.data["address"],
      city : this.navParams.data["city"],
      state : this.navParams.data["state"],
      country : this.navParams.data["country"],
      postcode : this.navParams.data["postcode"],
      // dob : this.navParams.data["dob"],
      etherosUser : this.navParams.data["etherosUser"],
      id : this.navParams.data["id"],
      contactImgSrc : this.navParams.data["contactImgSrc"],
      imageSrcUpdate : this.navParams.data["imageSrcUpdate"],
    });
    if(!isNaN(dobdate)){
      this.contactForm.patchValue({
        dob : this.navParams.data["dob"],
      });
    }
    console.log(dobdate);
  }

  //Update image
  fileChangeUpdate(e) {
    // const fileUpdate = e.srcElement.files[0];
    // this.contactImgSrc = window.URL.createObjectURL(fileUpdate);
    // var readerUpdate = new FileReader();
    // readerUpdate.onload = this._handleReaderLoadedUpdate.bind(this);
    // readerUpdate.readAsDataURL(fileUpdate);
    this.fileUpdate = e.srcElement.files[0];
    this.contactImgSrc = window.URL.createObjectURL(this.fileUpdate);
  }

  _handleReaderLoadedUpdate(e) {
    let readerUpdate = e.target;
    this.imageSrcUpdate = readerUpdate.result;
    this.imageSrcUpdate = this.imageSrcUpdate.replace(
      "data:image/png;base64,",
      ""
    );
  }

  // Update Contact
  OnUpdateContact() {
    // let btn = (document.getElementById("updatebtn") as HTMLTextAreaElement).disabled;
    if (this.contactForm.value.fname == "") {
      this.toastr.error("Please enter the first name");
      return;
    } 
    // else if(btn == true){
    //   this.toastr.error("Please enter a valid email");
    // }
    else{
      let emailValue = this.contactForm.value.email;
      let convertedValue = emailValue.toLowerCase();
      // this.imageSrcUpdate = this.imageSrcUpdate.replace("data:image/png;base64,",'')
      this.contactForm.value.dob = moment(this.contactForm.value.dob).format("DD/MM/YYYY");
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
        payload.append("id", this.id);
        payload.append("postalCode", this.contactForm.value.postcode);
        payload.append("file", this.fileUpdate);
      // let data = {
      //   addedBy: "string",
      //   address: this.contactForm.value.address,
      //   contactImgSrc: this.imageSrcUpdate,
      //   dob:  this.contactForm.value.dob,
      //   firstName: this.contactForm.value.fname,
      //   lastName: this.contactForm.value.lname,
      //   mailId: convertedValue,
      //   mobileNumber: this.contactForm.value.phone,
      //   etherosUser: this.etherosUser,
      //   id: this.id,
      //   city: this.contactForm.value.city,
      //   state: this.contactForm.value.state,
      //   country:  this.contactForm.value.country,
      //   postalCode: this.contactForm.value.postcode
      // };
      this.commonService.updateContact(payload).subscribe(
        (data: any) => {
          if (data["responseCode"] == 200) {
            this.toastr.success(data.message);
            this.popoverController.dismiss();
          }
        });
    }
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

}
