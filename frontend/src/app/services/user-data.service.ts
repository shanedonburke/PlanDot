import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import {
  HistorySnackBarComponent,
  HistorySnackBarData,
} from '../components/history-snack-bar/history-snack-bar.component';
import { ItemEditDialogComponent } from '../components/item-edit-dialog/item-edit-dialog.component';
import { ItemViewDialogComponent } from '../components/item-view-dialog/item-view-dialog.component';
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
  EDIT_GROUP,
  REORDER_GROUP_ITEMS,
  SORT_GROUP_ITEMS,
  DELETE_GROUP,
  EDIT_ITEM,
  REORDER_ITEMS,
  SORT_ITEMS,
  DELETE_ITEM,
  NONE,
}

function isUserDataJson(obj: any): obj is UserDataJson {
  return obj && typeof obj === 'object' && 'groups' in obj;
}

const ACTION_DESCRIPTIONS: { [key in UserDataAction]: string } = {
  [UserDataAction.EDIT_GROUP]: 'Edit group',
  [UserDataAction.REORDER_GROUP_ITEMS]: 'Reorder group items',
  [UserDataAction.SORT_GROUP_ITEMS]: 'Sort group items',
  [UserDataAction.DELETE_GROUP]: 'Delete group',
  [UserDataAction.EDIT_ITEM]: 'Edit item',
  [UserDataAction.REORDER_ITEMS]: 'Reorder items',
  [UserDataAction.SORT_ITEMS]: 'Sort items',
  [UserDataAction.DELETE_ITEM]: 'Delete item',
  [UserDataAction.NONE]: '',
};

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  get onUserDataChanged(): Observable<void> {
    return of(
      this.onUserDataLoaded,
      this.onItemEdited,
      this.onItemDeleted,
      this.onItemListChanged,
      this.onHistoryChanged,
    ).pipe(mergeAll())
  }

  private onUserDataLoaded = new Subject<void>();
  private onItemDeleted = new Subject<void>();
  private onItemEdited = new Subject<void>();
  private onItemListChanged = new Subject<void>();
  private onHistoryChanged = new Subject<void>();

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
          this.onUserDataLoaded.next();
        } else {
          this.history.push(new HistoryEntry(UserDataAction.NONE));
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
    this.onItemDeleted.next();
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
        this.onItemEdited.next();

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
        actionDescription: ACTION_DESCRIPTIONS[this.getLastAction()],
      };
      this.snackBar.openFromComponent(HistorySnackBarComponent, {
        duration: 2000,
        data: snackBarData,
      });

      this.historyIndex--;
      this.loadHistoryEntry(this.history[this.historyIndex]);
      this.saveUserData(UserDataAction.NONE, false);
      this.onHistoryChanged.next();
    }
  }

  redo(): void {
    if (this.history[this.historyIndex + 1] !== undefined) {
      this.historyIndex++;
      this.loadHistoryEntry(this.history[this.historyIndex]);
      this.saveUserData(UserDataAction.NONE, false);

      const snackBarData: HistorySnackBarData = {
        event: HistorySnackBarComponent.REDO_EVENT,
        actionDescription: ACTION_DESCRIPTIONS[this.getLastAction()],
      };
      this.snackBar.openFromComponent(HistorySnackBarComponent, {
        duration: 2000,
        data: snackBarData,
      });
      this.onHistoryChanged.next();
    }
  }

  handleItemListDragDrop(event: CdkDragDrop<Array<Item>>): void {
    this.itemService.handleItemListDragDrop(event);
    this.onItemListChanged.next();
    this.saveUserData(UserDataAction.REORDER_ITEMS);
  }

  private getLastAction(): UserDataAction {
    return this.history[this.historyIndex]?.action;
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
