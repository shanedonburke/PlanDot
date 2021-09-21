import { UserDataAction } from '../services/user-data.service';
import { Group } from './group';
import { Item } from './item';

/**
 * Represents the state of the user data (items and groups) at a given
 * point in time. The type of action that created this state is stored as well.
 */
export class HistoryEntry {
  /** Group state at the time of the entry */
  groups: Group[];

  /** Item state at the time of the entry */
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
