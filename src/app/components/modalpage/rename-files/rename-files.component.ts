import { Component, OnInit } from '@angular/core';
import { NavParams, PopoverController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-rename-files',
  templateUrl: './rename-files.component.html',
  styleUrls: ['./rename-files.component.scss'],
})
export class RenameFilesComponent implements OnInit {

  id: any;
  title: any;
  nameError: boolean = false;
  name: any;
  reName: any;
  renameMimeType: any;
  extension: any;

  constructor(private navParams: NavParams,
              private popoverController: PopoverController,
              private commonService: CommonService,
              private toastr: ToastrService,){}

  ngOnInit() {
    this.id = this.navParams.data["id"];
    this.title = this.navParams.data["title"];
    this.renameMimeType = this.navParams.data["MimeType"];
    this.extension = this.navParams.data["extension"];
    console.log("titlepopup", this.title)
  }

  closepopup(){
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  OnCreateNewName($event) {
    this.reName = $event.target.value;
    if (
      !(this.renameMimeType == "httpd/unix-directory") &&
      !(this.renameMimeType == "link")
    ) {
      this.name = this.reName + "." + this.extension;
    } else {
      this.name = this.reName;
    }
  }

  OnreNameFiles() {
    if (this.title == "") {
      this.nameError = true;
      return;
    }
    else{
      this.commonService.CreateReName(this.id, this.name).subscribe(
        (data) => {
          if (data.code == 200) {
            this.toastr.success("File Renamed Successfully");
            setTimeout(() => {
              this.popoverController.dismiss();
            }, 500);
          } else if (data.code == 304) {
            this.toastr.error(data.message);
            setTimeout(() => {
              this.popoverController.dismiss();
            }, 500);
          }
        },
        (error) => {
          if (error.status === 400) {
            setTimeout(() => {
              this.popoverController.dismiss();
            }, 500);
          }
        }
      );
    }
  }

  onFocusInEvent() {
    this.nameError = false;
  }

}
