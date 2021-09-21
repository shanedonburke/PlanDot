import { UserDataAction } from '../services/user-data.service';
import { Group } from './group';
import { Item } from './item';

export class HistoryEntry {
  groups: Group[];
  items: Item[];

  constructor(
    public readonly action: UserDataAction,
    groups: ReadonlyArray<Group> = [],
    items: ReadonlyArray<Item> = [],
  ) {
    this.groups = groups.map((group) => group.getCopy());
    this.items = items.map((item) => item.getCopy());
  }
}
