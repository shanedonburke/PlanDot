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
  return typeof obj === 'object' && 'groups' in obj;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  private _onUserDataLoaded = new ReplaySubject<void>();

  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded;
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
    private readonly dialog: MatDialog
  ) {}

  saveUserData(): void {
    this.httpClient
      .post(
        '/api/user_data',
        {
          items: this.itemService.getItems(),
          groups: this.groupService.getGroups(),
        },
        { responseType: 'text' }
      )
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
    this.saveUserData();
  }

  editItem(item: Item) {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
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

        this.dialog.open(ItemViewDialogComponent, {
          data: { item: result },
        });
      }
    });
  }
}
