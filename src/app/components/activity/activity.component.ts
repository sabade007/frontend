import { Component, OnInit } from "@angular/core";
import { ActivityServiceService } from "./../../service/activity-service.service";
import { NgxUiLoaderService } from "ngx-ui-loader";
import * as moment from "moment";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/service/common.service";
import { LocalService } from "src/environments/local.service";
import { localData } from "src/environments/mimetypes";
import { environment } from "src/environments/environment.prod";

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit {
  activityList: any = [];
  activityCount: any = [];
  activityCountList = [];
  activity: any = [];
  timestamplist: any = [];
  today: any;
  clickedDate: any;
  startDates: any;
  dates: any;
  displayYear: any;
  getDate : any;
  OnDateClick : boolean = false;
  displayDate : any;
  hidedate : boolean = true;
  showdate : boolean = false;
  momentVariable : any;
  stringvalue : any;
  productName = environment.productname;

  public calendar: CalendarDay[] = [];
  public monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  public displayMonth: string;
  private monthIndex: number = 0;
  private userName: string = "";

  public events = [];
  selectedMonth: Date;

  constructor(
    private activityServiceService: ActivityServiceService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private localService: LocalService
  ) {
    route.params.subscribe((val) => {
      let date = moment(new Date()).format("DD/M/YYYY");
      this.handleDateClick(date);
      this.commonService.getDashboardInfo();
      // let dates = new Date()
      // let startDates = new Date(dates.getFullYear(), dates.getMonth(), 1)
      // this.getActivityCount(startDates);

      this.commonService.storeHeader("Activity");
    });
  }

  ngOnInit() {
    this.userName = this.localService.getJsonValue(localData.username)
    this.generateCalendarDays(this.monthIndex);
  }

  handleDateClick(arg) {
    this.dates = arg;
    this.momentVariable = moment(arg, 'DD-M-YYYY');  
    this.stringvalue = this.momentVariable.format('DD MMMM YYYY');   
    console.log(this.stringvalue); // outputs 2018-08-25  
    this.displayDate = this.dates.substring(0,2)
    // console.log("dates",this.displayDate)
    //this.ngxService.start();
    let data = {
      date: arg,
      recentActivity: false,
    };
    this.activityServiceService
      .getActivitiesList(data)
      .subscribe((result: any) => {
        this.activityList = result;
        this.activityList = this.getFilesByactivityAction("USER_LOGIN");
        this.ngxService.stop();
        for (let i = 0; i < this.activityList.length; i++) {
          if (this.activityList[i].userName == this.userName) {
            this.activityList[i].userName = "You";
          }
          this.activityList[i].activityAction = this.activityList[
            i
          ].activityAction
            .replace("FILE_", "")
            .toLowerCase();
          this.activityList[i].objectMetadata = this.activityList[
            i
          ].objectMetadata.replace("{filename=", " ");
          this.activityList[i].objectMetadata = this.activityList[
            i
          ].objectMetadata.replace("}", " ");
          this.activityList[i].objectMetadata = this.activityList[
            i
          ].objectMetadata.replace("}", " ");
          this.activityList[i].timestamp = moment(
            this.activityList[i].timestamp
          ).format("DD/M/YYYY hh:mm A");
          this.activityList[i].activityAction = this.activityList[i].
          activityAction.replace("GROUP_", "").toLowerCase();
        console.log("+++++",this.activityList[i].
        activityAction.replace("GROUP_", "").toLowerCase())
        }
      });
  }

  getFilesByactivityAction(activityAction) {
    return this.activityList.filter((x) => x.activityAction != activityAction);
  }

  // getnumberofDays(startDates) {
  //   let month: any = moment(startDates).format('MM');
  //   let year: any = moment(startDates).format('YYYY');
  //   return new Date(year, month, 0).getDate();
  // }

  getActivityCount(startDates) {
    //this.ngxService.start();
    this.startDates = moment(startDates).format("DD/MM/YYYY");
    let activityCount = {
      numberOfDays: 42,
      startDate: this.startDates,
    };
    this.activityServiceService.getActivitiesCount(activityCount).subscribe(
      (result: any) => {
        this.ngxService.stop();
        this.events = result;
      },
      (error) => {
        this.activityCount = [];
        this.ngxService.stop();
      }
    );
  }

  private generateCalendarDays(monthIndex: number): void {
    this.calendar = [];
    let day: Date = new Date(
      new Date().setMonth(new Date().getMonth() + monthIndex)
    );
    this.selectedMonth = day;
    this.displayMonth = this.monthNames[day.getMonth()];
    this.displayYear = day.getFullYear();
    console.log("year", this.displayYear);
    this.getDate = day.getDate();
    console.log("date", this.getDate)
    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;
    for (var i = 0; i < 42; i++) {
      if(day.getMonth() == dateToAdd.getMonth()) {
        console.log(this.calendar)
      }
      this.calendar.push(new CalendarDay(new Date(dateToAdd), this.selectedMonth));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
  }

  private getStartDateForCalendar(selectedDate: Date) {
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(
          startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1)
        );
      } while (startingDateOfCalendar.getDay() != 1);
    }
    this.getActivityCount(startingDateOfCalendar);
    return startingDateOfCalendar;
  }

  public increaseMonth() {
    this.hidedate = false;
    this.showdate = true;
    this.monthIndex++;
    this.generateCalendarDays(this.monthIndex);
  }

  public decreaseMonth() {
    this.hidedate = false;
    this.showdate = true;
    this.monthIndex--;
    this.generateCalendarDays(this.monthIndex);
  }

  public setCurrentMonth() {
    this.hidedate = true;
    this.monthIndex = 0;
    this.generateCalendarDays(this.monthIndex);
  }

  getevent(data: any) {
    let event;
    if (data.length) {
      event = true;
    } else {
      event = false;
    }
    return event;
  }

  // onclick date
  onclickdate(date: any) {
    this.handleDateClick(moment(date.date).format("DD/M/YYYY"));
  }

  checkevent(date1, date2) {
    if (new Date(date1.replace( " " , "T" )).setHours(0, 0, 0, 0) === date2.setHours(0, 0, 0, 0)) {
      return true;
    } else {
      return false;
    }
  }

  goToDashboard() {
    this.router.navigate(["/user/dashboard"]);
  }
}

export class CalendarDay {
  public date: Date;
  public title: string;
  public isPastDate: boolean;
  public isToday: boolean;
  public event: any;
  isThisMonth: any;

  public getDateString() {
    return this.date.toISOString().split("T")[0];
  }

  constructor(d: Date, selectedMonth:any) {
    this.date = d;
    this.isPastDate = d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    this.isToday = d.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
    this.isThisMonth = this.isSameMonth(d,selectedMonth);
  }

  isSameMonth(date,selectedMonth) {
    console.log(date,selectedMonth);
    if(this.isThisMonth == true)
    return date.getMonth() === selectedMonth.getMonth();
  }
}
