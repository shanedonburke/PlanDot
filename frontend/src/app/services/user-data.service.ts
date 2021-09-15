import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import {
  HistorySnackBarComponent,
  HistorySnackBarData,
} from '../components/widgets/history-snack-bar/history-snack-bar.component';
import { ItemEditDialogComponent } from '../components/dialogs/item-edit-dialog/item-edit-dialog.component';
import { ItemViewDialogComponent } from '../components/dialogs/item-view-dialog/item-view-dialog.component';
import { Group, GroupJson } from '../domain/group';
import { HistoryEntry } from '../domain/history-entry';
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
  EDIT_GROUP = 'Edit group',
  REORDER_GROUP_ITEMS = 'Reorder group items',
  SORT_GROUP_ITEMS = 'Sort group items',
  DELETE_GROUP = 'Delete group',
  EDIT_ITEM = 'Edit item',
  REORDER_ITEMS = 'Reorder items',
  SORT_ITEMS = 'Sort items',
  DELETE_ITEM = 'Delete item',
  FAVORITE_ITEM = 'Favorite item',
  NONE = '',
}

export enum GroupDeletionItemAction {
  DELETE_SINGLE_GROUP_ITEMS = 'Delete items with no other groups',
  DELETE_ALL_ITEMS = 'Delete all items',
  KEEP_ALL_ITEMS = 'Keep all items or move to new group',
}

function isUserDataJson(obj: any): obj is UserDataJson {
  return obj && typeof obj === 'object' && 'groups' in obj;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  get onUserDataChanged(): Observable<void> {
    return this._onUserDataChanged.asObservable();
  }

  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded.asObservable();
  }

  private _onUserDataChanged = new Subject<void>();
  private _onUserDataLoaded = new ReplaySubject<void>();

  private history: Array<HistoryEntry> = [];
  private historyIndex: number = 0;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  saveUserData(action: UserDataAction, pushToHistory: boolean = true): void {
    const groups = this.groupService.getGroups();
    const items = this.itemService.getItems();
    this.validateGroups(groups);
    this.validateItems(items);

    if (pushToHistory) {
      this.historyIndex++;
      this.history.splice(this.historyIndex);
      this.history.push(new HistoryEntry(action, groups, items));
    }
    this._onUserDataChanged.next();

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
          this.history.push(
            new HistoryEntry(
              UserDataAction.NONE,
              this.groupService.getGroups(),
              this.itemService.getItems()
            )
          );
          this._onUserDataChanged.next();
          this._onUserDataLoaded.next();
        } else {
          this.history.push(new HistoryEntry(UserDataAction.NONE));
        }
      });
  }

  deleteGroup(
    group: Group,
    itemAction: GroupDeletionItemAction = GroupDeletionItemAction.KEEP_ALL_ITEMS,
    replacementGroup: Group | null = null
  ): void {    
    switch (itemAction) {
      case GroupDeletionItemAction.DELETE_SINGLE_GROUP_ITEMS:
        this.itemService.deleteItemsWithSingleGroup(group);
        break;
      case GroupDeletionItemAction.DELETE_ALL_ITEMS:
        this.itemService.deleteItemsByGroup(group);
        break;
      case GroupDeletionItemAction.KEEP_ALL_ITEMS:
        this.itemService.removeGroupFromItems(group, replacementGroup);
        if (replacementGroup !== null) {
          replacementGroup.itemIds.push(...group.itemIds);
        }
        break;
    }
    this.groupService.deleteGroup(group);
    this.saveUserData(UserDataAction.DELETE_GROUP);
  }

  deleteItem(item: Item): void {
    this.itemService.deleteItem(item);
    this.groupService.removeItemFromGroups(item);
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

  sortItemsByFavorited(): void {
    this.itemService.sortItemsByFavorited();
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
          result.isStartTimeEnabled &&
          (!result.isEndTimeEnabled ||
            result.getStartTimeInMinutes() >= result.getEndTimeInMinutes())
        ) {
          result.setEndTimeToDefault();
        }
        this.itemService.updateOrCreateItem(result);
        this.saveUserData(UserDataAction.EDIT_ITEM);

        this.dialog.open(ItemViewDialogComponent, {
          data: { item: result },
        });
      } else if (showItemOnCancel) {
        this.dialog.open(ItemViewDialogComponent, {
          data: { item },
          autoFocus: false,
        });
      }
    });
  }

  canUndo(): boolean {
    return this.history[this.historyIndex - 1] !== undefined;
  }

  canRedo(): boolean {
    return this.history[this.historyIndex + 1] !== undefined;
  }

  undo(): void {
    if (this.history[this.historyIndex - 1] !== undefined) {
      const snackBarData: HistorySnackBarData = {
        event: HistorySnackBarComponent.UNDO_EVENT,
        actionDescription: this.getLastAction(),
      };
      this.snackBar.openFromComponent(HistorySnackBarComponent, {
        duration: 2000,
        data: snackBarData,
      });

      this.historyIndex--;
      this.loadHistoryEntry(this.history[this.historyIndex]);
      this.saveUserData(UserDataAction.NONE, false);
    }
  }

  redo(): void {
    if (this.history[this.historyIndex + 1] !== undefined) {
      this.historyIndex++;
      this.loadHistoryEntry(this.history[this.historyIndex]);
      this.saveUserData(UserDataAction.NONE, false);

      const snackBarData: HistorySnackBarData = {
        event: HistorySnackBarComponent.REDO_EVENT,
        actionDescription: this.getLastAction(),
      };
      this.snackBar.openFromComponent(HistorySnackBarComponent, {
        duration: 2000,
        data: snackBarData,
      });
    }
  }

  handleItemListDragDrop(event: CdkDragDrop<Array<Item>>): void {
    this.itemService.handleItemListDragDrop(event);
    this.saveUserData(UserDataAction.REORDER_ITEMS);
  }

  getLastAction(): UserDataAction {
    return this.history[this.historyIndex]?.action ?? UserDataAction.NONE;
  }

  getNextAction(): UserDataAction {
    return this.history[this.historyIndex + 1]?.action ?? UserDataAction.NONE;
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

  private loadHistoryEntry(historyEntry: HistoryEntry): void {
    this.groupService.loadGroups(historyEntry.groups as Group[]);
    this.itemService.loadItems(historyEntry.items as Item[]);
  }
}
