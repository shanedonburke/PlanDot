import { Component } from '@angular/core';
import { Calendar } from 'calendar';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { getCookie, setCookie } from 'src/app/util/cookies';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent {
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private calendar = new Calendar();

  constructor(
    public readonly itemService: ItemService,
    public readonly groupService: GroupService
  ) {}

  getMonthDates(year: number, month: number): Array<Array<Date>> {
    const dates = this.calendar.monthDates(year, month);
    if (dates.length === 5) {
      const newMonth = ++month % 12;
      const newYear = newMonth === 0 ? ++year : year;
      const nextDates = this.calendar.monthDates(newYear, newMonth);
      dates.push(nextDates[0][0].getDate() === 1 ? nextDates[0] : nextDates[1]);
    }
    return dates;
  }

  getYear(): number {
    const year = getCookie('year');
    return year ? parseInt(year) : this.getCurrentYear();
  }

  getMonth(): number {
    const month = getCookie('month');
    return month ? parseInt(month) : this.getCurrentMonth();
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentMonth(): number {
    return new Date().getMonth();
  }

  goToDate(date: Date): void {
    setCookie('date', date.toISOString());
    setCookie('view', 'day');
  }
}
