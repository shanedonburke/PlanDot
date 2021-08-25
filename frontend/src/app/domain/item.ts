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

  hasDate(date: Date): boolean {
    if (!this.dateEnabled) {
      return false;
    }
    return (
      (this.repeat !== Repeat.DAILY_WEEKLY &&
        this.date.getFullYear() === date.getFullYear() &&
        this.date.getMonth() === date.getMonth() &&
        this.date.getDate() === date.getDate()) ||
      (this.date.getMonth() === date.getMonth() &&
        this.date.getDate() === date.getDate() &&
        this.repeat === Repeat.YEARLY) ||
      (this.date.getDate() === date.getDate() &&
        this.repeat === Repeat.MONTHLY) ||
      ((date.getTime() - this.date.getTime()) % 12096e5 === 0 &&
        this.repeat === Repeat.BI_WEEKLY) ||
      (this.weekdays.includes(date.getDay()) &&
        this.repeat === Repeat.DAILY_WEEKLY)
    );
  }

  setEndTimeToDefault() {
    this.endTime.minutes = this.startTime.minutes;
    if (this.startTime.hours === 11 && this.startTime.period === TimePeriod.AM) {
      this.endTime.hours = 12;
      this.endTime.period = TimePeriod.PM;
    } else if (
      this.startTime.hours === 11 &&
      this.startTime.period === TimePeriod.PM
    ) {
      this.endTime.hours = 11;
      this.endTime.minutes = 59;
      this.endTime.period = TimePeriod.PM;
    } else {
      this.endTime.hours = this.startTime.hours + 1;
      this.endTime.period = this.startTime.period;
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
