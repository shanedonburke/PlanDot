import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { Item, Repeat } from '../domain/item';
import { ONE_DAY_MS } from '../util/constants';
import { getTodaysDate } from '../util/dates';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemMap = new Map<string, Item>();
  private itemOrder: Array<string> = [];

  constructor(private groupService: GroupService) {}

  loadItems(items: Array<Item>) {
    this.itemMap.clear();
    this.itemOrder = [];
    
    items.forEach((item) => {
      this.itemMap.set(item.id, item);
    });
    this.itemOrder = items.map((item) => item.id);
    items.forEach((item) => {
      if (
        item.date.getTime() < getTodaysDate().getTime() &&
        item.repeat !== Repeat.NEVER
      ) {
        let date = getTodaysDate();
        while (!item.hasDate(date)) {
          date.setTime(date.getTime() + ONE_DAY_MS);
        }
        item.date = date;
      }
    });
  }

  getItems(): ReadonlyArray<Item> {
    return <ReadonlyArray<Item>>(
      this.itemOrder
        .filter((item) => this.itemMap.has(item))
        .map((item) => this.itemMap.get(item))
    );
  }

  hasItem(itemId: string): boolean {
    return this.itemMap.has(itemId);
  }

  getItemById(itemId: string): Item | undefined {
    return this.itemMap.get(itemId);
  }

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
        group.itemIds.splice(group.itemIds.indexOf(item.id), 1);
      } else if (
        !group.itemIds.includes(item.id) &&
        item.groupIds.includes(group.id)
      ) {
        group.itemIds.push(item.id);
      }
    });
  }

  deleteItem(item: Item): void {
    this.itemMap.delete(item.id);
    this.itemOrder.splice(this.itemOrder.indexOf(item.id), 1);
  }

  deleteItemsByGroup(group: Group): void {
    this.getItems().forEach((item) => {
      if (item.groupIds.includes(group.id)) {
        this.deleteItem(item);
      }
    });
  }

  deleteItemsWithSingleGroup(group: Group): void {
    this.getItems().forEach((item) => {
      if (item.groupIds.length === 1 && item.groupIds[0] === group.id) {
        this.deleteItem(item);
      }
    });
  }

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

  sortItemsByDate(): void {
    this.itemOrder.sort((a, b) =>
      this.itemMap.get(a)!.compareDateTo(this.itemMap.get(b)!)
    );
  }

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

  getItemsByGroup(group: Group): Array<Item> {
    return <Array<Item>>(
      group.itemIds
        .filter((id) => this.itemMap.has(id))
        .map((id) => this.itemMap.get(id))
    );
  }

  getItemsByDate(date: Date): Array<Item> {
    date.setHours(0, 0, 0, 0);
    return this.getItems()
      .filter((item) => item.hasDate(date))
      .sort((a, b) => a.compareDateTo(b));
  }

  getItemBackgroundColor(item: Item): string {
    return item.groupIds.length === 0
      ? '#444444'
      : this.groupService.getGroupById(item.groupIds[0])?.color ?? '#444444';
  }

  getItemTextColor(item: Item): string {
    return item.groupIds.length === 0
      ? 'white'
      : this.groupService.getGroupById(item.groupIds[0])!!.getTextColor();
  }

  handleItemListDragDrop(event: CdkDragDrop<Array<Item>>): void {
    moveItemInArray(this.itemOrder, event.previousIndex, event.currentIndex);
  }
}
