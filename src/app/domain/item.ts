import { v4 } from 'uuid';
import { Group } from './group';

export interface Item {
  id: string;
  title: string;
  description: string;
  date: Date;
  dateEnabled: boolean;
  repeatEvery: RepeatEvery;
  time: {
    hours: number;
    minutes: number;
    period: TimePeriod;
  };
  timeEnabled: boolean;
  groupIds: Array<string>;
}

export enum RepeatEvery {
  NEVER = 'Never',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BI_WEEKLY = 'Bi-weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export enum TimePeriod {
  AM = 'AM',
  PM = 'PM',
}

export function createItem(groups: Array<Group> = []): Item {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  
  return {
    id: v4(),
    title: 'New Item',
    description: '',
    date,
    dateEnabled: false,
    repeatEvery: RepeatEvery.NEVER,
    timeEnabled: false,
    time: {
      hours: 12,
      minutes: 0,
      period: TimePeriod.PM,
    },
    groupIds: groups.map((group) => group.id),
  };
}
