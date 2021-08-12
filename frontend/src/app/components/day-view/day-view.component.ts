import { Component, OnInit } from '@angular/core';
import { getMilitaryHour, Item, ItemTime } from 'src/app/domain/item';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { getCookie } from 'src/app/util/cookies';

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
    private readonly userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.userDataService.onUserDataLoaded.subscribe(() => this.calcColumns());
  }

  getDate(): Date {
    const dateStr = getCookie('date');
    return dateStr ? new Date(dateStr) : new Date();
  }

  getHourString(hour: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    let clockHour = hour >= 12 ? hour - 12 : hour;
    if (clockHour === 0) {
      clockHour = 12;
    }
    return `${clockHour} ${period}`;
  }

  private calcColumns(): void {
    this.numColumns = this.calcNumColumns();
    this.columns = [];
    for (let i = 0; i < this.numColumns; i++) {
      this.columns.push([]);
    }
    for (const item of this.itemService.getDateItems(this.getDate())) {
      for (const col of this.columns) {
        if (
          col.length === 0 ||
          col[col.length - 1].rowEnd <=
            this.getItemTimeInMinutes(item.startTime)
        ) {
          col.push({
            item,
            rowStart: this.getItemTimeInMinutes(item.startTime),
            rowEnd: this.getItemTimeInMinutes(item.endTime),
          });
          break;
        }
      }
    }
  }

  private calcNumColumns(): number {
    const items = this.itemService.getDateItems(this.getDate());
    let maxInSameRow = 0;
    for (let i = 0; i < 1440 / 2; i++) {
      const inSameRow = items.filter((item) => {
        return (
          item.timeEnabled &&
          this.getItemTimeInMinutes(item.startTime) <= i &&
          this.getItemTimeInMinutes(item.endTime) > i
        );
      }).length;
      maxInSameRow = Math.max(maxInSameRow, inSameRow);
    }
    return maxInSameRow;
  }

  private getItemTimeInMinutes(itemTime: ItemTime): number {
    return Math.round((getMilitaryHour(itemTime) * 60 + itemTime.minutes) / 2);
  }
}
