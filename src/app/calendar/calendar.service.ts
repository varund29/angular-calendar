
import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jsonHolidays from '../assets/holidays.json';

@Injectable()
export class CalendarService {

  cell: any = [];
  weeks: any = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  holidays: any = [];

  months: any = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: any = [2019,2020];
  locations: any = ['Bangalore', 'Chennai', 'Hyderabad','Gurugram', 'Noida', 'Pune'];
  totalCell = 0;
  selectedLocation = 0;
  selectedMonth = 0;
  selectedYear = 0;

  constructor(public _http: HttpClient) {

    let today = new Date();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    this.selectedLocation = 0;
    this.selectedMonth = mm;
    this.selectedYear = this.years.indexOf(yyyy) ;
   // console.log("jsonHolidays",jsonHolidays);
    this.holidays=jsonHolidays;
    this.loadCalenderForMonth();
  /*   this.readHolidaysJson().then(result => {
      this.holidays = result;
      this.loadCalenderForMonth();
    } 
    );*/
    setInterval(() => this.loadCalenderForMonth(),60000);
  }

  readHolidaysJson() {

    let promise = new Promise((resolve, reject) => {
      let apiURL = `assets/holidays.json`;
      this._http.get(apiURL)
        .toPromise()
        .then(
          res => {
            resolve(res);
          }
        );
    });
    return promise;
  }
  getHolidays() {
    let m = this.selectedMonth;
    let y = this.years[this.selectedYear]//this.selectedYear  
    for(let i=0;i<Object.keys(this.holidays).length;i++) {
      let loc=this.holidays[i][this.locations[this.selectedLocation]]      
      if(loc){
        return loc.filter(function (el) {
          return el.day.indexOf(m + "-" + y) > -1;
        });
      }
    }
   
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
    const dd = today.getDate();
    let currentDate = dd + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
    let todayDate = i + '-' + this.selectedMonth + '-' + this.years[this.selectedYear];//this.selectedYear;
    console.log("todayDate=",todayDate, currentDate, dd)

    return todayDate == currentDate;
  }

  public loadCalenderForMonth():void {
   
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
   // console.log("holidays=",holidays)

    for (let i = 0; i < daysInMonth; i++ , index++) {
      const displayLabel = (i + 1);

      let holies = this.returnHolidays(holidays, (i + 1));
      // console.log("holies=",holies)
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
      let day=parseInt(element.day.split("-")[0]);
      let month=parseInt(element.day.split("-")[1])
      if (day == index && month==this.selectedMonth) {
        isHoliday = true;
      }
    });
    return isHoliday;
  }

  private returnHolidays(holidays: any[], index: number) {
    let holies: any = [];
    holidays.forEach(element => {
      let day=parseInt(element.day.split("-")[0]);
      let month=parseInt(element.day.split("-")[1])
      if (day == index && month==this.selectedMonth) {
        holies.push(element.day.split("-")[3]);
      }
    });
    return holies;
  }
  private returnIsWeekEnd(index: number) {
    let isWeekEnd = [false, false]
    let setMn=this.selectedMonth;
    setMn--;    
    let myDate = new Date(parseInt(this.years[this.selectedYear]),setMn,index);   
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
    return new Date(this.years[this.selectedYear], this.selectedMonth, 0).getDate();
  }

  geDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  getFirstDayOfMonthForYear() {

    return this.weeks.findIndex(x => x === new Date(this.years[this.selectedYear], (this.selectedMonth - 1), 1).toString().split(' ')[0]);
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
   // console.log("css=", this.getCssclass(day, this.cell[index].isSeleted))
    this.cell[index].cssClass = this.getCssclass(day, this.cell[index].isSeleted);


  }
  
  prevLocation(){
   let setLoc=this.selectedLocation;
   setLoc--;
   if(setLoc<0){
   setLoc=this.locations.length-1;
   }
  this.selectedLocation = setLoc ;
  this.loadCalenderForMonth();
  }
  nextLocation(){
  
 let setLoc=this.selectedLocation;
  setLoc++;
   if(setLoc>=this.locations.length){
    setLoc=0;
   }
  this.selectedLocation = setLoc ;
  this.loadCalenderForMonth();
  }
  prevYear(){
     let setYr=this.selectedYear;
       setYr--
   if(setYr<0){
      setYr=this.years.length-1;
   }
  this.selectedYear = setYr ;
  this.loadCalenderForMonth();

  }
  nextYear(){
  let setYr=this.selectedYear;
  setYr++;
   if(setYr>=this.years.length){
     setYr=0;
   }
  this.selectedYear = setYr ;
  this.loadCalenderForMonth();
  }
  prevMonth(){
   let setMn=this.selectedMonth;
   setMn--;
   if(setMn<1){
   setMn=this.months.length;
   }

  this.selectedMonth = setMn ;
  this.loadCalenderForMonth();
  }
  nextMonth(){
     let setMn=this.selectedMonth;
     setMn++;  
   if(setMn>=(this.months.length+1)){
     setMn=1;
   }

  this.selectedMonth = setMn ;
  this.loadCalenderForMonth();
  }
}
