import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ProjectService } from '../@services/project.service';
import { fastFade } from '../animations';
import { BookingService } from '../@services/booking.service';

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  animations: [fastFade]
})
export class DatepickerComponent implements OnInit {
  public date = moment();
  public dateForm: FormGroup;
  public daysArr;

  projectDetailsGroup;

  diffDates;

  nextStep: string;
  showHidePicker = false;

  constructor(
    public projectService: ProjectService,
    public bookingService: BookingService
  ) {
    this.dateForm = this.projectService.dateDetails;
  }

  ngOnInit() {
    this.daysArr = this.createCalendar(this.date);
    this.nextStep = 'start';
  }

  togglePicker() {
    this.showHidePicker = !this.showHidePicker;
  }

  createCalendar(month) {
    const firstDay = moment(month).startOf('M');
    const days = Array.apply(null, { length: month.daysInMonth() })
      .map(Number.call, Number)
      .map(n => {
        return moment(firstDay).add(n, 'd');
      });

    for (let n = 0; n < firstDay.weekday(); n++) {
      days.unshift(null);
    }

    return days;
  }

  todayCheck(day) {
    if (!day) {
      return false;
    }
    return moment().format('L') === day.format('L');
  }

  nextMonth() {
    this.date.add(1, 'M');
    this.daysArr = this.createCalendar(this.date);
  }

  previousMonth() {
    this.date.subtract(1, 'M');
    this.daysArr = this.createCalendar(this.date);
  }

  isSelected(day) {
    if (!day) {
      return false;
    }

    const dateStart = this.dateForm.value.dateStart;
    const dateEnd = this.dateForm.value.dateEnd;

    if (this.dateForm.valid) {
      return dateStart.isSameOrBefore(day) && dateEnd.isSameOrAfter(day);
    }

    if (this.dateForm.get('dateStart').valid) {
      return dateStart.isSame(day);
    }
  }

  selectedDate(day) {
    // Is it before today?
    if (this.pastCheck(day) === true) {
      return;
    }

    if (this.dateForm.valid) {
      this.dateForm.setValue({
        dateStart: null,
        dateEnd: null,
        billableDays: null
      });
      this.nextStep = 'start';
      return;
    }
    if (!this.dateForm.get('dateStart').value) {
      this.dateForm.get('dateStart').patchValue(moment(day));
      this.nextStep = 'end';
    } else {
      this.dateForm.get('dateEnd').patchValue(moment(day));
      const dates = {
        start: this.dateForm.value.dateStart,
        end: this.dateForm.value.dateEnd
      };

      this.nextStep = 'clear';

      this.DateDiff(dates.start, dates.end);

      this.projectService.getProjectLoaded().update({
        dateRange: {
          start: new Date(dates.start),
          end: new Date(dates.end)
        }
      });
    }
  }

  startOrEnd(day) {
    day = moment(day);
    // console.log("day", day)
    // console.log("dayEnd", this.dateForm.value.dateEnd)
    if (
      day != null &&
      (day.isSame(this.dateForm.value.dateEnd) ||
        day.isSame(this.dateForm.value.dateStart))
    ) {
      return true;
    }
  }

  DateDiff(d1, d2) {
    const diff = d2.diff(d1, 'days') + 1;
    this.dateForm.patchValue({ billableDays: diff });
    this.projectService.getProjectLoaded().update({
      billableDays: diff
    });
    this.diffDates = diff;
    console.log(this.diffDates);
  }

  pastCheck(day) {
    if (moment().diff(day, 'days') > 0) {
      return true;
    }

    if (day < this.dateForm.value.dateStart) {
      return true;
    }
  }

  clear() {
    this.dateForm.get('dateStart').patchValue('');
    this.dateForm.get('dateEnd').patchValue('');

    this.projectService
      .getProjectLoaded()
      .update({ dateRange: { start: '', end: '' } });
    this.diffDates = 0;
  }
}
