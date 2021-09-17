import { v4 } from 'uuid';
import { getTodaysDate } from '../util/dates';
import { deepCopy } from '../util/deep-copy';

export interface ItemJson {
  id: string;
  title: string;
  description: string;
  location: string;
  date: Date;
  isDateEnabled: boolean;
  repeat: Repeat;
  weekdays: Array<number>;
  startTime: ItemTime;
  endTime: ItemTime;
  isStartTimeEnabled: boolean;
  isEndTimeEnabled: boolean;
  groupIds: Array<string>;
  isFavorited: boolean;
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
  id = v4();
  title = 'New Item';
  description = '';
  location = '';
  date = getTodaysDate();
  isDateEnabled = false;
  repeat = Repeat.NEVER;
  weekdays = [0, 1, 2, 3, 4, 5, 6];
  startTime: ItemTime = { hours: 12, minutes: 0, period: TimePeriod.PM };
  endTime: ItemTime = { hours: 1, minutes: 0, period: TimePeriod.PM };
  isStartTimeEnabled = false;
  isEndTimeEnabled = false;
  groupIds: Array<string> = [];
  isFavorited = false;

  constructor(itemJson: Partial<ItemJson> = {}) {
    Object.assign(this, itemJson);
  }

  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
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
    return this.isEndTimeEnabled
      ? `${this.getFormattedStartTime()} - ${this.getFormattedEndTime()}`
      : this.getFormattedStartTime();
  }

  compareDateTo(item: Item): number {
    if (!this.isDateEnabled && !item.isDateEnabled) {
      return 0;
    } else if (this.isDateEnabled && !item.isDateEnabled) {
      return -1;
    } else if (item.isDateEnabled && !this.isDateEnabled) {
      return 1;
    } else {
      const dateDiff = this.date.getTime() - item.date.getTime();
      if (dateDiff === 0) {
        if (!this.isStartTimeEnabled && !item.isStartTimeEnabled) {
          return 0;
        } else if (this.isStartTimeEnabled && !item.isStartTimeEnabled) {
          return -1;
        } else if (item.isStartTimeEnabled && !this.isStartTimeEnabled) {
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
    if (!this.isDateEnabled) {
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
    if (
      this.startTime.hours === 11 &&
      this.startTime.period === TimePeriod.AM
    ) {
      this.endTime.hours = 12;
      this.endTime.period = TimePeriod.PM;
    } else if (
      this.startTime.hours === 11 &&
      this.startTime.period === TimePeriod.PM
    ) {
      this.endTime.hours = 11;
      this.endTime.minutes = 59;
      this.endTime.period = TimePeriod.PM;
    } else if (this.startTime.hours === 12) {
      this.endTime.hours = 1;
      this.endTime.period = this.startTime.period;
    } else {
      this.endTime.hours = this.startTime.hours + 1;
      this.endTime.period = this.startTime.period;
    }
  }

  getDeepCopy(): Item {
    return new Item(deepCopy(this));
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
