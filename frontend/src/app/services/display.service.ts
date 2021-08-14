import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  date = getTodaysDate();
  month = this.date.getMonth();
  year = this.date.getFullYear();

  get onDateChanged(): Observable<Date> {
    return this._onDateChanged.asObservable();
  }

  private _onDateChanged = new Subject<Date>();

  gotoPrevDate(): void {
    this.date.setTime(this.date.getTime() - ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }
  
  gotoNextDate(): void {
    this.date.setTime(this.date.getTime() + ONE_DAY_MS);
    this._onDateChanged.next(this.date);
  }

  gotoPrevMonth(): void {
    if (this.month === 0) {
      this.month = 11;
      this.year--;
    } else {
      this.month--;
    }
  }

  gotoNextMonth(): void {
    if (this.month === 11) {
      this.month = 0;
      this.year++;
    } else {
      this.month++;
    }
  }
}
