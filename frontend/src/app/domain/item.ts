import { v4 } from 'uuid';
import { getTodaysDate } from '../util/dates';
import { Group } from './group';

export interface ItemJson {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  dateEnabled: boolean;
  repeat: Repeat;
  weekdays: Array<number>;
  startTime: ItemTime;
  endTime: ItemTime;
  startTimeEnabled: boolean;
  endTimeEnabled: boolean;
  groupIds: Array<string>;
}

export enum Repeat {
  NEVER = 'Never',
  DAILY_WEEKLY = 'Daily/Weekly',
  BI_WEEKLY = 'Bi-weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export enum TimePeriod {
  AM = 'AM',
  PM = 'PM',
}

export interface ItemTime {
  hours: number;
  minutes: number;
  period: TimePeriod;
}

export class Item implements ItemJson {
  id: string = v4();
  title: string = 'New Item';
  description: string = '';
  location: string = '';
  date: Date = getTodaysDate();
  dateEnabled: boolean = false;
  repeat: Repeat = Repeat.NEVER;
  weekdays: Array<number> = [0, 1, 2, 3, 4, 5, 6];
  startTime: ItemTime = { hours: 12, minutes: 0, period: TimePeriod.PM };
  endTime: ItemTime = { hours: 1, minutes: 0, period: TimePeriod.PM };
  startTimeEnabled: boolean = false;
  endTimeEnabled: boolean = false;
  groupIds: Array<string> = [];

  constructor(itemJson: Partial<ItemJson> = {}) {
    Object.assign(this, itemJson);
  }

  getStartTimeInMinutes(): number {
    return Item.getTimeInMinutes(this.startTime);
  }

  getEndTimeInMinutes(): number {
    return Item.getTimeInMinutes(this.endTime);
  }

  getFormattedStartTime(): string {
    return Item.formatItemTime(this.startTime);
  }

  getFormattedEndTime(): string {
    return Item.formatItemTime(this.endTime);
  }

  getDisplayTime(): string {
    return this.endTimeEnabled
      ? `${this.getFormattedStartTime()} - ${this.getFormattedEndTime()}`
      : this.getFormattedStartTime();
  }

  compareDateTo(item: Item): number {
    if (!this.dateEnabled && !item.dateEnabled) {
      return 0;
    } else if (this.dateEnabled && !item.dateEnabled) {
      return -1;
    } else if (item.dateEnabled && !this.dateEnabled) {
      return 1;
    } else {
      const dateDiff = this.date.getTime() - item.date.getTime();
      if (dateDiff === 0) {
        if (!this.startTimeEnabled && !item.startTimeEnabled) {
          return 0;
        } else if (this.startTimeEnabled && !item.startTimeEnabled) {
          return -1;
        } else if (item.startTimeEnabled && !this.startTimeEnabled) {
          return 1;
        } else {
          return this.getStartTimeInMinutes() - item.getStartTimeInMinutes();
        }
      } else {
        return dateDiff;
      }
    }
  }

  private static getTimeInMinutes(time: ItemTime): number {
    return this.getMilitaryHour(time) * 60 + time.minutes;
  }

  private static getMilitaryHour(time: ItemTime): number {
    const hour = time.hours % 12;
    return time.period === TimePeriod.PM ? hour + 12 : hour;
  }

  private static formatItemTime(time: ItemTime): string {
    return `${time.hours}:${time.minutes.toString().padStart(2, '0')} ${
      time.period
    }`;
  }
}

export function doesDateHaveItem(date: Date, item: ItemJson): boolean {
  if (!item.dateEnabled) {
    return false;
  }
  return (
    (item.repeat !== Repeat.DAILY_WEEKLY &&
      item.date.getFullYear() === date.getFullYear() &&
      item.date.getMonth() === date.getMonth() &&
      item.date.getDate() === date.getDate()) ||
    (item.date.getMonth() === date.getMonth() &&
      item.date.getDate() === date.getDate() &&
      item.repeat === Repeat.YEARLY) ||
    (item.date.getDate() === date.getDate() &&
      item.repeat === Repeat.MONTHLY) ||
    ((date.getTime() - item.date.getTime()) % 12096e5 === 0 &&
      item.repeat === Repeat.BI_WEEKLY) ||
    (item.weekdays.includes(date.getDay()) &&
      item.repeat === Repeat.DAILY_WEEKLY)
  );
}

export function setDefaultEndTime(item: ItemJson): void {
  item.endTime.minutes = item.startTime.minutes;
  if (item.startTime.hours === 11 && item.startTime.period === TimePeriod.AM) {
    item.endTime.hours = 12;
    item.endTime.period = TimePeriod.PM;
  } else if (
    item.startTime.hours === 11 &&
    item.startTime.period === TimePeriod.PM
  ) {
    item.endTime.hours = 11;
    item.endTime.minutes = 59;
    item.endTime.period = TimePeriod.PM;
  } else {
    item.endTime.hours = item.startTime.hours + 1;
    item.endTime.period = item.startTime.period;
  }
}
