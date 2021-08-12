import { Component } from '@angular/core';
import { Calendar } from 'calendar';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent {
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  year = this.getCurrentYear();
  month = this.getCurrentMonth();

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

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getCurrentMonth(): number {
    return new Date().getMonth();
  }

  getItemBackgroundColor(item: Item): string {
    if (item.groupIds.length === 0) {
      return '#444444';
    } else {
      return (
        this.groupService.getGroupById(item.groupIds[0])?.color ?? '#444444'
      );
    }
  }

  getItemTextColor(item: Item): string {
    if (item.groupIds.length === 0) {
      return 'white';
    } else {
      return this.groupService.getGroupTextColor(
        this.groupService.getGroupById(item.groupIds[0])!!
      );
    }
  }
}
