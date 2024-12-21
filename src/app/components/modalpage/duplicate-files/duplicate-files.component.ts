import { Component, OnInit } from "@angular/core";
import { NavParams, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-duplicate-files",
  templateUrl: "./duplicate-files.component.html",
  styleUrls: ["./duplicate-files.component.scss"],
})
export class DuplicateFilesComponent implements OnInit {
  overwriteData: any;
  type: any;
  path: any;
  constructor(
    private popoverController: PopoverController,
    private navParams: NavParams
  ) {
    this.type = this.navParams.get("type");
    this.path = this.navParams.get("path");
  }

  ngOnInit() {}

  overwrite(overWrite, restoreAll) {
    var data = {
      overWrite: overWrite,
      restoreAll: restoreAll,
    };
    console.log("dataa--", data)
    this.popoverController.dismiss(data);
  }

  closepopup(overWrite, restoreAll) {
    var data = {
      overWrite: overWrite,
      restoreAll: restoreAll,
    };
    console.log("dataa--", data)
    setTimeout(() => {
      this.popoverController.dismiss(data);
    }, 500);
  }
}
