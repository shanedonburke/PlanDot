import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  getDisplayTime,
  getItemTimeInMinutes,
  getMilitaryHour,
  Item,
  ItemTime,
} from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ItemViewDialogComponent } from '../../item-view-dialog/item-view-dialog.component';

interface ItemData {
  item: Item;
  rowStart: number;
  rowEnd: number;
}

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.scss'],
})
export class DayViewComponent implements OnInit {
  hours = [...Array(24).keys()];
  numColumns = 1;
  columns: Array<Array<ItemData>> = [];
  timelessItems: Array<Item> = [];

  constructor(
    public readonly itemService: ItemService,
    public readonly displayService: DateService,
    private readonly userDataService: UserDataService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.update();
    this.userDataService.onUserDataLoaded.subscribe(() => this.update());
    this.userDataService.onItemDeleted.subscribe(() => this.update());
    this.userDataService.onItemEdited.subscribe(() => this.update());
    this.displayService.onDateChanged.subscribe(() => this.update());
  }

  getHourString(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    let clockHour = hour >= 12 ? hour - 12 : hour;
    if (clockHour === 0) {
      clockHour = 12;
    }
    return `${clockHour} ${period}`;
  }

  getDisplayTime(item: Item): string {
    return getDisplayTime(item);
  }

  expandItem(item: Item): void {
    this.dialog.open(ItemViewDialogComponent, {
      data: { item },
    });
  }

  private update(): void {
    this.numColumns = this.calcNumColumns();
    this.columns = [];
    this.timelessItems = [];
    for (let i = 0; i < this.numColumns; i++) {
      this.columns.push([]);
    }
    for (const item of this.itemService.getItemsByDate(this.displayService.date)) {
      if (!item.startTimeEnabled) {
        this.timelessItems.push(item);
      } else {
        this.placeItemInColumn(item);
      }
    }
  }

  private calcNumColumns(): number {
    const items = this.itemService.getItemsByDate(this.displayService.date);
    let maxInSameRow = 0;
    for (let i = 0; i < 1440 / 2; i++) {
      const inSameRow = items.filter((item) => {
        return (
          item.startTimeEnabled &&
          getItemTimeInMinutes(item.startTime) <= i &&
          getItemTimeInMinutes(item.endTime) > i
        );
      }).length;
      maxInSameRow = Math.max(maxInSameRow, inSameRow);
    }
    return maxInSameRow;
  }

  private placeItemInColumn(item: Item): void {
    for (const col of this.columns) {
      const startTimeInMin = getItemTimeInMinutes(item.startTime);
      if (col.length === 0 || col[col.length - 1].rowEnd <= startTimeInMin) {
        col.push({
          item,
          rowStart: startTimeInMin,
          rowEnd: getItemTimeInMinutes(item.endTime),
        });
        break;
      }
    }
  }
}
