import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { ItemEditDialogComponent } from '../components/item-edit-dialog/item-edit-dialog.component';
import { ItemViewDialogComponent } from '../components/item-view-dialog/item-view-dialog.component';
import { Group } from '../domain/group';
import { Item, TimePeriod } from '../domain/item';
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
  private _onUserDataLoaded = new ReplaySubject<void>();
  private _onItemDeleted = new ReplaySubject<Item>();
  private _onItemEdited = new ReplaySubject<Item>();

  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded;
  }

  get onItemDeleted(): Observable<Item> {
    return this._onItemDeleted;
  }
  
  get onItemEdited(): Observable<Item> {
    return this._onItemEdited;
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
        result.date.setHours(0, 0, 0, 0);

        if (result.startTimeEnabled && !result.endTimeEnabled) {
          result.endTime.minutes = result.startTime.minutes;

          if (
            result.startTime.hours === 11 &&
            result.startTime.period === TimePeriod.AM
          ) {
            result.endTime.hours = 12;
            result.endTime.period = TimePeriod.PM;
          } else if (
            result.startTime.hours === 11 &&
            result.startTime.period === TimePeriod.PM
          ) {
            result.endTime.hours = 11;
            result.endTime.minutes = 59;
            result.endTime.period = TimePeriod.PM;
          } else {
            result.endTime.hours = result.startTime.hours + 1;
            result.endTime.period = result.startTime.period;
          }
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
