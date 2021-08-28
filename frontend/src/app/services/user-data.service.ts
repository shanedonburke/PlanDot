import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ItemEditDialogComponent } from '../components/item-edit-dialog/item-edit-dialog.component';
import { ItemViewDialogComponent } from '../components/item-view-dialog/item-view-dialog.component';
import { Group, GroupJson } from '../domain/group';
import { Item, ItemJson } from '../domain/item';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

export interface ItemDto extends Omit<ItemJson, 'date'> {
  date: string;
}

export interface UserDataJson {
  groups: Array<GroupJson>;
  items: Array<ItemDto>;
}

export enum UserDataAction {
  EDIT_GROUP,
  REORDER_GROUP_ITEMS,
  SORT_GROUP_ITEMS,
  DELETE_GROUP,
  EDIT_ITEM,
  SORT_ITEMS,
  DELETE_ITEM,
}

interface HistoryEntry {
  items: ReadonlyArray<Item>;
  groups: ReadonlyArray<Group>;
  action: UserDataAction;
}

function isUserDataJson(obj: any): obj is UserDataJson {
  return obj && typeof obj === 'object' && 'groups' in obj;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded.asObservable();
  }

  get onItemDeleted(): Observable<Item> {
    return this._onItemDeleted.asObservable();
  }

  get onItemEdited(): Observable<Item> {
    return this._onItemEdited.asObservable();
  }

  private _onUserDataLoaded = new Subject<void>();
  private _onItemDeleted = new Subject<Item>();
  private _onItemEdited = new Subject<Item>();

  private history: Array<HistoryEntry> = [];

  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
    private readonly dialog: MatDialog
  ) {}

  saveUserData(action: UserDataAction): void {
    const groups = this.groupService.getGroups();
    const items = this.itemService.getItems();
    this.validateGroups(groups);
    this.validateItems(items);

    this.history.push({
      groups,
      items,
      action,
    });

    this.httpClient
      .post('/api/user_data', { items, groups }, { responseType: 'text' })
      .subscribe();
  }

  loadUserData(): void {
    this.httpClient
      .get<UserDataJson>('/api/user_data', { withCredentials: true })
      .subscribe((userData) => {
        if (isUserDataJson(userData)) {
          this.groupService.loadGroups(
            userData.groups.map((group) => new Group(group))
          );
          this.itemService.loadItems(
            userData.items.map((dto) => {
              return new Item({ ...dto, date: new Date(dto.date) });
            })
          );
          this._onUserDataLoaded.next();
        }
      });
  }

  deleteGroup(group: Group): void {
    this.groupService.deleteGroup(group);
    this.itemService.removeGroupFromItems(group);
    this.saveUserData(UserDataAction.DELETE_GROUP);
  }

  deleteItem(item: ItemJson): void {
    this.itemService.deleteItem(item);
    this.groupService.removeItemFromGroups(item);
    this._onItemDeleted.next();
    this.saveUserData(UserDataAction.DELETE_ITEM);
  }

  sortItemsByDate(): void {
    this.itemService.sortItemsByDate();
    this.saveUserData(UserDataAction.SORT_ITEMS);
  }

  sortItemsByTitle(): void {
    this.itemService.sortItemsByTitle();
    this.saveUserData(UserDataAction.SORT_ITEMS);
  }

  editItem(item: Item, showItemOnCancel: boolean = false): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: { item: item.getDeepCopy() },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        result.weekdays.sort();
        result.date.setHours(0, 0, 0, 0);

        if (
          result.startTimeEnabled &&
          (!result.endTimeEnabled ||
            result.getStartTimeInMinutes() >= result.getEndTimeInMinutes())
        ) {
          result.setEndTimeToDefault();
        }
        this.itemService.updateOrCreateItem(result);
        this.saveUserData(UserDataAction.EDIT_ITEM);
        this._onItemEdited.next(result);

        this.dialog.open(ItemViewDialogComponent, {
          data: { item: result },
        });
      } else if (showItemOnCancel) {
        this.dialog.open(ItemViewDialogComponent, {
          data: { item },
        });
      }
    });
  }

  private validateGroups(groups: ReadonlyArray<Group>): void {
    groups.forEach((group) => {
      group.itemIds.forEach((itemId, i) => {
        if (!this.itemService.hasItem(itemId)) {
          group.itemIds.splice(i, 1);
        }
      });
    });
  }

  private validateItems(items: ReadonlyArray<ItemJson>): void {
    items.forEach((item) => {
      item.groupIds.forEach((groupId, i) => {
        if (!this.groupService.hasGroup(groupId)) {
          item.groupIds.splice(i, 1);
        }
      });
    });
  }

  private loadUserDataFromHistory(historyEntry: HistoryEntry): void {}
}
