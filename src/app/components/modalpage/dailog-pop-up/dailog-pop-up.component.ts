import { HostListener, Component, OnInit, HostBinding } from "@angular/core";
import { PopoverController } from "@ionic/angular";
import { CommonService } from "src/app/service/common.service";
import { UpgradestorageRequestComponent } from "../upgradestorage-request/upgradestorage-request.component";
declare var Razorpay: any;
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-dailog-pop-up",
  templateUrl: "./dailog-pop-up.component.html",
  styleUrls: ["./dailog-pop-up.component.scss"],
})
export class DailogPopUpComponent implements OnInit {
  popover: any;
  getMenu: any = []; //{1,2,3}
  menuID: any;
  storageRequestResult: any;
  error: string;

  @HostBinding() somthing;

  @HostListener("window:resize", ["$event"])
  sizeChange(event) {
    console.log("size changed.", event);
  }
  newThis = this;

  paymentId: any;
  constructor(
    private toastr: ToastrService,
    private popoverController: PopoverController,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.getStorageMenu();
  }

  radioChange(val: any) {
    console.log("radioChange", val);
    this.menuID = val;
  }

  request() {
    console.log(this.menuID, "menuId");

    let obj = this.getMenu.filter((item) => item.id === this.menuID);
    console.log(obj.id);
    let request = {
      upgradeOption: obj[0].id,
    };

    console.log(request.upgradeOption);

    this.commonService.requestStorageUpgrade(request).subscribe(
      (data) => {
        let options: any = {
          key: "",
          amount: "",
          name: data.payTo,
          description: data.selectedPlan,
          image:
            "",
          order_id: "",
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          notes: {
            address: "",
          },
          theme: {
            color: "#001a59",
          },
        };
        //            color: "#021e73", #262e76

        options.key = "rzp_test_gUWN4zDMjyaNng";
        options.order_id = data.pspOrderId;
        options.amount = data.applicationFee; //paise
        options.prefill.name = data.userName;
        options.prefill.email = data.email;
        options.prefill.contact = data.phoneNumber;

        options.handler = (response) => {
          this.onPaymentSuccess(response);
        };

        var rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          // Todo - store this information in the server
          console.log(response.error.code);
          console.log(response.error.description);
          console.log(response.error.source);
          console.log(response.error.step);
          this.toastr.error(response.error.reason);
          console.log(response.error.reason);
          console.log(response.error.metadata.order_id);
          console.log(response.error.metadata.payment_id);
          this.error = response.error.reason;
        });
      },
      (err) => {
        this.error = err.error.message;
      }
    );

    //this.popoverController.dismiss();
  }

  @HostListener("payment.success", ["$event"])
  onPaymentSuccess(event): void {
    console.log("lprrr->>>>>>", event);
    console.log(event);
    let paymentDetails = {
      payOrderId: event.razorpay_order_id,
      payPaymentId: event.razorpay_payment_id,
      paySignature: event.razorpay_signature,
    };
    this.commonService.updateOrder(paymentDetails).subscribe(
      (data) => {
        this.paymentId = data.message;
        this.toastr.success(data.message);
      },
      (err) => {
        this.error = err.error.message;
      }
    );
    this.closepopup();
  }

  closepopup() {
    setTimeout(() => {
      this.popoverController.dismiss();
    }, 500);
  }

  async upgradeRequest() {
    this.popover = await this.popoverController.create({
      component: UpgradestorageRequestComponent,
      keyboardClose: false,
      translucent: true,
      backdropDismiss: false,
      cssClass: "custom-popupclass",
      componentProps: this.storageRequestResult,
    });
    return this.popover.present();
  }

  getStorageMenu() {
    this.commonService.getStorageMenu().subscribe((data) => {
      this.getMenu = data;
    });
  }
}
