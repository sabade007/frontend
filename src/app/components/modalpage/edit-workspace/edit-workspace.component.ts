import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

interface Permissions {
  value: string;
  viewValue: string;
}

interface Userpermission {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-edit-workspace',
  templateUrl: './edit-workspace.component.html',
  styleUrls: ['./edit-workspace.component.scss'],
})
export class EditWorkspaceComponent implements OnInit {

  groupForm: FormGroup;
  imgsrc = "WS";
  imageSrc: any = "";
  contactImgSrc: any;
  userInput: any = "";
  userDatas: any = [];
  groupDatas: any = [];
  usersNames: any = [];
  userId: any = [];
  selecteduser: any = [];
  productName = environment.productname;
  contactid : any;
  fileUpdate: any;
  groupId: any = [];
  userName: any = [];
  permissions: any = 'VIEWER';
  selectedOption = "Viewer";
  contactsList : any = [];
  workSpaceId: any;
  WorkSpaceName: any;
  gName: any;
  removebtn: boolean = true;
  userNames: any;
  workSpaceOwner: any;
  @ViewChild("username") username: ElementRef<HTMLInputElement>;
  permission: Permissions[] = [
    { value: "Viewer", viewValue: "Viewer" },
    // { value: "Editor", viewValue: "Editor" },
    { value: "Contributor", viewValue: "Contributor" }
  ];

  Userpermission: Userpermission[] = [
    { value: "VIEWER", viewValue: "Viewer" },
    // { value: "EDITOR", viewValue: "Editor" },
    { value: "CONTRIBUTOR", viewValue: "Contributor" },
  ];

  constructor(public _d: DomSanitizer,
              private navParams: NavParams,
              private fb: FormBuilder,
              private commonService: CommonService,
              private filesService: FilesService,
              private toastr: ToastrService,
              private localService: LocalService,
              private popoverController: PopoverController) { }

  ngOnInit() {
    this.getWorkSpaceinfo();
    this.userNames = this.localService.getJsonValue(localData.username)
    this.workSpaceId = this.navParams.data["workSpaceId"];
    this.groupForm = this.fb.group({
      gname: new FormControl('', [Validators.required]),
    });
    // if(this.workSpaceOwner == this.userNames){
    //   this.removebtn = false;
    // }
  }

  getWorkSpaceinfo(){
    this.commonService.getWorkSpaceinfo(this.workSpaceId).subscribe((data: any) => {
      this.WorkSpaceName = data.workSpaceName;
      this.gName = data.workSpaceName;
      this.workSpaceOwner = data.workSpaceOwner;
      this.contactsList = data.workSpaceContacts;
      for (let i = 0; i < this.contactsList.length; i++) {
        if (this.contactsList[i].permissions == "VIEWER") {
          this.contactsList[i].viewValue = "Viewer";
        } else if (this.contactsList[i].permissions == "CAN_EDIT") {
          this.contactsList[i].viewValue = "Editor";
        }
        else if (this.contactsList[i].permissions == "CONTRIBUTOR") {
          this.contactsList[i].viewValue = "Contributor";
        }
      }
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
    });
  }
  
  OnselectPermission(value, id) {
    var permission;
    if (value == "Editor") {
      permission = "CAN_EDIT";
    } 
    else if(value == "Viewer"){
      permission = "VIEWER";
    }
    else if(value == "Contributor"){
      permission = "CONTRIBUTOR"
    }
    var filteredObj = this.selecteduser.find(function(item, i){
      if(item.id === id){
        item.permission = permission;
        return i;
      }
    });
  }

  OnupdatePermissions(permission, userName){
    let data = {
      workSpaceId: this.workSpaceId,
      userName: userName,
      permissions: permission
    };
    this.commonService.changePermission(data).subscribe((data: any) => {
      this.getWorkSpaceinfo();
    });
  }
 
  selected(event: MatAutocompleteSelectedEvent): void {
    event.option.value.permission = "VIEWER";
    this.selecteduser.push(event.option.value);
    // this.userId.push(event.option.value.id);
    console.log("selected", this.selecteduser)
    // const myArrayFiltered = this.selecteduser.filter((el) => {
    //   return this.contactsList.some((f) => {
    //     if(f.id === el.id){
    //       this.remove(event.option.value);
    //       this.toastr.error(event.option.value.firstName + " " + "is already exist");
    //       return f.id === el.id;
    //     }
    //   });
    // });
    this.username.nativeElement.value = "";
    for (let i = 1; i < this.selecteduser.length; i++) {
      let j = i - 1;
      if (this.selecteduser[j].id == event.option.value.id) {
        console.log("selected user", event.option.value)
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

  removeContacts(id){
    let data = {
      workSpaceId: this.workSpaceId,
      workSpaceName: '',
      addContact: [],
      deleteContact: [id],
      addGroups : [],
    };
    this.commonService.updateWorkSpace(data).subscribe(
      (result: any) => {
        if(result.message == "Can not remove owner"){
          this.toastr.error(result.message)
        }
        this.getWorkSpaceinfo();
      }
    );
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  updateWorkSpace(){
    this.contactsList = [];
    if(this.groupForm.value.gname == ""){
      this.toastr.error("Please enter a workspace name");
    }
    else if (this.selecteduser.length <= 0) {
      this.toastr.error("One contacts should be select to create workspace");
    } 
    else if(this.userDatas.length == 0 && this.userInput.length > 0 && this.selecteduser.length > 0){
      this.toastr.error("You can add only contacts to create a workspace");
    }
    else{
      this.selecteduser.forEach(element => {
        this.contactsList.push({userId: element.id, permissions : element.permission})
      });
      console.log(this.contactsList);
      console.log(this.selecteduser)
      this.userId = this.selecteduser.map(a => a.id);
      let data = {
        workSpaceId: this.workSpaceId,
        workSpaceName: this.groupForm.value.gname,
        addContact: this.contactsList,
        deleteContact: [],
        addGroups : [],
      };
      this.commonService.updateWorkSpace(data).subscribe(
        (result: any) => {
          if(result["code"] == 200){
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
  }
}