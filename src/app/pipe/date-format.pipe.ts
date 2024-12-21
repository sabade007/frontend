import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {

  // days: any = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  transform(date: string, args: any): string {
    if (args == 'chatFormate') {
      return this.Dateformate(date);
    }
    else {
      return this.formate(date);
    }

  }

  private formate(date): string {
    // console.log(moment(date,"YYYY-MM-DD"));
    var today: any = new Date();
    var todayString: any = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
    var today_Date: any = new Date(todayString);
    var compareDate: any = new Date(date);
    var compareDateString: any = compareDate.getMonth() + '/' + compareDate.getDate() + '/' + compareDate.getFullYear();
    var compare_Date: any = new Date(compareDateString);
    var compare_Date_timeFromat = this.timeFormat(compareDate);
    var compare_Date_dateFromat = this.dateFormat(compareDate);
    var res = Math.abs(today_Date - compare_Date) / 1000;
    // get total days between two dates
    var days = Math.floor(res / 86400);
    // get hours        
    var hours = Math.floor(res / 3600) % 24;
    // get minutes
    var minutes = Math.floor(res / 60) % 60;
    // get seconds
    var seconds = res % 60;

    if (days == 0) {
      return compare_Date_timeFromat;
    }
    else if (days == 1) {
      return 'Yesterday';
    }
    // else if (days > 1 && days <= 9) {
    //   return this.days[compare_Date.getDay()];
    // }
    else {
      return compare_Date_dateFromat;
    }

  }

  private timeFormat(date) {
    // console.log(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    // return strTime;
    return moment.utc(date).format("hh:mm A")
  }

  private dateFormat(date) {
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1; // Months start at 0!
    let dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    // return dd + '/' + mm + '/' + yyyy;
    return moment.utc(date).format("DD/MM/YYYY")
  }

  private Dateformate(date): string {
    // console.log(moment("someDate"));
    var today: any = new Date();
    var todayString: any = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
    var today_Date: any = new Date(todayString);
    var compareDate: any = new Date(date);
    var compareDateString: any = compareDate.getMonth() + '/' + compareDate.getDate() + '/' + compareDate.getFullYear();
    var compare_Date: any = new Date(compareDateString);
    var compare_Date_timeFromat = this.timeFormat(compareDate);
    var compare_Date_dateFromat = this.dateFormat(compareDate);
    var res = Math.abs(today_Date - compare_Date) / 1000;
    // get total days between two dates
    var days = Math.floor(res / 86400);
    // get hours        
    var hours = Math.floor(res / 3600) % 24;
    // get minutes
    var minutes = Math.floor(res / 60) % 60;
    // get seconds
    var seconds = res % 60;

    if (days == 0) {
      return 'Today ' + compare_Date_timeFromat;
    }
    else if (days == 1) {
      return 'Yesterday ' + compare_Date_timeFromat;
    }
    else {
      return compare_Date_dateFromat + ' ' + compare_Date_timeFromat;
    }
  }
}
