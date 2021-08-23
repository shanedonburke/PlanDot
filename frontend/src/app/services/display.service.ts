import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  date!: Date;
  month!: number;
  year!: number;

  constructor() {
    this.resetDay();
    this.resetMonth();
  }

  get onDateChanged(): Observable<Date> {
    return this._onDateChanged.asObservable();
  }

  private _onDateChanged = new Subject<Date>();

  resetDay(): void {
    this.date = getTodaysDate();
  }

  resetMonth(): void {
    this.month = this.date.getMonth();
    this.year = this.date.getFullYear();
  }

  goToPrevDate(): void {
    this.date.setTime(this.date.getTime() - ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }
  
  goToNextDate(): void {
    this.date.setTime(this.date.getTime() + ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }

  goToPrevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
  }

  goToNextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
  }
}
