import { UserDataAction } from '../services/user-data.service';
import { Group } from './group';
import { HistoryEntry } from './history-entry';
import { Item } from './item';

describe('HistoryEntry', () => {
  let groups: Array<Group>;
  let items: Array<Item>;

  let historyEntry: HistoryEntry;

  beforeEach(() => {
    groups = [new Group()];
    items = [new Item()];

    historyEntry = new HistoryEntry(
      UserDataAction.EDIT_ITEM,
      groups,
      items
    );
  })
  it('should create instance', () => {
    expect(historyEntry).toBeTruthy();
  });

  it('should have correct items', () => {
    expect(historyEntry.items).toEqual(items);
  });

  it('should have correct groups', () => {
    expect(historyEntry.groups).toEqual(groups);
  })
});
