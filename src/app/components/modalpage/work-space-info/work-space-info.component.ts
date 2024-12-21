import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';
import { FilesService } from 'src/app/service/files.service';
import { LocalService } from 'src/environments/local.service';
import { localData } from 'src/environments/mimetypes';

interface Userpermission {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-work-space-info',
  templateUrl: './work-space-info.component.html',
  styleUrls: ['./work-space-info.component.scss'],
})
export class WorkSpaceInfoComponent implements OnInit {

  workSpaceId: any;
  WorkSpaceName: any;
  contactCount: any;
  contactsList: any = [];
  workSpaceOwner : any;
  userName : any;
  editPermission: boolean = false;

  Userpermission: Userpermission[] = [
    { value: "VIEWER", viewValue: "Viewer" },
    // { value: "CAN_EDIT", viewValue: "Editor" },
    { value: "CONTRIBUTOR", viewValue: "Contributor" },
  ];

  constructor(private navParams: NavParams,
              private fb: FormBuilder,
              private filesService: FilesService,
              private toastr: ToastrService,
              private popoverController: PopoverController,
              private commonService: CommonService,
              private localService: LocalService,
              public _d: DomSanitizer) { }


  ngOnInit() {
    this.getWorkSpaceinfo();
    this.workSpaceId = this.navParams.data["workSpaceId"];
    this.userName = this.localService.getJsonValue(localData.username)
  }

  closepopup() {
    setTimeout(() => {
    this.popoverController.dismiss();
    }, 500);
  }

  getWorkSpaceinfo(){
    this.commonService.getWorkSpaceinfo(this.workSpaceId).subscribe((data: any) => {
      this.WorkSpaceName = data.workSpaceName;
      this.contactCount = data.contactCount;
      this.contactsList = data.workSpaceContacts;
      this.workSpaceOwner = data.workSpaceOwner;
      if(this.userName == this.workSpaceOwner){
        this.editPermission = true
      }
      for (let i = 0; i < this.contactsList.length; i++) {
        if (this.contactsList[i].permissions == "VIEWER") {
          console.log("permissions", this.contactsList[i].permissions)
          this.contactsList[i].viewValue = "Viewer";
        } else if (this.contactsList[i].permissions == "CAN_EDIT") {
          console.log("permissions", this.contactsList[i].permissions)
          this.contactsList[i].viewValue = "Editor";
        }
        else if (this.contactsList[i].permissions == "CONTRIBUTOR") {
          console.log("permissions", this.contactsList[i].permissions)
          this.contactsList[i].viewValue = "Contributor";
        }
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

}
