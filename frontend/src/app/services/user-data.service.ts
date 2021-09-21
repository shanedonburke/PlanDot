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

/**
 * Represents the items received as objects from the backend.
 * The only difference is that the date is stringified.
 */
export interface ItemDto extends Omit<ItemJson, 'date'> {
  date: string;
}

/**
 * Represents the user data received from the backend.
 */
export interface UserDataJson {
  groups: Array<GroupJson>;
  items: Array<ItemDto>;
}

/**
 * All possible actions on user data that can be undone/redone.
 * The value of each entry in this enum is the text to be shown in the
 * undo/redo snack bar.
 */
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

/**
 * Represents the options the user can choose from when deciding what
 * happens to items in a deleted group.
 */
export enum GroupDeletionItemAction {
  DELETE_SINGLE_GROUP_ITEMS = 'Delete items with no other groups',
  DELETE_ALL_ITEMS = 'Delete all items',
  KEEP_ALL_ITEMS = 'Keep all items or move to new group',
}

/**
 * Type guard that determines whether a value is a {@link UserDataJson} object.
 * @param val Tje value to check
 * @returns True if the value is a {@link UserDataJson} object, false otherwise
 */
function isUserDataJson(val: any): val is UserDataJson {
  return val && typeof val === 'object' && 'groups' in val;
}

/**
 * A service that handles loading and saving user data as well as
 * various operations upon it.
 */
