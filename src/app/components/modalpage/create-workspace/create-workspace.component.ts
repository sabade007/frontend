import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { DomSanitizer } from '@angular/platform-browser';
import { PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { environment } from 'src/environments/environment.prod';

interface Permissions {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss'],
})
export class CreateWorkspaceComponent implements OnInit {

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
  @ViewChild("username") username: ElementRef<HTMLInputElement>;
  permission: Permissions[] = [
    { value: "Viewer", viewValue: "Viewer" },
    // { value: "Editor", viewValue: "Editor" },
    { value: "Contributor", viewValue: "Contributor" }
  ];

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
    this.filesService.OnFindUsers(userData).subscribe((result: any) => {
      this.userDatas = result.contacts;
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
 
  selected(event: MatAutocompleteSelectedEvent): void {
    event.option.value.permission = "VIEWER";
    this.selecteduser.push(event.option.value);
    // this.userId.push(event.option.value.id);
    console.log("selected", this.selecteduser)
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

  //on select user
  // selected(event: MatAutocompleteSelectedEvent): void {
  //   console.log(event );
  //   this.selecteduser.push(event.option.value[0]);
    
  //   if(event.option.value[1] == 'user'){
  //     this.userName.push(event.option.value[0].userName);
  //     this.userName =  [...new Set(this.userName)];
  //   }
  //   else{
  //     this.groupId.push(event.option.value[0].groupId);
  //     this.groupId =  [...new Set(this.groupId)];
  //   }
  //   console.log(this.selecteduser)
  //   this.username.nativeElement.value = "";
   
  //   this.selecteduser =  this.selecteduser.filter((value, index, self) =>
  //     index === self.findIndex((t) => (
  //       t.userName === value.userName && t.groupId === value.groupId
  //     ))
  //   )
  // }

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

  createWorkSpace(){
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
        workSpaceName: this.groupForm.value.gname,
        contactsList: this.contactsList,
      };
      this.commonService.createWorkSpace(data).subscribe(
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
