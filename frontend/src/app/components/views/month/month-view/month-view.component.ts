import { Component } from '@angular/core';
import { Calendar } from 'calendar';
import { Item } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ViewService } from 'src/app/services/view.service';
import { MONTHS, WEEKDAYS_FULL } from 'src/app/util/constants';

/**
 * Component for the month view. Shows a calendar for a month with a
 * preview of each day's items.
 */
@Component({
  selector: 'app-month-view',
  templateUrl: './month-view.component.html',
  styleUrls: ['./month-view.component.scss'],
})
export class MonthViewComponent {
  /** Days of the week */
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /** Calendar object */
  private calendar = new Calendar();

  /** Cache of items for each date to improve performance */
  private cachedDateItems = new Map<string, Item[]>();

  constructor(
    public readonly itemService: ItemService,
    public readonly dateService: DateService,
    private readonly viewService: ViewService,
    userDataService: UserDataService
  ) {
    // If an item in the month changes, the view will still show the old cached
    // items. Clear the cache to show fresh data on next change detection
    userDataService.onUserDataChanged.subscribe(() => {
      this.cachedDateItems.clear();
    });
  }

  /**
   * Returns the dates to be shown in the calendar. This will include
   * days from the previous/next months to fill in the calendar.
   * @param year Full year, e.g., 2021
   * @param month Month index, e.g., 0 for January
   * @returns An array of dates for the given month's calendar, by week
   */
  getMonthDates(year: number, month: number): Array<Array<Date>> {
    const dates = this.calendar.monthDates(year, month);

    // The calendar shows 6 weeks, so add days from the next month to fill in
    if (dates.length === 5) {
      const newMonth = ++month % 12;
      const newYear = newMonth === 0 ? ++year : year;
      const nextDates = this.calendar.monthDates(newYear, newMonth);

      // If the next month's calendar has no dates from this month, then
      // we need the whole first week. If the first day of the next month is in
      // the fifth week of this calendar, then we already have the first week
      // of next month's calendar.
      dates.push(nextDates[0][0].getDate() === 1 ? nextDates[0] : nextDates[1]);
    }
    return dates;
  }

  /**
   * View a date from this month in the day view.
   * @param date The date to view
   */
  goToDate(date: Date): void {
    this.dateService.date = date;
    this.viewService.goToDayView();
  }

  /**
   * @returns A string representing the month, e.g., "January 2021"
   */
  getMonthString() {
    return MONTHS[this.dateService.month] + ' ' + this.dateService.year;
  }

  /**
   * @param date A date in this month's calendar
   * @returns The items for the given date
   */
  getItemsByDate(date: Date): Item[] {
    if (this.cachedDateItems.has(date.toDateString())) {
      return this.cachedDateItems.get(date.toDateString())!!;
    }
    const items = this.itemService.getItemsByDate(date);
    this.cachedDateItems.set(date.toDateString(), items);
    return items;
  }

  /**
   * Creates an appropriate value for the `aria-label` attribute for a day.
   * @param date A date in this month's calendar
   * @returns A string describing the date, e.g., "Wednesday September 22 2021"
   */
  getDateAriaLabel(date: Date): string {
    return `${WEEKDAYS_FULL[date.getDay()]} ${
      MONTHS[this.dateService.month]
    } ${date.getDate()} ${this.dateService.year}`;
  }

  /**
   * Identify a date in the template by its date string.
   */
  trackByDate(index: number, date: Date): string {
    return date.toDateString();
  }

  /**
   * Identify a week in the template by its dates.
   */
  trackByWeek(index: number, week: Array<Date>): string {
    return week.map((date) => date.toDateString()).join(',');
  }
}
