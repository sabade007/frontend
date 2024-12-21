import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { DomSanitizer } from "@angular/platform-browser";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { PopoverController } from "@ionic/angular";
import { CreateGroupComponent } from "../modalpage/create-group/create-group.component";
import { CreateContactComponent } from "../modalpage/create-contact/create-contact.component";
import { EditContactComponent } from "../modalpage/edit-contact/edit-contact.component";
import { ViewContactComponent } from "../modalpage/view-contact/view-contact.component";
import { ViewGroupComponent } from "../modalpage/view-group/view-group.component";
import { DeleteGroupComponent } from "../modalpage/delete-group/delete-group.component";
import { IonInfiniteScroll } from '@ionic/angular';
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { environment } from "src/environments/environment.prod";
@Component({
  selector: "app-contacts",
  templateUrl: "./contacts.component.html",
  styleUrls: ["./contacts.component.scss"],
})
export class ContactsComponent implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  contactForm: FormGroup;
  addContact: boolean = false;
  listContact: boolean = true;
  listGroups: boolean = false;
  maxDate = new Date();
  contactList: any = [];
  editContactList: any = [];
  editContact: boolean = false;
  firstName: any;
  lname: any;
  dob: any;
  phone: any;
  email: any;
  address: any;
  etherosUser: boolean;
  id: any;
  popover: any;
  viewDetails: boolean = false;
  contactDetails: any;
  Contactcompany: any;
  imgsrc = "NC";
  imageSrc: string = "";
  imgsrcUpload: any;
  imageSrcUpload: string = "";
  fileListView: boolean = true;
  fileGridView: boolean = false;
  searchValue: any;
  pageSize: number = 20;
  page: number = 1;
  pageSize1: number = 20;
  page1: number = 1;
  contactImgSrc: any;
  imageSrcUpdate: string = "";
  pageEvent: PageEvent;
  base64Content: any;
  contactListLength: any;
  GroupListLength: any;
  GroupList : any = [];
  subscription: Subscription;
  city: any;
  state: any;
  country: any;
  postcode: any;
  groupName: any;
  groupId: any;
  groupValue = "null";
  userStore : any;
  showInvite : boolean = false;
  lastPageEvent: boolean = false;
  contactsLength: any;
  groupLength: any;
  isLoadingContacts:boolean = true;
  showIcon:boolean = false;
  page2:number = 1;
  pageSize2:number = 20;
  productName = environment.productname;
  private validateEmail(mailId) {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mailId).toLowerCase());
  }


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService,
    private NgxService: NgxUiLoaderService,
    private popoverController: PopoverController,
    private toastr: ToastrService,
    private localService : LocalService,
    public _d: DomSanitizer
  ) {
    route.params.subscribe((val) => {
      this.commonService.storeHeader("Contacts");
      this.showContactList(this.page,this.pageSize);
    });
    this.subscription = this.commonService.getClick().subscribe((message) => {
      if (message == "click") {
        this.viewDetails = false;
      }
    });
  }

  ngOnInit() {
    this.userStore = this.localService.getJsonValue(localData.userStore)
    if(this.userStore == "LDAP_USER"){
      this.showInvite = false;
    }else{
      this.showInvite = true;
    }
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

  get contactFormControls() {
    return this.contactForm.controls;
  }

  fileListViewShow() {
    this.isLoadingContacts = true;
    if(this.listContact == true){
    this.page = 1;
    this.contactList = [];
    this.showIcon = false;
    this.showContactList(this.page,this.pageSize);
    }else{
      this.page2 = 1;
      this.GroupList = [];
      this.showIcon = false;
      this.ShowGroupList(this.page2,this.pageSize2);
    }
    this.fileListView = true;
    this.fileGridView = false;
  }

  fileGridViewShow() {
    this.isLoadingContacts = true;
    if(this.listContact == true){
      this.page = 1;
      this.contactList = [];
      this.showIcon = false;
      this.showContactList(this.page,this.pageSize);
      }else{
        this.page2 = 1;
        this.GroupList = [];
        this.showIcon = false;
        this.ShowGroupList(this.page2,this.pageSize2);
      }
    this.fileGridView = true;
    this.fileListView = false;
  }

  async OnCreateContact() {
    // this.addContact = true;
    // this.listContact = false;
    // this.editContact = false;
    // this.viewDetails = false;
    this.popover = await this.popoverController.create({
      component: CreateContactComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.page = 1;
      this.contactList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.showContactList(this.page,this.pageSize);
      // this.page = 1;
    });
  }

  closepopup() {
    this.addContact = false;
    this.listContact = true;
    this.editContact = false;
    this.viewDetails = false;
  }

  // Add Contact
  OnAddContact() {
    //this.ngxService.start();
    if (this.contactForm.invalid) {
      this.NgxService.stop();
      this.toastr.error("Please fill all required fields");
      return;
    }
    this.contactForm.value.dob = moment(this.contactForm.value.dob).format(
      "DD/MM/YYYY"
    );
    let data = {
      addedBy: "string",
      address: this.contactForm.value.address,
      contactImgSrc: this.imageSrc,
      dob: this.contactForm.value.dob,
      firstName: this.contactForm.value.fname,
      id: 0,
      imagePath: "string",
      lastName: this.contactForm.value.lname,
      mailId: this.contactForm.value.email,
      mobileNumber: this.contactForm.value.phone,
      city: this.contactForm.value.city,
      state: this.contactForm.value.state,
      country: this.contactForm.value.country,
      postcode: this.contactForm.value.postcode
    };
    this.commonService.createContact(data).subscribe(
      (data: any) => {
        if (data["responseCode"] == 200) {
          this.NgxService.stop();
          this.contactForm.reset();
          this.imageSrc = "";
          Object.keys(this.contactForm.controls).forEach((key) => {
            this.contactForm.get(key).setErrors(null);
          });
          this.toastr.success(data.message);
          this.addContact = false;
          this.listContact = true;
          this.page = 1;
          this.contactList = [];
          this.showContactList(this.page,this.pageSize);
          this.imgsrc = "NC";
        }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  getPevpage() {
    this.page = 1;
    this.showContactList(this.page,this.pageSize);
  }

  //Show Contact list
  showContactList(page,pageSize) {
    this.searchValue = "";
    //this.ngxService.start();
    this.commonService.showContactList(page, pageSize).subscribe(
      (data: any) => {
        if(this.page == 1)
        this.contactList = []
        this.contactList = this.contactList.concat(data.content);
        // this.contactList = data.content;
        this.contactListLength = data.totalElements;
        this.contactsLength = this.contactList.length;
        // this.NgxService.stop();
        this.isLoadingContacts = false;
        this.showIcon = true;
        if (this.contactsLength == 0 && this.lastPageEvent == true) {
          console.log("contactListLength", this.contactListLength)
          this.getPevpage();
        }
        this.contactList.forEach(file =>  {
          if (
            this.commonService.base64regex.test(file.contactImgSrc) ==
            true && file.contactImgSrc != null && file.contactImgSrc != undefined
          ) {
            this.base64Content = file.contactImgSrc;
            // base64 encoded data doesn't contain commas
            let base64ContentArray = file.contactImgSrc.split(",");
            console.log("base64img", base64ContentArray)
            if (base64ContentArray[0] == "data:image/jpeg;base64") {
              file.contactImgSrc =
              file.contactImgSrc;
            } else if (base64ContentArray[0] != "data:image/jpeg;base64") {
              file.contactImgSrc =
                "data:image/png;base64," + file.contactImgSrc;
            }
          } else {
            this.contactImgSrc = file.contactImgSrc;
          }
          file.validEmail = this.validateEmail(
            file.mailId
          );
        });
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  loadData(event){
    console.log("exzaexza") 
    if(this.contactListLength > 20){
      console.log("contactsLength",this.contactListLength)
      setTimeout(() => { 
      console.log("Done ",event);
      console.log("123")
      this.page = this.page + 1;
      event.target.complete();
      this.showContactList(this.page,this.pageSize);
      console.log("this.page "+this.page);
      console.log("this.filesCount "+this.contactListLength);
      console.log("this.pageSize "+this.pageSize);
      console.log("this.mod "+ Math.ceil(this.contactListLength / this.pageSize));
      if(this.page === Math.ceil(this.contactListLength / this.pageSize)){
        event.target.disabled = true;
      }
    },1000);
    }
    else{
      console.log("OOPO",this.contactListLength)
      event.target.disabled = true;
    
    }
}

  
toggleInfiniteScroll() {
  if(this.infiniteScroll.disabled != true){
    this.page = 1;
  const content = document.querySelector('ion-content');
    setTimeout(() => {
    content.scrollToTop(0);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
}
    console.log("hello")
    this.page = 1;
    const content = document.querySelector('ion-content');
    setTimeout(() => {
      content.scrollToTop(0);
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
}

  
toggleInfiniteScroll1() {
  if(this.infiniteScroll.disabled != true){
    this.page2 = 1;
  const content = document.querySelector('ion-content');
    setTimeout(() => {
    content.scrollToTop(0);
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
}
// else if(this.infiniteScroll.disabled == true){
    console.log("hello")
    this.page2 = 1;
    const content = document.querySelector('ion-content');
    setTimeout(() => {
      content.scrollToTop(0);
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  });
  // }
}

   //Show Group list
  ShowGroupList(page2,pageSize2){
    this.searchValue = "";
    this.commonService.showGroupList(page2, pageSize2).subscribe(
      (data: any) => {
        if(this.page2 == 1)
          this.GroupList = [];
        // this.GroupList = data.groupList;
        this.GroupList = this.GroupList.concat(data.groupList);
        console.log("groupname", this.GroupList.groupName)
        this.GroupListLength = data.count;
        this.isLoadingContacts = false;
        this.showIcon = true;
        this.NgxService.stop();
        this.groupLength = this.GroupList.length;
        if (this.groupLength == 0 && this.lastPageEvent == true) {
          this.getPevpage1();
        }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  loadData1(event1){
    console.log("exzaexza") 
    if(this.GroupListLength > 20){
      console.log("contactsLength",this.GroupListLength)
      setTimeout(() => { 
      console.log("Done ",event1);
      console.log("123")
      this.page2 = this.page2 + 1;
      event1.target.complete();
      this.ShowGroupList(this.page2, this.pageSize2);
      console.log("this.page "+this.page2);
      console.log("this.filesCount "+this.GroupListLength);
      console.log("this.pageSize "+this.pageSize2);
      console.log("this.mod "+ Math.ceil(this.GroupListLength / this.pageSize2));
      if(this.page2 === Math.ceil(this.GroupListLength / this.pageSize2)){
        event1.target.disabled = true;
      }
    },1000);
    }
    else{
      console.log("OOPO",this.GroupListLength)
      event1.target.disabled = true;
    
    }
}
  getPevpage1() {
    this.page2 = 1;
    this.ShowGroupList(this.page2, this.pageSize2);
  }

  onPageChange(event: PageEvent) {
    this.lastPageEvent = true;
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.showContactList(this.page,this.pageSize);
  }

  onPageChange1(event: PageEvent) {
    this.lastPageEvent = true;
    this.page2 = event.pageIndex + 1;
    this.pageSize2 = event.pageSize;
    this.ShowGroupList(this.page2, this.pageSize2);
  }

  //Invite User
  OnInvite(id) {
    this.commonService.inviteUser(id).subscribe(
      (data: any) => {
        if (data["code"] == 200) {
          this.toastr.success(data.message);
          this.contactList = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.showContactList(this.page,this.pageSize);
        }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  //Delete Contact
  OnDelete(id) {
    this.commonService.deleteContact(id).subscribe(
      (data: any) => {
        if (data["code"] == 200) {
          this.toastr.success(data.message);
          this.contactList = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.showContactList(this.page,this.pageSize);
        }
        else  if(data["code"] == 204){
          this.toastr.warning(data.message);
          this.contactList = [];
          this.showIcon = false;
          this.toggleInfiniteScroll();
          this.showContactList(this.page,this.pageSize);
        }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  async OnEditContact(list) {
    // this.viewDetails = false;
    // this.editContact = true;
    // this.addContact = false;
    // this.listContact = false;
    this.imgsrcUpload = list.firstName;
    this.editContactList = list;
    this.firstName = list.firstName;
    this.lname = list.lastName;
    this.phone = list.mobileNumber;
    this.email = list.mailId;
    this.address = list.address;
    this.city = list.city;
    this.state = list.state;
    this.country = list.country;
    this.postcode = list.postalCode;
    if(list.dob!=null){
      var darr = list.dob.split("/");
    var dobj = new Date(
      parseInt(darr[2]),
      parseInt(darr[1]) - 1,
      parseInt(darr[0])
    );
    }
    this.dob = dobj;
    this.etherosUser = list.etherosUser;
    this.id = list.id;
    if (list.dob !== null) {
      var darr = list.dob.split("/");
      var dobj = new Date(
        parseInt(darr[2]),
        parseInt(darr[1]) - 1,
        parseInt(darr[0])
      );
    }
    // this.dob = "";
    this.etherosUser = list.etherosUser;
    this.contactImgSrc = list.contactImgSrc;
    this.imageSrcUpdate = list.contactImgSrc;
    // this.imageSrcUpdate = this.imageSrcUpdate.replace(
    //   "data:image/png;base64,",
    //   "data:image/jpeg;base64,"
    // );
    this.popover = await this.popoverController.create({
      componentProps: {
        imgsrcUpload : this.firstName,
        editContactList : list,
        firstName : this.firstName,        
        lname :  this.lname,
        phone : this.phone,
        email : this.email,
        address : this.address,
        city : this.city,
        state : this.state,
        country : this.country,
        postcode : this.postcode,
        dob : this.dob,
        etherosUser : this.etherosUser,
        id : this.id,
        contactImgSrc : this.contactImgSrc,
        imageSrcUpdate : this.contactImgSrc,
      },
      component: EditContactComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.contactList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.showContactList(this.page,this.pageSize);
      this.page = 1;
    });
  }

  // Update Contact
  OnUpdateContact() {
    let btn = (document.getElementById("updatebtn") as HTMLTextAreaElement).disabled;
    //this.ngxService.start();
    if (this.firstName == "") {
      this.toastr.error("Please fill all required fields");
      return;
    }
    else if(btn == true){
      this.toastr.error("Please enter a valid email");
    }
    // else if (this.lname == "") {
    //   this.LerrorField = "Last Name is Required!";
    //   this.NgxService.stop();
    //   return;
    // } else if (this.phone == "") {
    //   this.PerrorField = "Phone number is Required";
    //   this.NgxService.stop();
    //   return;
    // } else if (this.email == "") {
    //   this.EerrorField = "Email is Required";
    //   this.NgxService.stop();
    //   return;
    // }
    else{
      var dob = moment(this.dob).format("DD/MM/YYYY");
      let data = {
        addedBy: "string",
        address: this.address,
        contactImgSrc: this.imageSrcUpdate,
        dob: dob,
        firstName: this.firstName,
        lastName: this.lname,
        mailId: this.email,
        mobileNumber: this.phone,
        etherosUser: this.etherosUser,
        id: this.id,
        city: this.city,
        state: this.state,
        country: this.country,
        postcode: this.postcode
      };
      console.log(this.id + " updated id");this.commonService.updateContact(data).subscribe(
        (data: any) => {
          if (data["responseCode"] == 200) {
            this.NgxService.stop();
            this.toastr.success(data.message);
            this.addContact = false;
            this.editContact = false;
            this.listContact = true;
            // this.FerrorField = "";
            // this.LerrorField = "";
            // this.PerrorField = "";
            // this.EerrorField = "";
            this.page = 1;
            this.showContactList(this.page,this.pageSize);
          }
        },
        (error) => {
          this.NgxService.stop();
        }
      );
    }
  }

  // onFocusInFirstname() {
  //   this.FerrorField = '';
  // }

  // onFocusInLastname() {
  //   this.LerrorField = "";
  // }

  // onFocusInPhone() {
  //   this.PerrorField = "";
  // }

  // onFocusInEmail() {
  //   this.EerrorField = "";
  // }

  async OnViewContact(details) {
    this.contactDetails = details;
    // this.viewDetails = true;
    this.popover = await this.popoverController.create({
      componentProps: {
        contactDetails: details
      },
      component: ViewContactComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.contactList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll();
      this.showContactList(this.page,this.pageSize);
      this.page = 1;
    });
  }

  //Upload image
  fileChange(e) {
    const file = e.srcElement.files[0];
    this.imgsrc = window.URL.createObjectURL(file);
    this.contactImgSrc = this.imgsrc;
    var reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    this.imageSrc = this.imageSrc.replace("data:image/png;base64,", "");
  }

  //Update image
  fileChangeUpdate(e) {
    const fileUpdate = e.srcElement.files[0];
    this.contactImgSrc = window.URL.createObjectURL(fileUpdate);
    var readerUpdate = new FileReader();
    readerUpdate.onload = this._handleReaderLoadedUpdate.bind(this);
    readerUpdate.readAsDataURL(fileUpdate);
  }

  _handleReaderLoadedUpdate(e) {
    let readerUpdate = e.target;
    this.imageSrcUpdate = readerUpdate.result;
    this.imageSrcUpdate = this.imageSrcUpdate.replace(
      "data:image/png;base64,",
      ""
    );
  }

  OnSearchValue(value) {
    this.commonService.searchContact(value, this.page, this.pageSize).subscribe(
      (data: any) => {
        this.contactList = data.content;
        for (let i = 0; i < this.contactList.length; i++) {
          if (
            this.commonService.base64regex.test(
              this.contactList[i].contactImgSrc
            ) == true
          ) {
            this.base64Content = this.contactList[i].contactImgSrc;
            // base64 encoded data doesn't contain commas
            let base64ContentArray = this.base64Content.split(",");
            if (base64ContentArray[0] == "data:image/jpeg;base64") {
              this.contactList[i].contactImgSrc =
                this.contactList[i].contactImgSrc;
            } else if (base64ContentArray[0] != "data:image/jpeg;base64") {
              this.contactList[i].contactImgSrc =
                "data:image/png;base64," + this.contactList[i].contactImgSrc;
            }
          }
        }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  OnSearchGroup(value){
    this.commonService.searchGroupList(this.page2, this.pageSize2, value).subscribe(
      (data: any) => {
        this.GroupList = data.groupList;
        console.log("groupname", this.GroupList.groupName)
        this.GroupListLength = data.count;
        this.NgxService.stop();
        // for (let i = 0; i < this.contactList.length; i++) {
        //   this.base64Content = this.contactList[i].contactImgSrc;
        //   // base64 encoded data doesn't contain commas
        //   let base64ContentArray = this.base64Content.split(",");
        //   console.log("base64img", base64ContentArray)
        //   if (base64ContentArray[0] == "data:image/jpeg;base64") {
        //     this.contactList[i].contactImgSrc =
        //       this.contactList[i].contactImgSrc;
        //   } else if (base64ContentArray[0] != "data:image/jpeg;base64") {
        //     this.contactList[i].contactImgSrc =
        //       "data:image/png;base64," + this.contactList[i].contactImgSrc;
        //   }
        //   this.contactList[i].validEmail = this.validateEmail(
        //     this.contactList[i].mailId
        //   );
        // }
      },
      (error) => {
        this.NgxService.stop();
      }
    );
  }

  OncancelSearch() {
    this.showContactList(this.page,this.pageSize);
  }

  OncancelSearch1() {
    this.ShowGroupList(this.page2, this.pageSize2);
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
  }

  OnShowContact(){
    this.isLoadingContacts = true;
    this.listContact = true;
    this.listGroups = false;
    this.page = 1;
    this.contactList = [];
    this.showIcon = false;
    this.showContactList(this.page,this.pageSize);
    this.searchValue = "";
  }

  OnShowGroups(){
    this.isLoadingContacts = true;
    this.listContact = false;
    this.listGroups = true;
    this.page2 = 1;
    this.GroupList = [];
    this.showIcon = false;
    this.ShowGroupList(this.page2, this.pageSize2);
    this.searchValue = "";
  }

  async OnCreateGroups(){
    this.popover = await this.popoverController.create({
      component: CreateGroupComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    console.log("Groups")
    return this.popover.onDidDismiss().then((data) => {
      this.page2 = 1;
      this.GroupList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll1();
      this.ShowGroupList(this.page2, this.pageSize2);
    });
  }

  // async OnEditGroup(groupId){
  //   this.popover = await this.popoverController.create({
  //     componentProps: {
  //       groupId: groupId
  //     },
  //     component: EditGroupComponent,
  //     cssClass: "modal-fullscreen",
  //     backdropDismiss: false,
  //   });
  //   await this.popover.present();
  //   return this.popover.onDidDismiss().then((data) => {
  //     this.ShowGroupList();
  //   });
  // }

  async OnViewGroup(groupId){
    this.popover = await this.popoverController.create({
      componentProps: {
        groupId: groupId
      },
      component: ViewGroupComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.page2 = 1;
      this.GroupList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll1();
      this.ShowGroupList(this.page2, this.pageSize2);
    });
  }

  async OnDeleteGroup(groupId){
    console.log("groupId: " + groupId);
    this.popover = await this.popoverController.create({
      componentProps: {
        groupId: groupId
      },
      component: DeleteGroupComponent,
      cssClass: "modal-fullscreen",
      backdropDismiss: false,
    });
    await this.popover.present();
    return this.popover.onDidDismiss().then((data) => {
      this.page2 = 1;
      this.GroupList = [];
      this.showIcon = false;
      this.toggleInfiniteScroll1();
      this.ShowGroupList(this.page2, this.pageSize2);
    });
  }

}
