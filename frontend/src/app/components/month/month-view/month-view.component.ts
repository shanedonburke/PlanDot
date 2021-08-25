import { Component } from '@angular/core';
import { Calendar } from 'calendar';
import { ItemJson } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { ViewService } from 'src/app/services/view.service';
import { MONTHS } from 'src/app/util/constants';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent {
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  private calendar = new Calendar();
  private cachedDateItems = new Map<Date, ItemJson[]>();

  constructor(
    public readonly itemService: ItemService,
    public readonly groupService: GroupService,
    public readonly displayService: DateService,
    private readonly viewService: ViewService,
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

  goToDate(date: Date): void {
    this.displayService.date = date;
    this.viewService.goToDayView();
  }

  getMonthString() {
    return MONTHS[this.displayService.month] + ' ' + this.displayService.year;
  }

  getItemsByDate(date: Date): ItemJson[] {
    if (this.cachedDateItems.has(date)) {
      return this.cachedDateItems.get(date)!!;
    }
    const items = this.itemService.getItemsByDate(date);
    this.cachedDateItems.set(date, items);
    return items;
  }
}
