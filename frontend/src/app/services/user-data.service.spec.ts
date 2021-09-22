import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EMPTY, of } from 'rxjs';
import { Group } from '../domain/group';
import { Item, Repeat, TimePeriod } from '../domain/item';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

import {
  GroupDeletionItemAction,
  UserDataAction,
  UserDataService,
} from './user-data.service';

fdescribe('UserDataService', () => {
  let service: UserDataService;

  let items: Array<Item>;
  let groups: Array<Group>;

  let httpClient: jasmine.SpyObj<HttpClient>;
  let groupService: jasmine.SpyObj<GroupService>;
  let itemService: jasmine.SpyObj<ItemService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(() => {
    setup();

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClient },
        { provide: GroupService, useValue: groupService },
        { provide: ItemService, useValue: itemService },
        { provide: MatDialog, useValue: dialog },
        { provide: MatSnackBar, useValue: snackBar },
      ],
    });
    service = TestBed.inject(UserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when no user data exists', () => {
    beforeEach(() => {
      httpClient.get.and.returnValue(of({}));
    });

    it('should not load items and groups', () => {
      expect(groupService.loadGroups)
        .withContext('should not load grouos')
        .not.toHaveBeenCalled();
      expect(itemService.loadItems)
        .withContext('should not load items')
        .not.toHaveBeenCalled();
    });
  });

  describe('when user data is loaded', () => {
    beforeEach(() => {
      service.loadUserData();
    });

    it('should load items and groups', () => {
      expect(groupService.loadGroups)
        .withContext('should load grouos')
        .toHaveBeenCalledOnceWith(groups);
      expect(itemService.loadItems)
        .withContext('should load items')
        .toHaveBeenCalledOnceWith(items);
    });

    it('should save user data', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      expectPostUserData();
    });

    it('should delete group and items with single group', () => {
      const group = groups[0];

      service.deleteGroup(
        group,
        GroupDeletionItemAction.DELETE_SINGLE_GROUP_ITEMS
      );
      expect(itemService.deleteItemsWithSingleGroup)
        .withContext('should delete items with single group')
        .toHaveBeenCalledOnceWith(group);
      expect(groupService.deleteGroup)
        .withContext('should delete group')
        .toHaveBeenCalledOnceWith(group);
    });

    it('should delete group and all items', () => {
      const group = groups[0];

      service.deleteGroup(group, GroupDeletionItemAction.DELETE_ALL_ITEMS);
      expect(itemService.deleteItemsByGroup)
        .withContext('should delete all items')
        .toHaveBeenCalledOnceWith(group);
      expect(groupService.deleteGroup)
        .withContext('should delete group')
        .toHaveBeenCalledOnceWith(group);
    });

    it('should delete group and keep all items', () => {
      const group = groups[0];

      service.deleteGroup(group, GroupDeletionItemAction.KEEP_ALL_ITEMS);

      expect(itemService.removeGroupFromItems)
        .withContext('should keep all items')
        .toHaveBeenCalledOnceWith(group, null);
      expect(groupService.deleteGroup)
        .withContext('should delete group')
        .toHaveBeenCalledOnceWith(group);
    });

    it('should delete group and move all items', () => {
      const group = groups[0];
      const replacementGroup = new Group();

      service.deleteGroup(
        group,
        GroupDeletionItemAction.KEEP_ALL_ITEMS,
        replacementGroup
      );

      expect(itemService.removeGroupFromItems)
        .withContext('should keep all items')
        .toHaveBeenCalledOnceWith(group, replacementGroup);
      expect(groupService.deleteGroup)
        .withContext('should delete group')
        .toHaveBeenCalledOnceWith(group);
      expect(replacementGroup.itemIds)
        .withContext('should add item IDs to replacement group')
        .toEqual([items[0].id, items[1].id]);
    });

    it('should delete item', () => {
      const item = items[0];
      service.deleteItem(item);

      expect(itemService.deleteItem)
        .withContext('should delete item')
        .toHaveBeenCalledOnceWith(item);
      expect(groupService.removeItemFromGroups)
        .withContext('should remove item from groups')
        .toHaveBeenCalledOnceWith(item);
      expectPostUserData();
    });

    it('should sort items by date', () => {
      service.sortItemsByDate();

      expect(itemService.sortItemsByDate)
        .withContext('should sort items by date')
        .toHaveBeenCalledOnceWith();
      expectPostUserData();
    });

    it('should sort items by title', () => {
      service.sortItemsByTitle();

      expect(itemService.sortItemsByTitle)
        .withContext('should sort items by title')
        .toHaveBeenCalledOnceWith();
      expectPostUserData();
    });

    it('should sort items by favorited', () => {
      service.sortItemsByFavorited();

      expect(itemService.sortItemsByFavorited)
        .withContext('should sort items by favorited')
        .toHaveBeenCalledOnceWith();
      expectPostUserData();
    });

    it('should edit item', fakeAsync(() => {
      const brokenItem = new Item({
        isDateEnabled: true,
        date: new Date(2020, 0, 1),
        isStartTimeEnabled: true,
        startTime: { hours: 2, minutes: 0, period: TimePeriod.PM },
        isEndTimeEnabled: true,
        endTime: { hours: 1, minutes: 0, period: TimePeriod.PM },
        repeat: Repeat.DAILY_WEEKLY,
        weekdays: [3, 2, 1],
      });
      dialogRef.afterClosed.and.returnValue(of(brokenItem));

      service.editItem(brokenItem);
      tick();

      expect(dialog.open)
        .withContext('should open both dialogs')
        .toHaveBeenCalledTimes(2);
      expect(brokenItem.weekdays)
        .withContext('should sort weekdays')
        .toEqual([1, 2, 3]);
      expect(brokenItem.endTime)
        .withContext('should set end time to default')
        .toEqual({ hours: 3, minutes: 0, period: TimePeriod.PM });
      expect(itemService.updateOrCreateItem)
        .withContext('should update item')
        .toHaveBeenCalledWith(brokenItem);
      expectPostUserData();
    }));

    it('should not be able to undo', () => {
      expect(service.canUndo()).toBeFalse();
    });

    it('should be able to undo', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      expect(service.canUndo()).toBeTrue();
    });

    it('should not be able to redo', () => {
      expect(service.canRedo()).toBeFalse();
    });

    it('should not be able to redo after saving user data', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      service.undo();
      service.saveUserData(UserDataAction.EDIT_ITEM);
      expect(service.canRedo()).toBeFalse();
    });

    it('should be able to redo', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      service.undo();
      expect(service.canRedo()).toBeTrue();
    });

    it('should undo', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      httpClient.post.calls.reset();

      service.undo();

      expect(snackBar.openFromComponent)
        .withContext('should open snack bar')
        .toHaveBeenCalled();
      expectPostUserData();
    });

    it('should redo', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      service.undo();
      snackBar.openFromComponent.calls.reset();
      httpClient.post.calls.reset();

      service.redo();

      expect(snackBar.openFromComponent)
        .withContext('should open snack bar')
        .toHaveBeenCalled();
      expectPostUserData();
    });

    it('should handle item list drag/drop', () => {
      const event = {
        previousIndex: 0,
        currentIndex: 1,
      } as CdkDragDrop<Array<Item>>;
      service.handleItemListDragDrop(event);

      expect(itemService.handleItemListDragDrop)
        .withContext('should handle drag/drop')
        .toHaveBeenCalledOnceWith(event);
      expectPostUserData();
    });

    it('should get last action', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      expect(service.getLastAction()).toEqual(UserDataAction.EDIT_ITEM);
    });

    it('should get next action', () => {
      service.saveUserData(UserDataAction.EDIT_ITEM);
      service.undo();
      expect(service.getNextAction()).toEqual(UserDataAction.EDIT_ITEM);
    });
  });

  function setup(): void {
    items = [new Item(), new Item()];
    groups = [new Group({ itemIds: [items[0].id, items[1].id] })];
    items[0].groupIds = [groups[0].id];
    items[1].groupIds = [groups[0].id];

    httpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    groupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'hasGroup',
      'loadGroups',
      'deleteGroup',
      'removeItemFromGroups',
    ]);
    itemService = jasmine.createSpyObj('ItemService', [
      'loadItems',
      'getItems',
      'deleteItemsWithSingleGroup',
      'deleteItemsByGroup',
      'removeGroupFromItems',
      'deleteItem',
      'sortItemsByDate',
      'sortItemsByTitle',
      'sortItemsByFavorited',
      'updateOrCreateItem',
      'handleItemListDragDrop',
      'hasItem',
    ]);
    dialog = jasmine.createSpyObj('MatDialog', ['open']);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    groupService.getGroups.and.returnValue(groups);
    itemService.getItems.and.returnValue(items);
    groupService.hasGroup.and.returnValue(true);
    itemService.hasItem.and.returnValue(true);
    httpClient.post.and.returnValue(EMPTY);
    httpClient.get.and.returnValue(of({ items, groups }));
    dialog.open.and.returnValue(dialogRef);
  }

  function expectPostUserData(): void {
    expect(httpClient.post)
      .withContext('should POST user data')
      .toHaveBeenCalledOnceWith(
        '/api/user_data',
        { items, groups },
        jasmine.anything()
      );
  }
});
