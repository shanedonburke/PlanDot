import { v4 } from 'uuid';
import { getTodaysDate } from '../util/dates';
import { deepCopy } from '../util/deep-copy';

/**
 * Object representation of an {@link Item};
 */
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

/**
 * Whether and how often an {@link Item} should be recur.
 */
export enum Repeat {
  /** Do not recur */
  NEVER = 'Never',
  /** Occur on some days of the week, every week */
  DAILY_WEEKLY = 'Daily/Weekly',
  /** Occur every two weeks */
  BI_WEEKLY = 'Bi-weekly',
  /** Occur every month */
  MONTHLY = 'Monthly',
  /** Occur once a year */
  YEARLY = 'Yearly',
}

/**
 * Whether an {@link ItemTime} is AM or PM.
 */
export enum TimePeriod {
  AM = 'AM',
  PM = 'PM',
}

/**
 * Representation of an item's start or end time, in 12-hour format.
 */
export interface ItemTime {
  hours: number;
  minutes: number;
  period: TimePeriod;
}

/**
 * An item represents a task, event, or other thing that needs to be tracked.
 */
export class Item implements ItemJson {
  /** UUID */
  id = v4();

  /** Title of the item */
  title = 'New Item';

  /** Optional description in Markdown format */
  description = '';

  /** Optional location */
  location = '';

  /** Whether the item has a date */
  isDateEnabled = false;

  /** Date on which the item (initially) occurs */
  date = getTodaysDate();

  /** How often the item should recur */
  repeat = Repeat.NEVER;

  /**
   * Days of the week on which the item occurs when {@link Repeat.DAILY_WEEKLY}
   * is selected. Each day is represented by its index.
   */
  weekdays = [0, 1, 2, 3, 4, 5, 6];

  /** Whether the item has a start time */
  isStartTimeEnabled = false;

  /** When the item starts */
  startTime: ItemTime = { hours: 12, minutes: 0, period: TimePeriod.PM };

  /** Whether the item has an end time */
  isEndTimeEnabled = false;

  /** When the item ends */
  endTime: ItemTime = { hours: 1, minutes: 0, period: TimePeriod.PM };

  /** IDs of groups to which this item belongs */
  groupIds: Array<string> = [];

  /** Whether the user has marked this item as a favorite */
  isFavorited = false;

  constructor(itemJson: Partial<ItemJson> = {}) {
    Object.assign(this, itemJson);
  }

  /**
   * Favorite or un-favorite the item.
   */
  toggleFavorite(): void {
    this.isFavorited = !this.isFavorited;
  }

  /**
   * @returns The start time as the number of minutes since midnight.
   */
  getStartTimeInMinutes(): number {
    return Item.getTimeInMinutes(this.startTime);
  }

  /**
   * @returns The end time as the number of minutes since midnight.
   */
  getEndTimeInMinutes(): number {
    return Item.getTimeInMinutes(this.endTime);
  }

  /**
   * @returns The start time in the form '[h]h:mm (AM|PM)'
   */
  getFormattedStartTime(): string {
    return Item.formatItemTime(this.startTime);
  }

  /**
   * @returns THe end time in the form '[h]h:mm (AM|PM)'
   */
  getFormattedEndTime(): string {
    return Item.formatItemTime(this.endTime);
  }

  /**
   * Formats the item's times (start and end) into one string.
   * Examples:
   *   - '12:00 PM - 1:00 PM'
   *   - '4:00 AM - 1:00 PM'
   *   - '8:00 PM'
   * @returns The formatted time
   */
  getDisplayTime(): string {
    return this.isEndTimeEnabled
      ? `${this.getFormattedStartTime()} - ${this.getFormattedEndTime()}`
      : this.getFormattedStartTime();
  }

  /**
   * Compares this item to another based on date, start time, and end time.
   * Items with a date are considered less than items without a date.
   * Items with a start time are considered less than items with only a date.
   * Otherwise, the item that occurs first is less than the other.
   * Items with the same date are compared by start time.
   *
   * If the items have the same date, start time, and end time, 0 is returned.
   * If this item is less than the other, -1 is returned.
   * If this item is greater than the other, 1 is returned.
   *
   * @param item The item to compare to
   * @returns -1, 0, or 1 based on the comparison
   */
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
          const timeDiff = this.getStartTimeInMinutes() - item.getStartTimeInMinutes();
          return Math.min(Math.max(timeDiff, -1), 1);
        }
      } else {
        return Math.min(Math.max(dateDiff, -1), 1);
      }
    }
  }

  /**
   * @param date The date on which this item may occur
   * @returns True if the item occurs on the given date through {@link repeat}
   *    or if {@link date} is given.
   */
  hasDate(date: Date): boolean {
    if (!this.isDateEnabled) {
      return false;
    }
    return (
      (this.date.getFullYear() === date.getFullYear() &&
        this.date.getMonth() === date.getMonth() &&
        this.date.getDate() === date.getDate()) ||
      (this.date.getMonth() === date.getMonth() &&
        this.date.getDate() === date.getDate() &&
        this.repeat === Repeat.YEARLY) ||
      (this.date.getDate() === date.getDate() &&
        this.repeat === Repeat.MONTHLY) ||
      // Number of milliseconds in two weeks
      ((date.getTime() - this.date.getTime()) % 12096e5 === 0 &&
        this.repeat === Repeat.BI_WEEKLY) ||
      (this.weekdays.includes(date.getDay()) &&
        this.repeat === Repeat.DAILY_WEEKLY)
    );
  }

  /**
   * Resets the item's end time to its default, which is one hour after
   * the start time. Items cannot span multiple days, so the default end time
   * for any time after 11:00 PM is 11:59 PM.
   */
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

  /**
   * @returns A deep copy of the item
   */
  getCopy(): Item {
    return new Item(deepCopy(this));
  }

  /**
   * @param time The time to convert to minutes
   * @returns The time as the number of minutes since midnight
   */
  private static getTimeInMinutes(time: ItemTime): number {
    return this.getMilitaryHour(time) * 60 + time.minutes;
  }

  /**
   * @param time The time to format
   * @returns The time's hour in military format (0-23)
   */
  private static getMilitaryHour(time: ItemTime): number {
    const hour = time.hours % 12;
    return time.period === TimePeriod.PM ? hour + 12 : hour;
  }

  /**
   * @param time The time to format
   * @returns The time as as tring in the form '[h]h:mm (AM|PM)'
   */
  private static formatItemTime(time: ItemTime): string {
    return `${time.hours}:${time.minutes.toString().padStart(2, '0')} ${
      time.period
    }`;
  }
}
