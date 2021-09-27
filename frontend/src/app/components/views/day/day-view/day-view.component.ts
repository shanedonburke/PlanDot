import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Item } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ItemViewDialogComponent } from '../../../dialogs/item-view-dialog/item-view-dialog.component';

interface ItemData {
  item: Item;
  rowStart: number;
  rowEnd: number;
}

/**
 * Component for the day view. Shows all items for the
 * specified day by the hour. Items may have overlapping times, in which case
 * more columns are added to show the items next to one another.
 */
@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
})
export class DayViewComponent implements OnInit, OnDestroy {
  /** 0-23, used in ngFor */
  hours = [...Array(24).keys()];

  /** Number of columns. Increases to accommodate overlapping times */
  numColumns = 1;

  /** Columns to show in the template */
  columns: Array<Array<ItemData>> = [];

  /** Items with no time, shown above the hourly view */
  timelessItems: Array<Item> = [];

  /** Emits when the component is destroyed */
  private onComponentDestroyed = new Subject<void>();

  constructor(
    public readonly itemService: ItemService,
    public readonly dateService: DateService,
    private readonly userDataService: UserDataService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.update();
    this.userDataService.onUserDataChanged
      .pipe(takeUntil(this.onComponentDestroyed))
      .subscribe(() => this.update());
    this.dateService.onDateChanged
      .pipe(takeUntil(this.onComponentDestroyed))
      .subscribe(() => this.update());
  }

  ngOnDestroy(): void {
    this.onComponentDestroyed.next();
  }

  /**
   * Translates an hour number to a string to be shown in the template.
   * @param hour 0-23
   * @returns A formatted string for the hour, e.g., "2 PM"
   */
  getHourString(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    let clockHour = hour >= 12 ? hour - 12 : hour;
    if (clockHour === 0) {
      clockHour = 12;
    }
    return `${clockHour} ${period}`;
  }

  /**
   * Opens the item view dialog for the clicked item.
   * @param item The item to view
   */
  expandItem(item: Item): void {
    this.dialog.open(ItemViewDialogComponent, {
      data: { item },
      autoFocus: false,
    });
  }

  /**
   * Track an item by its ID.
   * @param index The index of the item within its `ngFor`
   * @param item The item to track
   * @returns The item's ID
   */
  trackItemById(index: number, item: Item): string {
    return item.id;
  }

  /**
   * Updates the view with the items for the current date. Places items into
   * columns (as few as possible) to show overlapping times.
   */
  private update(): void {
    this.numColumns = this.calcNumColumns();
    this.columns = [];
    this.timelessItems = [];

    for (let i = 0; i < this.numColumns; i++) {
      this.columns.push([]);
    }

    for (const item of this.itemService.getItemsByDate(this.dateService.date)) {
      if (!item.isStartTimeEnabled) {
        this.timelessItems.push(item);
      } else {
        this.placeItemInColumn(item);
      }
    }
  }

  /**
   * Calculates the minimum number of columns needed to show all items.
   * If no items' times overlap, the number of columns is 1.
   * @returns The number of columns needed
   */
  private calcNumColumns(): number {
    const items = this.itemService.getItemsByDate(this.dateService.date);

    // The maximum number of columns needed for any minute of the day
    let maxNumColsNeeded = 0;

    // 1440 minutes in one day, but the template has half as many rows
    // for performance reasons.
    for (let i = 0; i < 1440 / 2; i++) {
      // Number of items occurring during this time == num columns needed
      const numColsNeeded = items.filter((item) => {
        return (
          item.isStartTimeEnabled &&
          DayViewComponent.getItemRowStart(item) <= i &&
          DayViewComponent.getItemRowEnd(item) > i
        );
      }).length;
      maxNumColsNeeded = Math.max(maxNumColsNeeded, numColsNeeded);
    }
    return maxNumColsNeeded;
  }

  /**
   * Place an item in the first suitable column, i.e., the one where this
   * item would not overlap with any items already in the column.
   * @param item The item to place
   */
  private placeItemInColumn(item: Item): void {
    for (const col of this.columns) {
      const rowStart = DayViewComponent.getItemRowStart(item);
      
      // Items being placed are sorted by start time, so comparing with only
      // the last item in a given column still produces the optimal solution.
      if (col.length === 0 || col[col.length - 1].rowEnd <= rowStart) {
        col.push({
          item,
          rowStart,
          // Subtract 1 so there's a bit of space between items
          rowEnd: DayViewComponent.getItemRowEnd(item) - 1,
        });
        break;
      }
    }
  }

  /**
   * @param item The item to get the start row for
   * @returns Index of the row where the item starts, e.g., 0 for 12:00 AM
   */
  private static getItemRowStart(item: Item): number {
    return this.convertMinutesToRowNumber(item.getStartTimeInMinutes());
  }

  /**
   * @param item The item to get the end row for
   * @returns Index of the row where the item ends, e.g., 30 for 1:00 AM
   */
  private static getItemRowEnd(item: Item): number {
    let row = this.convertMinutesToRowNumber(item.getEndTimeInMinutes());

    // If the item lasts less than 5 minutes, show it as 5 minutes so
    // it's still visible and large enough to be clickable
    row = Math.max(row, DayViewComponent.getItemRowStart(item) + 5);

    return row;
  }

  /**
   * There is one CSS grid row for every 2 minutes, because having
   * one for every minute is bad for performance. This method returns the
   * row number corresponding to a given minute.
   * @param minutes The number of minutes to convert to a row number
   * @returns The CSS grid row number
   */
  private static convertMinutesToRowNumber(minutes: number): number {
    // CSS grid rows start at 1, so add 1
    return Math.round(minutes / 2) + 1;
  }
}
