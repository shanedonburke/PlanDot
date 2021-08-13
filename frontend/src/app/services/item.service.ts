import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { getGroupTextColor, Group } from '../domain/group';
import { compareItemsByDate, Item, Repeat, TimePeriod } from '../domain/item';
import { GroupService } from './group.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private itemMap = new Map<string, Item>();
  private itemOrder: Array<string> = [];

  constructor(private groupService: GroupService) {}

  loadItems(items: Array<Item>) {
    items.forEach((item) => {
      this.itemMap.set(item.id, item);
    });
    this.itemOrder = items.map((item) => item.id);
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

  getGroupItems(group: Group): Array<Item> {
    return <Array<Item>>(
      group.itemIds
        .filter((id) => this.itemMap.has(id))
        .map((id) => this.itemMap.get(id))
    );
  }

  removeGroupFromItems(group: Group): void {
    this.getItems().forEach((item) => {
      const groupIdIndex = item.groupIds.indexOf(group.id);
      if (groupIdIndex !== -1) {
        item.groupIds.splice(groupIdIndex, 1);
      }
    });
  }

  getDateItems(date: Date): Array<Item> {
    date.setHours(0, 0, 0, 0);
    return this.getItems()
      .filter((item) => {
        if (item.dateEnabled) {
          return (
            (item.date.getFullYear() === date.getFullYear() &&
              item.date.getMonth() === date.getMonth() &&
              item.date.getDate() === date.getDate()) ||
            (item.date.getMonth() === date.getMonth() &&
              item.date.getDate() === date.getDate() &&
              item.repeat === Repeat.YEARLY) ||
            (item.date.getDate() === date.getDate() &&
              item.repeat === Repeat.MONTHLY) ||
            ((date.getTime() - item.date.getTime()) % 12096e5 === 0 &&
              item.repeat === Repeat.BI_WEEKLY) ||
            (item.weekdays.includes(date.getDay()) &&
              item.repeat === Repeat.DAILY_WEEKLY)
          );
        } else {
          return false;
        }
      })
      .sort((a, b) => compareItemsByDate(a, b));
  }

  getItemBackgroundColor(item: Item): string {
    if (item.groupIds.length === 0) {
      return '#444444';
    } else {
      return (
        this.groupService.getGroupById(item.groupIds[0])?.color ?? '#444444'
      );
    }
  }

  getItemTextColor(item: Item): string {
    if (item.groupIds.length === 0) {
      return 'white';
    } else {
      return getGroupTextColor(
        this.groupService.getGroupById(item.groupIds[0])!!
      );
    }
  }
}
