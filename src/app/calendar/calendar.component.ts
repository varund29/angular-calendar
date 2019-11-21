import { Component, OnInit, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CalendarService } from './calendar.service';

@NgModule({
  imports: [
    FormsModule
  ]
})
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(public caln:CalendarService) {

   }

  ngOnInit() {
   
  }
  
  onLocationSelect(event) {
   
    this.caln.loadCalenderForMonth();
  }

  onYearSelect(event) {
    this.caln.loadCalenderForMonth();
  }

  onMonthSelect(event) {
   
    this.caln.loadCalenderForMonth();
  }
  onCellClick(index,day) {
   this.caln.onCellClick(index,day);
  }
}
