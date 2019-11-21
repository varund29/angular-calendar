
import { Injectable, ChangeDetectorRef } from '@angular/core';

@Injectable()
export class CalendarService {

  cell: any = [];
  weeks: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  holidays: any = ['26-1-2019-Republic Day', '4-3-2019-Maha Shivaratri', '6-4-2019-Ugadi', '14-4-2019-Ambedkar Jayanti',
    '14-4-2019-Rama Navami', '19-4-2019-Good Friday', '5-6-2019-Eid al-Fitr', '15-8-2019-Independence Day', '10-9-2019-Ashura',
    '2-10-2019-Gandhi Jayanti', '8-10-2019-Dussehra', '27-10-2019-Diwali', '9-11-2019-Mawlid', '25-12-2019-Christmas Day',

    '26-1-2020-Republic Day', '4-3-2020-Maha Shivaratri', '6-4-2020-Ugadi', '14-4-2020-Ambedkar Jayanti',
    '14-4-2020-Rama Navami', '19-4-2020-Good Friday', '5-6-2020-Eid al-Fitr', '15-8-2020-Independence Day', '10-9-2020-Ashura',
    '2-10-2020-Gandhi Jayanti', '8-10-2020-Dussehra', '27-10-2020-Diwali', '9-11-2020-Mawlid', '25-12-2020-Christmas Day',

    '26-1-2021-Republic Day', '4-3-2021-Maha Shivaratri', '6-4-2021-Ugadi', '14-4-2021-Ambedkar Jayanti',
    '14-4-2021-Rama Navami', '19-4-2021-Good Friday', '5-6-2021-Eid al-Fitr', '15-8-2021-Independence Day', '10-9-2021-Ashura',
    '2-10-2021-Gandhi Jayanti', '8-10-2021-Dussehra', '27-10-2021-Diwali', '9-11-2021-Mawlid', '25-12-2021-Christmas Day'];

  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any = [1993, 2019, 2020, 2021];
  locations: any = ['Bangalore', 'Chennai', 'Hyderabad', 'Noida', 'Pune'];
  totalCell = 0;
  selectedLocation = 0;
  selectedMonth = 0;
  selectedYear = 0;
  constructor() {

    let today = new Date();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    this.selectedLocation = 0;
    this.selectedMonth = mm;
    this.selectedYear = yyyy;
    console.log(this.selectedMonth, this.selectedYear)
    this.loadCalenderForMonth();
  }

  getHolidays() {
    let m = this.selectedMonth;
    let y = this.selectedYear
    return this.holidays.filter(function (el) {
      return el.indexOf(m + "-" + y) > -1;
    });
  }
  getCssclass(i, isSeleted) {
    // console.log(i,"isSeleted=",isSeleted)
    let isValidDate = this.isValidNumber(i);

    const isCurrentDay = this.returnIsCurrentDay(i);

    let isHoliday = this.returnIsHoliday(i);
    let isWeekEnd = this.returnIsWeekEnd(i);

    let cssClass = {
      'hover': isSeleted,
      'not-allow': !isValidDate,
      'holiday notallow': isHoliday,
      'sunday notallow': isWeekEnd[0],
      'current-date': isCurrentDay,
      'day': (!isHoliday && !isWeekEnd[0] && isValidDate)
    }
    // console.log("cssClass=",cssClass)
    return cssClass;
  }
  private returnIsCurrentDay(i: any) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    let currentDate = dd + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
    let todayDate = i + '-' + this.selectedMonth + '-' + this.selectedYear;
    console.log("todayDate=",todayDate, currentDate)
  
    return todayDate==currentDate;
  }

  public loadCalenderForMonth() {
    this.cell = [];

    let firstDayOfMonth = this.getFirstDayOfMonthForYear();

    let daysInMonth = this.daysInThisMontForYear();
    this.totalCell = daysInMonth + firstDayOfMonth;
    let index = -1;

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.cell.push({ index: i, displayLabel: '', cssClass: { 'notallow': true }, holidays: [] });
      index = i;
    }

    let holidays = this.getHolidays();

    for (let i = 0; i < daysInMonth; i++ , index++) {
      const displayLabel = (i + 1);

      let holies = this.returnHolidays(holidays, (i + 1));
      if (this.returnIsCurrentDay(i + 1)) {
        holies.push(this.getTime());
      }

      this.cell.push({ index: index, displayLabel: displayLabel, cssClass: this.getCssclass((i + 1), false), isSelected: false, holidays: holies });
    }
  }
  private returnIsHoliday(index: number) {
    let holidays = this.getHolidays();
    let isHoliday = false;
    holidays.forEach(element => {
      if (parseInt(element.split("-")[0]) == index) {
        isHoliday = true;
      }
    });
    return isHoliday;
  }

  private returnHolidays(holidays: any[], index: number) {
    let holies: any = [];
    holidays.forEach(element => {
      if (parseInt(element.split("-")[0]) == index) {
        holies.push(element.split("-")[3]);
      }
    });
    return holies;
  }
  private returnIsWeekEnd(index: number) {
    let isWeekEnd = [false, false]

    let myDate = new Date();
    myDate.setFullYear(this.selectedYear);
    myDate.setMonth(this.selectedMonth - 1);
    myDate.setDate(index);

    /*  if (myDate.getDay() == 6 || myDate.getDay() == 0) 
     {
       isWeekEnd = [true, false];
     }; */

    if (myDate.getDay() == 0) {
      isWeekEnd = [true, false];
    }
    return isWeekEnd;
  }
  getTime() {
    // initialize time-related variables with current time settings
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    now = null
    let ampm = ""
    let min = "";

    // validate hour values and set value of ampm
    if (hour >= 12) {
      hour -= 12
      ampm = "PM"
    } else
      ampm = "AM"
    hour = (hour == 0) ? 12 : hour

    // add zero digit to a one digit minute
    if (minute < 10)
      min = "0" + minute // do not parse this number!
    else
      min = "" + minute;

    // return time string
    return hour + ":" + min + " " + ampm
  }
  daysInThisMontForYear() {
    return new Date(this.selectedYear, this.selectedMonth, 0).getDate();
  }

  geDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonthForYear() {

    return this.weeks.findIndex(x => x === new Date(this.selectedYear, (this.selectedMonth - 1), 1).toString().split(' ')[0]);
  }
  isValidNumber(day) {
    if (day) {
      return true;
    } else {
      return false;
    }
  }
  onCellClick(index, day) {


    let isWeekEnd = this.returnIsWeekEnd(day)[0];
    let isHoliday = this.returnIsHoliday(day);
    if (isWeekEnd) {
      this.cell[index].isSeleted = false;
    }
    else if (isHoliday) {
      this.cell[index].isSeleted = false;
    }
    else {
      this.cell[index].isSeleted = !this.cell[index].isSeleted;
    }
    if (!this.isValidNumber(day)) {
      this.cell[index].isSeleted = false;
    }
    //this.cell[index].isSeleted = !this.cell[index].isSeleted;
    console.log("css=", this.getCssclass(day, this.cell[index].isSeleted))
    this.cell[index].cssClass = this.getCssclass(day, this.cell[index].isSeleted);


  }
}
