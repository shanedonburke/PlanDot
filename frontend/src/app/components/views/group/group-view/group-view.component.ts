import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import {
  UserDataAction,
  UserDataService,
} from 'src/app/services/user-data.service';

/**
 * Component for the group view. The items in each group are shown.
 * The user may sort or reorder items in a group.
 */
@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent implements OnDestroy {
  /** True when user data loading is done (even if there is no data) */
  isUserDataLoaded = false;

  /** Emits when the component is destroyed. */
  private onComponentDestroyed = new Subject<void>();

  constructor(
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userDataService: UserDataService
  ) {
    this.userDataService.onUserDataLoaded
      .pipe(takeUntil(this.onComponentDestroyed))
      .subscribe(() => {
        this.isUserDataLoaded = true;
      });
  }

  ngOnDestroy(): void {
    this.onComponentDestroyed.next();
  }

  /**
   * Adds a new item to a group.
   * @param group The group to which an item will be added
   */
  addNewItemToGroup(group: Group) {
    this.userDataService.editItem(new Item({ groupIds: [group.id] }));
  }

  /**
   * Handles a drag and drop event on item cards in a group.
   * @param group The group where the event occurred
   * @param event The drag and drop event
   */
  dropGroupItem(group: Group, event: CdkDragDrop<Array<Item>>) {
    moveItemInArray(group.itemIds, event.previousIndex, event.currentIndex);
    this.userDataService.saveUserData(UserDataAction.REORDER_GROUP_ITEMS);
  }

  /**
   * Sorts the items in a group by date (earlier at the top)
   * @param group The group whose items will be sorted
   */
  sortByDate(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)!
        .compareDateTo(this.itemService.getItemById(b)!);
    });
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }

  /**
   * Sorts the items in a group by title (alphabetically).
   * @param group The group whose items will be sorted
   */
  sortByTitle(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)!!
        .title.localeCompare(this.itemService.getItemById(b)!!.title);
    });
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }

  /**
   * Sorts the items in a group by whether they're favorited (first) or
   * not (last). Relative order will be maintained.
   * @param group The group whose items will be sorted
   */
  sortByFavorited(group: Group) {
    const favorited: Array<string> = [];
    const notFavorited: Array<string> = [];

    group.itemIds.forEach((itemId) => {
      if (this.itemService.getItemById(itemId)!.isFavorited) {
        favorited.push(itemId);
      } else {
        notFavorited.push(itemId);
      }
    });
    group.itemIds = [...favorited, ...notFavorited];
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }

  /**
   * @returns True if no groups exist.
   */
  noGroups(): boolean {
    return this.groupService.getGroupCount() === 0;
  }

  /**
   * Tracks a group by its ID.
   * @param index Index of the group within its `ngFor`
   * @param group The group to track
   * @returns The group's ID
   */
  trackGroupById(index: number, group: Group): string {
    return group.id;
  }

  /**
   * Tracks an item by its ID.
   * @param index Index of the item within its `ngFor`
   * @param item The item to track
   * @returns The item's ID
   */
  trackItemById(index: number, item: Item): string {
    return item.id;
  }
}
