import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-week-picker',
  templateUrl: './week-picker.component.html',
  styleUrls: ['./week-picker.component.scss']
})
export class WeekPickerComponent implements OnInit {
  @Output() changed = new EventEmitter<any>();
  label = '';
  currentDate: any;
  firstDay: any;
  lastDay: any;

  constructor() {}

  ngOnInit() {
    this.currentDate = moment().startOf('week');
    this.updateLabel();
    this.propagateValues();
  }

  prevWeek() {
    this.currentDate.subtract(7, 'day');
    this.updateLabel();
    this.propagateValues();
  }

  nextWeek() {
    this.currentDate.add(7, 'day');
    this.updateLabel();
    this.propagateValues();
  }

  propagateValues() {
    const range = {
      start: this.currentDate.startOf('week').format('YYYY-MM-DD'),
      end: this.currentDate.endOf('week').format('YYYY-MM-DD')
    };
    this.changed.emit(range);
  }

  updateLabel() {
    this.label = `${this.currentDate.startOf('week').format('LL')}, ` + this.currentDate.endOf('week').format('LL');
  }
}
