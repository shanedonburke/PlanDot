import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';
import { Group } from '../domain/group';
import { Item, Repeat } from '../domain/item';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';
import { GroupService } from './group.service';

import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;

  let group: Group;
  let items: Array<Item>;

  let groupService: jasmine.SpyObj<GroupService>;

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({
      providers: [{ provide: GroupService, useValue: groupService }],
    });
    service = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load repeating item with date in the past', () => {
    const today = getTodaysDate();
    const yesterday = new Date(today.getTime() - ONE_DAY_MS);

    const pastItem = new Item({
      isDateEnabled: true,
      date: yesterday,
      repeat: Repeat.DAILY_WEEKLY,
    });

    service.loadItems([pastItem]);

    expect(pastItem.date).toEqual(today);
  });

  describe('when items are loaded', () => {
    beforeEach(() => {
      service.loadItems(items);
    });

    it('should get items', () => {
      expect(service.getItems()).toEqual(items);
    });

    it('should have item', () => {
      expect(service.hasItem(items[0].id)).toBeTrue();
    });

    it('should not have item', () => {
      expect(service.hasItem('invalid')).toBeFalse();
    });

    it('should get item by ID', () => {
      const item = items[0];
      expect(service.getItemById(item.id)).toEqual(item);
    });

    it('should not get item by ID', () => {
      expect(service.getItemById('invalid')).toBeUndefined();
    });

    it('should create new item and add to group', () => {
      const newItem = new Item({ groupIds: [group.id] });
      service.updateOrCreateItem(newItem);
      expect(group.itemIds).toContain(newItem.id);
    });

    it('should update item', () => {
      const item = items[0].getCopy();
      item.title = 'New title';

      service.updateOrCreateItem(item);

      expect(service.getItemById(item.id)!!.title).toEqual(item.title);
    });

    it('should update item and remove from group', () => {
      const item = items[0].getCopy();
      item.groupIds = [];

      service.updateOrCreateItem(item);

      expect(group.itemIds).not.toContain(item.id);
    });

    it('should delete item', () => {
      expect(service.deleteItem(items[0]))
        .withContext('should delete item')
        .toBeTrue();
      expect(service.getItemById(items[0].id))
        .withContext('should no longer find item')
        .toBeUndefined();
    });

    it('should not delete item', () => {
      expect(service.deleteItem(new Item())).toBeFalse();
    });

    it('should delete items by group', () => {
      service.deleteItemsByGroup(group);
      expect(service.getItems()).toEqual(items.slice(2));
    });

    it('should delete items with single group', () => {
      service.deleteItemsWithSingleGroup(group);
      expect(service.getItems()).toEqual(items.slice(1));
    });

    it('should remove group from items', () => {
      service.removeGroupFromItems(group);

      expect(items[0].groupIds)
        .withContext('1st item should not have group')
        .not.toContain(group.id);
      expect(items[1].groupIds)
        .withContext('2nd item should not have group')
        .not.toContain(group.id);
    });

    it('should remove and replace group from items', () => {
      const replacement = new Group();
      service.removeGroupFromItems(group, replacement);

      expect(items[0].groupIds)
        .withContext('1st item should have replaced group')
        .toEqual([replacement.id]);
      expect(items[1].groupIds)
        .withContext('2nd item should have unremoved group and replaced group')
        .toEqual([replacement.id, jasmine.anything()]);
    });

    it('should sort items by date', () => {
      service.sortItemsByDate();
      expect(service.getItems()).toEqual([items[2], items[1], items[0]]);
    });

    it('should sort items by title', () => {
      service.sortItemsByTitle();
      expect(service.getItems()).toEqual([items[2], items[1], items[0]]);
    });

    it('should sort items by favorited', () => {
      service.sortItemsByFavorited();
      expect(service.getItems()).toEqual([items[2], items[0], items[1]]);
    });

    it('should get items by group', () => {
      expect(service.getItemsByGroup(group)).toEqual([items[0], items[1]]);
    });

    it('should get items by date', () => {
      // [1] comes first because the items are sorted by date
      expect(service.getItemsByDate(items[0].date)).toEqual([
        items[1],
        items[0],
      ]);
    });

    it('should get item background color', () => {
      expect(service.getItemBackgroundColor(items[0])).toEqual(group.color);
    });

    it('should get item text color', () => {
      expect(service.getItemTextColor(items[0])).toEqual(group.getTextColor());
    });

    it('should handle drag and drop', () => {
      const event = {
        previousIndex: 2,
        currentIndex: 0
      } as CdkDragDrop<Array<Item>>;
      service.handleItemListDragDrop(event);

      expect(service.getItems()).toEqual([items[2], items[0], items[1]]);
    })
  });

  function setup(): void {
    group = new Group({ color: '#ff0000' });
    items = [
      new Item({
        title: 'Item 3',
        groupIds: [group.id],
        isDateEnabled: true,
        date: new Date(2050, 0, 3),
      }),
      new Item({
        title: 'Item 2',
        groupIds: [group.id, new Group().id],
        isDateEnabled: true,
        date: new Date(2050, 0, 2),
        repeat: Repeat.DAILY_WEEKLY,
      }),
      new Item({
        title: 'Item 1',
        isDateEnabled: true,
        date: new Date(2050, 0, 1),
        isFavorited: true,
      }),
    ];
    group.itemIds = [items[0].id, items[1].id];

    groupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'getGroupById',
    ]);
    groupService.getGroups.and.returnValue([group]);
    groupService.getGroupById.and.returnValue(group);
  }
});
