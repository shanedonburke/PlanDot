import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { ItemEditDialogComponent } from '../components/item-edit-dialog/item-edit-dialog.component';
import { ItemViewDialogComponent } from '../components/item-view-dialog/item-view-dialog.component';
import { Group } from '../domain/group';
import { compareItemTimes, Item, setDefaultEndTime, TimePeriod } from '../domain/item';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

export interface ItemDto extends Omit<Item, 'date'> {
  date: string;
}

export interface UserData {
  groups: Array<Group>;
  items: Array<ItemDto>;
}

function isUserData(obj: any): obj is UserData {
  return obj && typeof obj === 'object' && 'groups' in obj;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private _onUserDataLoaded = new Subject<void>();
  private _onItemDeleted = new Subject<Item>();
  private _onItemEdited = new Subject<Item>();

  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded.asObservable();
  }

  get onItemDeleted(): Observable<Item> {
    return this._onItemDeleted.asObservable();
  }

  get onItemEdited(): Observable<Item> {
    return this._onItemEdited.asObservable();
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
    private readonly dialog: MatDialog
  ) {}

  saveUserData(): void {
    const groups = this.groupService.getGroups();
    const items = this.itemService.getItems();
    this.validateGroups(groups);
    this.validateItems(items);

    this.httpClient
      .post('/api/user_data', { items, groups }, { responseType: 'text' })
      .subscribe();
  }

  loadUserData(): void {
    this.httpClient
      .get<UserData>('/api/user_data', { withCredentials: true })
      .subscribe((userData) => {
        if (isUserData(userData)) {
          this.groupService.loadGroups(userData.groups);
          this.itemService.loadItems(
            userData.items.map((dto) => {
              return { ...dto, date: new Date(dto.date) };
            })
          );
          this._onUserDataLoaded.next();
        }
      });
  }

  deleteGroup(group: Group): void {
    this.groupService.deleteGroup(group);
    this.itemService.removeGroupFromItems(group);
    this.saveUserData();
  }

  deleteItem(item: Item): void {
    this.itemService.deleteItem(item);
    this.groupService.removeItemFromGroups(item);
    this._onItemDeleted.next();
    this.saveUserData();
  }

  editItem(item: Item, showItemOnCancel: boolean = false): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        result.weekdays.sort();
        result.date.setHours(0, 0, 0, 0);

        if (
          result.startTimeEnabled &&
          (!result.endTimeEnabled ||
            compareItemTimes(result.startTime, result.endTime) >= 0)
        ) {
          setDefaultEndTime(result);
        }
        this.itemService.updateOrCreateItem(result);
        this.saveUserData();
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

  private validateItems(items: ReadonlyArray<Item>): void {
    items.forEach((item) => {
      item.groupIds.forEach((groupId, i) => {
        if (!this.groupService.hasGroup(groupId)) {
          item.groupIds.splice(i, 1);
        }
      });
    });
  }
}
