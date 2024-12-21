import { Component, OnInit, Renderer2 } from "@angular/core";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from "../../../service/common.service";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import * as moment from "moment";
import { FilesService } from "src/app/service/files.service";
import { ToastController, PopoverController, NavParams } from "@ionic/angular";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-duplicatefile",
  templateUrl: "./duplicatefile.component.html",
  styleUrls: ["./duplicatefile.component.scss"],
})
export class DuplicatefileComponent implements OnInit {
  constructor(
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private filesService: FilesService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public toastController: ToastController,
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private navParams: NavParams,
    private renderer: Renderer2
  ) {}

  some: any = "true";

  ngOnInit() {
    this.onSelection();
  }

  onSelection() {}

  overrite(val: any) {
    this.popoverController.dismiss({ data: val });
  }
}
