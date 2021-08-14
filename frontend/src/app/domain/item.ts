import { v4 } from 'uuid';
import { getTodaysDate } from '../util/dates';
import { Group } from './group';

export interface Item {
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

export function createItem(groups: Array<Group> = []): Item {
  return {
    id: v4(),
    title: 'New Item',
    description: '',
    location: '',
    date: getTodaysDate(),
    dateEnabled: false,
    repeat: Repeat.NEVER,
    weekdays: [0, 1, 2, 3, 4, 5, 6],
    startTimeEnabled: false,
    endTimeEnabled: false,
    startTime: {
      hours: 12,
      minutes: 0,
      period: TimePeriod.PM,
    },
    endTime: {
      hours: 1,
      minutes: 0,
      period: TimePeriod.PM,
    },
    groupIds: groups.map((group) => group.id),
  };
}

export function getMilitaryHour(itemTime: ItemTime): number {
  const hour = itemTime.hours % 12;
  return itemTime.period === TimePeriod.PM ? hour + 12 : hour;
}

export function formatItemTime(itemTime: ItemTime): string {
  return `${itemTime.hours}:${itemTime.minutes.toString().padStart(2, '0')} ${
    itemTime.period
  }`;
}

export function getItemTimeInMinutes(itemTime: ItemTime): number {
  return Math.round((getMilitaryHour(itemTime) * 60 + itemTime.minutes) / 2);
}

export function getDisplayTime(item: Item): string {
  if (item.endTimeEnabled) {
    return `${formatItemTime(item.startTime)} - ${formatItemTime(
      item.endTime
    )}`;
  } else {
    return formatItemTime(item.startTime);
  }
}

export function compareItemsByDate(itemA: Item, itemB: Item): number {
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

export function doesDateHaveItem(date: Date, item: Item): boolean {
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

export function setDefaultEndTime(item: Item): void {
  item.endTime.minutes = item.startTime.minutes;
  if (
    item.startTime.hours === 11 &&
    item.startTime.period === TimePeriod.AM
  ) {
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
