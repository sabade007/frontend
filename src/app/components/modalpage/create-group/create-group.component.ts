import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss'],
})
export class CreateGroupComponent implements OnInit {

  groupForm: FormGroup;
  imgsrc = "NG";
  imageSrc: any = "";
  contactImgSrc: any;
  userInput: any = "";
  userDatas: any = [];
  usersNames: any = [];
  userId: any = [];
  selecteduser: any = [];
  productName = environment.productname;
  contactid : any;
  fileUpdate: any = null;
  clicked = false;
  @ViewChild("username") username: ElementRef<HTMLInputElement>;

  constructor(public _d: DomSanitizer,
              private fb: FormBuilder,
              private commonService: CommonService,
              private filesService: FilesService,
              private toastr: ToastrService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.groupForm = this.fb.group({
      gname: new FormControl('', [Validators.required]),
    });
  }

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

  setInputField(data) {
    this.userInput = data;
    this.OnfindUsers();
  }

  OnfindUsers() {
    let userData = {
      groupId: "",
      userNames: this.userInput,
    };
    this.filesService.OnFindContacts(userData).subscribe((result: any) => {
      this.userDatas = result;
      // if(this.userDatas == ""){
      //   this.toastr.warning("You can add only " + this.productName + " users",'', { timeOut: 1000 });
      // }
      // else{
        // for (let i = 0; i < this.userDatas.length; i++) {
        //   this.usersNames.push(this.userDatas[i].mailId);
        //   console.log("selected user", this.usersNames)
        // }
      // }
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selecteduser.push(event.option.value);
    // this.userId.push(event.option.value.id);
    console.log("selected", event)
    this.username.nativeElement.value = "";
    for (let i = 1; i < this.selecteduser.length; i++) {
      let j = i - 1;
      if (this.selecteduser[j].id == event.option.value.id) {
        this.remove(event.option.value);
        this.toastr.error(event.option.value.firstName + " " + "is already selected");
      }
    }
  }

  remove(user: string): void {
    const index = this.selecteduser.indexOf(user);
    if (index >= 0) {
      this.selecteduser.splice(index, 1);
    }
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  createGroup(){
    console.log("file", this.fileUpdate)
    if(this.groupForm.value.gname == ""){
      this.toastr.error("Please enter a group name");
    }
    else if (this.selecteduser.length <= 0) {
      this.toastr.error("Search and add at least one of your contacts");
    } 
    else if(this.userDatas.length == 0 && this.userInput.length > 0 && this.selecteduser.length > 0){
      this.toastr.error("Select contacts to create a group");
    }
    // else if (this.selecteduser.length > 0) {
      //this.ngxService.start();
      // if (this.contactid.length > 0) {
      //   this.contactid = this.contactid;
      // } else {
      //   this.contactid = [this.contactid];
      // }
    else{
      this.clicked = true;
      this.userId = this.selecteduser.map(a => a.mailId);
      let payload = new FormData();
      var cantactArray = JSON.stringify(this.userId);
      let payloadJson =  '{ "groupName" : "'+this.groupForm.value.gname+'","contactsList":'+cantactArray+'}';
        payload.append("groupRequest", payloadJson);
        payload.append("file", this.fileUpdate);
      // let data = {
      //   groupName: this.groupForm.value.gname,
      //   // contactList: this.contactid
      //   contactsList: this.userId
      // };
      this.commonService.createGroup(payload).subscribe(
        (result: any) => {
          if(result["responseCode"] == 200){
            this.toastr.success(result.message);
            setTimeout(() => {
              this.popoverController.dismiss();
            }, 500);
          }
          if(result["responseCode"] == 204){
            this.toastr.warning(result.message);
          }
        }
      );
    }
    // }
  }

}
