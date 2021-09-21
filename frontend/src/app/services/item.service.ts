import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { Item, Repeat } from '../domain/item';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';
import { GroupService } from './group.service';

/**
 * A service to store and manage user-created items.
 */
@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemMap = new Map<string, Item>();
  private itemOrder: Array<string> = [];

  constructor(private groupService: GroupService) {}

  /**
   * Replace the item state with the given items.
   * @param items Items to load
   */
  loadItems(items: Array<Item>) {
    this.itemMap.clear();
    this.itemOrder = [];
    
    items.forEach((item) => {
      this.itemMap.set(item.id, item);
    });
    this.itemOrder = items.map((item) => item.id);

    // If any repeating items have specified dates that are in the past,
    // set them to the first present/future date on which they occur.
    items.forEach((item) => {
      if (
        item.date.getTime() < getTodaysDate().getTime() &&
        item.repeat !== Repeat.NEVER
      ) {
        const date = getTodaysDate();
        while (!item.hasDate(date)) {
          date.setTime(date.getTime() + ONE_DAY_MS);
        }
        item.date = date;
      }
    });
  }

  /**
   * @returns An array of all items
   */
  getItems(): ReadonlyArray<Item> {
    return <ReadonlyArray<Item>>(
      this.itemOrder
        .filter((item) => this.itemMap.has(item))
        .map((item) => this.itemMap.get(item))
    );
  }

  /**
   * Determines whether the service has an item with the given ID.
   * @param itemId The item to look for
   * @returns True if the service has the item
   */
  hasItem(itemId: string): boolean {
    return this.itemMap.has(itemId);
  }

  /**
   * Retrieves an item by its ID.
   * @param itemId The item's ID
   * @returns The item, or undefined
   */
  getItemById(itemId: string): Item | undefined {
    return this.itemMap.get(itemId);
  }

  /**
   * Updates an existing item, or adds a new one to the service if there is no
   * item with the given item's ID.
   * @param item The item to create or update
   */
  updateOrCreateItem(item: Item): void {
    this.itemMap.set(item.id, item);
    if (!this.itemOrder.includes(item.id)) {
      this.itemOrder.push(item.id);
    }

    this.groupService.getGroups().forEach((group) => {
      if (
        group.itemIds.includes(item.id) &&
        !item.groupIds.includes(group.id)
      ) {
        // Remove this item from the group if the item no longer has its ID
        // i.e., the group was just removed
        group.itemIds.splice(group.itemIds.indexOf(item.id), 1);
      } else if (
        !group.itemIds.includes(item.id) &&
        item.groupIds.includes(group.id)
      ) {
        // Add this item to the group if the group doesn't have its ID
        // i.e., the group was newly added
        group.itemIds.push(item.id);
      }
    });
  }

  /**
   * Deletes an item.
   * 
   * NOTE: This method should only be called by `UserDataService`.
   * @param item The item to delete
   * @returns True if the item was deleted, or false if it didn't exist
   */
  deleteItem(item: Item): boolean {
    if (this.hasItem(item.id)) {
      this.itemMap.delete(item.id);
      this.itemOrder.splice(this.itemOrder.indexOf(item.id), 1);
      return true;
    }
    return false;
  }

  /**
   * Deletes all items that belong to the given group.
   * @param group The group whose items should be deleted
   */
  deleteItemsByGroup(group: Group): void {
    this.getItems().forEach((item) => {
      if (item.groupIds.includes(group.id)) {
        this.deleteItem(item);
      }
    });
  }

  /**
   * Deletes all items whose one and only group is the given group.
   * @param group The group whose items should be deleted
   */
  deleteItemsWithSingleGroup(group: Group): void {
    this.getItems().forEach((item) => {
      if (item.groupIds.length === 1 && item.groupIds[0] === group.id) {
        this.deleteItem(item);
      }
    });
  }

  /**
   * Removes a group from all items, optionally replacing it with another group.
   * Pass `null` as the second argument to simply remove the group.
   * @param group The group to remove
   * @param replacementGroup The group with which it'll be replaced
   */
  removeGroupFromItems(group: Group, replacementGroup: Group | null = null): void {
    this.getItems().forEach((item) => {
      const groupIdIndex = item.groupIds.indexOf(group.id);
      if (groupIdIndex !== -1) {
        if (replacementGroup !== null) {
          item.groupIds.splice(groupIdIndex, 1, replacementGroup.id);
        } else {
          item.groupIds.splice(groupIdIndex, 1);
        }
      }
    });
  }

  /**
   * Sort the items by date (earlier dates are first).
   */
  sortItemsByDate(): void {
    this.itemOrder.sort((a, b) =>
      this.itemMap.get(a)!.compareDateTo(this.itemMap.get(b)!)
    );
  }

  /**
   * Sort the items by title (alphabetically).
   */
  sortItemsByTitle(): void {
    this.itemOrder.sort((a, b) => {
      const aItem = this.itemMap.get(a)!;
      const bItem = this.itemMap.get(b)!;
      if (aItem.title < bItem.title) {
        return -1;
      } else if (aItem.title > bItem.title) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  /**
   * Sorts the items such that favorited items are first.
   * Relative ordering is preserved.
   */
  sortItemsByFavorited(): void {
    const favorited: Array<string> = [];
    const notFavorited: Array<string> = [];

    this.itemOrder.forEach((itemId) => {
      if (this.getItemById(itemId)!.isFavorited) {
        favorited.push(itemId);
      } else {
        notFavorited.push(itemId);
      }
    });
    this.itemOrder = [...favorited, ...notFavorited];
  }

  /**
   * Retrieves all items that belong to the given group.
   * @param group The group
   * @returns An array of items
   */
  getItemsByGroup(group: Group): Array<Item> {
    return <Array<Item>>(
      group.itemIds
        .filter((id) => this.itemMap.has(id))
        .map((id) => this.itemMap.get(id))
    );
  }

  /**
   * Retrieves all items that occur on the given date.
   * @param date The date
   * @returns An array of items
   */
  getItemsByDate(date: Date): Array<Item> {
    date.setHours(0, 0, 0, 0);
    return this.getItems()
      .filter((item) => item.hasDate(date))
      .sort((a, b) => a.compareDateTo(b));
  }

  /**
   * Determines the background color for an item when one is present.
   * The background is that of the item's first group, or a neutral color
   * if the item belongs to no groups.
   * @param item The item
   * @returns A CSS color string
   */
  getItemBackgroundColor(item: Item): string {
    return item.groupIds.length === 0
      ? '#444444'
      : this.groupService.getGroupById(item.groupIds[0])?.color ?? '#444444';
  }

  /**
   * Returns the best text color for when an item is rendered against
   * a background (as determined by its first group).
   * @param item The item
   * @returns A CSS color string
   */
  getItemTextColor(item: Item): string {
    return item.groupIds.length === 0
      ? 'white'
      : this.groupService.getGroupById(item.groupIds[0])!!.getTextColor();
  }

  /**
   * Reorders items when the user drags item cards to do so.
   * @param event The drag and drop event
   */
  handleItemListDragDrop(event: CdkDragDrop<Array<Item>>): void {
    moveItemInArray(this.itemOrder, event.previousIndex, event.currentIndex);
  }
}
