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

  private static getTimeInMinutes(time: ItemTime): number {
    return Math.round((this.getMilitaryHour(time) * 60 + time.minutes) / 2);
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

export function compareItemsByDate(itemA: ItemJson, itemB: ItemJson): number {
  if (!itemA.dateEnabled && !itemB.dateEnabled) {
    return 0;
  } else if (itemA.dateEnabled && !itemB.dateEnabled) {
    return -1;
  } else if (itemB.dateEnabled && !itemA.dateEnabled) {
    return 1;
  } else {
    const dateDiff = itemA.date.getTime() - itemB.date.getTime();
    if (dateDiff === 0) {
      if (!itemA.startTimeEnabled && !itemB.startTimeEnabled) {
        return 0;
      } else if (itemA.startTimeEnabled && !itemB.startTimeEnabled) {
        return -1;
      } else if (itemB.startTimeEnabled && !itemA.startTimeEnabled) {
        return 1;
      } else {
        return compareItemTimes(itemA.startTime, itemB.startTime);
      }
    } else {
      return dateDiff;
    }
  }
}

export function compareItemTimes(timeA: ItemTime, timeB: ItemTime): number {
  if (timeA.period === TimePeriod.AM && timeB.period === TimePeriod.PM) {
    return -1;
  } else if (timeA.period === TimePeriod.PM && timeB.period === TimePeriod.AM) {
    return 1;
  } else {
    const hoursDiff = (timeA.hours % 12) - (timeB.hours % 12);
    if (hoursDiff === 0) {
      return timeA.minutes - timeB.minutes;
    } else {
      return hoursDiff;
    }
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