@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  /** Emits when user data changes in any way , including when it is loaded. */
  get onUserDataChanged(): Observable<void> {
    return this._onUserDataChanged.asObservable();
  }

  /** Emits when data has been loaded from the backend, even if there is none */
  get onUserDataLoaded(): Observable<void> {
    return this._onUserDataLoaded.asObservable();
  }

  /** Emits when user data changes in any way , including when it is loaded. */
  private _onUserDataChanged = new Subject<void>();

  /** Emits when data has been loaded from the backend, even if there is none */
  private _onUserDataLoaded = new ReplaySubject<void>();

  /** All recorded history states for this session */
  private history: Array<HistoryEntry> = [];

  /** The index in {@link history} of the current state */
  private historyIndex: number = 0;

  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  /**
   * Saves user data (items and groups) to the backend. Also records the
   * action that caused the save and the current state of the user data if
   * {@link pushToHistory} is true.
   * @param action The action to be recorded in the history, if any
   * @param pushToHistory If true, the action will be recorded in the history
   */
  saveUserData(action: UserDataAction, pushToHistory: boolean = true): void {
    const groups = this.groupService.getGroups();
    const items = this.itemService.getItems();
    this.validateGroups(groups);
    this.validateItems(items);

    if (pushToHistory) {
      // Remove all history states after the new one, preventing redo
      this.historyIndex++;
      this.history.splice(this.historyIndex);
      this.history.push(new HistoryEntry(action, groups, items));
    }
    this._onUserDataChanged.next();

    this.httpClient
      .post('/api/user_data', { items, groups }, { responseType: 'text' })
      .subscribe();
  }

  /**
   * Attempt to load user data from the backend. A JWT token is required.
   */
  loadUserData(): void {
    this.httpClient
      .get<UserDataJson>('/api/user_data', { withCredentials: true })
      .subscribe((userData) => {
        // If there is no user data, `userData` may be `{}`
        if (isUserDataJson(userData)) {
          this.groupService.loadGroups(
            userData.groups.map((group) => new Group(group))
          );
          this.itemService.loadItems(
            userData.items.map((dto) => {
              return new Item({ ...dto, date: new Date(dto.date) });
            })
          );
          // Create initial entry to allow undo after first action
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
          // Still create initial entry to allow undo after first action
          this.history.push(new HistoryEntry(UserDataAction.NONE));
        }
      });
  }

  /**
   * Deletes a group. The fate of items in the group are determined by
   * {@link itemAction}.
   * @param group The group to delete
   * @param itemAction What happens to items in the group
   * @param replacementGroup If the items are kept, the group to move them to.
   *   Passing `null` removes the group form all items without a replacement.
   */
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

  /**
   * Deletes an item, removing it from all groups it is in.
   * @param item The item to delete
   */
  deleteItem(item: Item): void {
    this.itemService.deleteItem(item);
    this.groupService.removeItemFromGroups(item);
    this.saveUserData(UserDataAction.DELETE_ITEM);
  }

  /**
   * Sorts all items by date (earliest first).
   */
  sortItemsByDate(): void {
    this.itemService.sortItemsByDate();
    this.saveUserData(UserDataAction.SORT_ITEMS);
  }

  /**
   * Sorts all items by title (alphabetically).
   */
  sortItemsByTitle(): void {
    this.itemService.sortItemsByTitle();
    this.saveUserData(UserDataAction.SORT_ITEMS);
  }

  /**
   * Sorts all items such that favorited items are first.
   * Relative ordering is preserved.
   */
  sortItemsByFavorited(): void {
    this.itemService.sortItemsByFavorited();
    this.saveUserData(UserDataAction.SORT_ITEMS);
  }

  /**
   * Opens the item edit dialog for the given item, then displays the item
   * view dialog when it is saved.
   * @param item The item to edit
   * @param showItemOnCancel If true, the item view dialog will still appear
   *     when _Cancel_ is clicked.
   */
  editItem(item: Item, showItemOnCancel: boolean = false): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      // Use copy so cancelled changes to the item don't affect the item
      data: { item: item.getCopy() },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        // Clean-up to make other things work
        result.weekdays.sort();
        result.date.setHours(0, 0, 0, 0);

        if (
          result.isStartTimeEnabled &&
          (!result.isEndTimeEnabled ||
            result.getStartTimeInMinutes() >= result.getEndTimeInMinutes())
        ) {
          // Prevent end time from being before start time
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

  /**
   * @returns True if the user can undo an action.
   */
  canUndo(): boolean {
    return this.history[this.historyIndex - 1] !== undefined;
  }

  /**
   * @returns True if the user can redo an action.
   */
  canRedo(): boolean {
    return this.history[this.historyIndex + 1] !== undefined;
  }

  /**
   * Undo the last action
   */
  undo(): void {
    if (this.history[this.historyIndex - 1] !== undefined) {
      const snackBarData: HistorySnackBarData = {
        event: 'Undid',
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

  /**
   * Redo the next action if we aren't at the end of the history.
   */
  redo(): void {
    if (this.history[this.historyIndex + 1] !== undefined) {
      this.historyIndex++;
      this.loadHistoryEntry(this.history[this.historyIndex]);
      this.saveUserData(UserDataAction.NONE, false);

      const snackBarData: HistorySnackBarData = {
        event: 'Redid',
        actionDescription: this.getLastAction(),
      };
      this.snackBar.openFromComponent(HistorySnackBarComponent, {
        duration: 2000,
        data: snackBarData,
      });
    }
  }

  /**
   * Reorders items when the user drags item cards while in the item list view.
   * @param event The drag/drop event
   */
  handleItemListDragDrop(event: CdkDragDrop<Array<Item>>): void {
    this.itemService.handleItemListDragDrop(event);
    this.saveUserData(UserDataAction.REORDER_ITEMS);
  }

  /**
   * @returns The last action in the history relative to the current position
   */
  getLastAction(): UserDataAction {
    return this.history[this.historyIndex]?.action ?? UserDataAction.NONE;
  }

  /**
   * @returns The next action in the history relative to the current position
   */
  getNextAction(): UserDataAction {
    return this.history[this.historyIndex + 1]?.action ?? UserDataAction.NONE;
  }

  /**
   * Ensures that no groups reference item IDs that don't exist.
   * @param groups The groups to validate
   */
  private validateGroups(groups: ReadonlyArray<Group>): void {
    groups.forEach((group) => {
      group.itemIds.forEach((itemId, i) => {
        if (!this.itemService.hasItem(itemId)) {
          group.itemIds.splice(i, 1);
        }
      });
    });
  }

  /**
   * Ensures that no items reference group IDs that don't exist.
   * @param items The items to validate
   */
  private validateItems(items: ReadonlyArray<ItemJson>): void {
    items.forEach((item) => {
      item.groupIds.forEach((groupId, i) => {
        if (!this.groupService.hasGroup(groupId)) {
          item.groupIds.splice(i, 1);
        }
      });
    });
  }

  /**
   * Loads the given history entry into the application state.
   * @param historyEntry The history entry to load
   */
  private loadHistoryEntry(historyEntry: HistoryEntry): void {
    this.groupService.loadGroups(historyEntry.groups);
    this.itemService.loadItems(historyEntry.items);
  }
}
