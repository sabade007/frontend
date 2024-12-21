import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, PopoverController } from '@ionic/angular';
import { containsOrAfter } from '@taiga-ui/cdk';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.scss'],
})
export class ViewGroupComponent implements OnInit {

  groupId : any;
  contactsList : any = [];
  contactCount : any;
  groupName : any;
  editGroup : boolean = false;
  groupDetails : boolean = true;
  groupForm: FormGroup;
  fname: any;
  gName: any;
  addParticipants : boolean = false;
  userInput: any = "";
  userDatas: any = [];
  usersNames: any = [];
  selecteduser: any[] = [];
  userId: any = [];
  removeId: any = [];
  contactImgSrc: any;
  fileUpdate: any = null;
  productName = environment.productname;
  @ViewChild("username") username: ElementRef<HTMLInputElement>;
  @ViewChild('autoCompleteInput', { read: MatAutocompleteTrigger, static: false })
  autoComplete: MatAutocompleteTrigger;
  contactImg: any;
  deleteContacts: any = [];


  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private filesService: FilesService,
              private toastr: ToastrService,
              private popoverController: PopoverController,
              private commonService: CommonService,
              public _d: DomSanitizer) { }

  ngOnInit() {
    this.groupForm = this.fb.group({
      gname: new FormControl('', [Validators.required]),
    });
    this.getGroupInfo();
    this.groupId = this.navParams.data["groupId"];
    window.addEventListener('scroll', this.scrollEvent, true);
  }

  closepopup() {
    setTimeout(() => {
    this.popoverController.dismiss();
    }, 500);
  }

  scrollEvent = (event: any): void => {
    // if(this.autoComplete.panelOpen)
    //   this.autoComplete.closePanel(); //you can also close the panel 
  }

  fileChangeUpdate(e) {
    this.fileUpdate = e.srcElement.files[0];
    this.contactImg = window.URL.createObjectURL(this.fileUpdate);
  }

  getGroupInfo(){
    let data = {
      groupId : this.groupId
    }
    this.commonService.getGroupInfo(data).subscribe((data: any) => {
      this.gName = data.groupName;
      this.groupName = data.groupName;
      this.contactCount = data.contactCount;
      this.contactsList = data.contactsList;
      this.contactImg = data.icon;
    });
  }

  setInputField(data) {
    this.userInput = data;
    this.OnfindUsers();
  }

  OnfindUsers() {
    let userData = {
      groupId: this.groupId,
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
        this.toastr.error(event.option.value.firstName + " " + "is already exist");
      }
    }
  }

  remove(user: string): void {
    const index = this.selecteduser.indexOf(user);
    if (index >= 0) {
      this.selecteduser.splice(index, 1);
    }
  }

  onEditGroup(){
    this.editGroup = true;
    this.groupDetails = false;
  }

  cancleEdit(){
    this.editGroup = false;
    this.addParticipants = false;
    this.groupDetails = true;
    this.userId = [];
    this.selecteduser = [];
    this.contactImg = "";
  }

  AddParticipants(){
    this.addParticipants = true;
  }

  removeContacts(id){
    this.removeId.push(id);
    console.log("removeId", id);
    let payload = new FormData();
      var cantactArray = JSON.stringify(this.userId)
      var concatDelete = JSON.stringify(this.removeId)
      let payloadJson =  '{ "groupId" : "'+this.groupId+'","groupName" : "'+this.groupForm.value.gname+'","addContact":'+cantactArray+',"deleteContact":'+concatDelete+' }';
      payload.append("editgroupRequest", payloadJson);
      payload.append("file", this.fileUpdate);
    // let data = {
    //   "groupId": this.groupId,
    //   "groupName": this.groupForm.value.gname,
    //   "addContact": this.userId,
    //   "deleteContact": this.removeId
    // };
    this.commonService.editGroup(payload).subscribe((result: any) => {
     if(result["code"] == 200){
      this.getGroupInfo();
      this.removeId = [];
     }
     else if(result["responseCode"] == 205){
      this.toastr.warning(result.message);
      this.removeId = [];
     }
    });
  }

  onUpdateGroup(){
    console.log("file", this.fileUpdate)
    if(this.groupForm.value.gname == ""){
      this.toastr.error("Please enter the group name");
      return
    }
    else if (this.selecteduser.length <= 0 && this.userInput != "" && this.addParticipants == true) {
      this.toastr.error("You can add only contacts to create a group");
      return
    } 
    else if(this.userDatas.length == 0 && this.userInput.length > 0 && this.selecteduser.length > 0 && this.addParticipants == true){
      this.toastr.error("Search and add at least one of your contacts");
      return
    }
     
    else{
      this.userId = this.selecteduser.map(a => a.mailId);
      let payload = new FormData();
        var cantactArray = JSON.stringify(this.userId)
        var concatDelete = JSON.stringify(this.deleteContacts)
        let payloadJson =  '{ "groupId" : "'+this.groupId+'","groupName" : "'+this.groupForm.value.gname+'","addContact":'+cantactArray+',"deleteContact":'+concatDelete+' }';
        payload.append("editgroupRequest", payloadJson);
        payload.append("file", this.fileUpdate);
      // let data = {
      //   "groupId": this.groupId,
      //   "groupName": this.groupForm.value.gname,
      //   "addContact": this.userId,
      //   "deleteContact": []
      // };
      this.commonService.editGroup(payload).subscribe((result: any) => {
      if(result["code"] == 200){
        if(result.message == null){
          setTimeout(() => {
            this.popoverController.dismiss();
            }, 500);
        }
        else{
          this.toastr.success(result.message);
          setTimeout(() => {
            this.popoverController.dismiss();
            }, 500);
        }
      }
      });
    }
  }

}
