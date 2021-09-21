import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';

/**
 * A service that manages the date shown in the day view and the month
 * shown in the month view.
 */
@Injectable({
  providedIn: 'root'
})
export class DateService {
  /** Index of the month being shown in the month view, e.g. `0` for January */
  month!: number;

  /** Year being shown in the month view, e.g. `2021` */
  year!: number;

  /** The date being shown in the day view */
  get date(): Date {
    return this._date;
  }

  set date(val: Date) {
    val.setHours(0, 0, 0, 0);
    this._date = val;
    this._onDateChanged.next(this.date);
  }

  /** Emits when the day view's date changes */
  get onDateChanged(): Observable<Date> {
    return this._onDateChanged.asObservable();
  }

  /** The date being shown in the day view */
  private _date!: Date;

  /** Emits when the day view's date changes */
  private _onDateChanged = new Subject<Date>();

  constructor() {
    this.resetDate();
    this.resetMonth();
  }

  /**
   * Reset the day view's date to today, then notify subscribers.
   */
  resetDate(): void {
    this.date = getTodaysDate();
  }

  /**
   * Reset the month/year being shown in the month view.
   */
  resetMonth(): void {
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
  }

  /**
   * Go to the previous date in the day view.
   */
  goToPrevDate(): void {
    this.date.setTime(this.date.getTime() - ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }
  
  /**
   * Go to the next date in the day view.
   */
  goToNextDate(): void {
    this.date.setTime(this.date.getTime() + ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }

  /**
   * Go to the previous month in the month view.
   */
  goToPrevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
  }

  /**
   * Go to the next month in the month view.
   */
  goToNextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
  }
}
