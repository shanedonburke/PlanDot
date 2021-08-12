import { Component, OnInit } from '@angular/core';
import { getDisplayTime, getItemTimeInMinutes, getMilitaryHour, Item, ItemTime } from 'src/app/domain/item';
import { DisplayService } from 'src/app/services/display.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';

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

  constructor(
    public readonly itemService: ItemService,
    public readonly displayService: DisplayService,
    private readonly userDataService: UserDataService,
  ) {}

  ngOnInit() {
    this.calcColumns();
    this.userDataService.onUserDataLoaded.subscribe(() => this.calcColumns());
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

  private calcColumns(): void {
    this.numColumns = this.calcNumColumns();
    this.columns = [];
    for (let i = 0; i < this.numColumns; i++) {
      this.columns.push([]);
    }
    for (const item of this.itemService.getDateItems(this.displayService.date)) {
      for (const col of this.columns) {
        if (
          col.length === 0 ||
          col[col.length - 1].rowEnd <=
            getItemTimeInMinutes(item.startTime)
        ) {
          col.push({
            item,
            rowStart: getItemTimeInMinutes(item.startTime),
            rowEnd: getItemTimeInMinutes(item.endTime),
          });
          break;
        }
      }
    }
  }

  private calcNumColumns(): number {
    const items = this.itemService.getDateItems(this.displayService.date);
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
}
