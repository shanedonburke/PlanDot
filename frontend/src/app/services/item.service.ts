import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { getGroupTextColor, Group } from '../domain/group';
import {
  compareItemsByDate,
  doesDateHaveItem,
  Item,
  Repeat,
  TimePeriod,
} from '../domain/item';
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
    items.forEach((item) => {
      this.itemMap.set(item.id, item);
    });
    this.itemOrder = items.map((item) => item.id);
    items.forEach((item) => {
      if (item.date.getTime() < getTodaysDate().getTime() && item.repeat !== Repeat.NEVER) {
        item.date = getTodaysDate();
        while (!doesDateHaveItem(item.date, item)) {
          item.date.setTime(item.date.getTime() + ONE_DAY_MS);
        }
        console.log(item.date);
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
      .filter((item) => doesDateHaveItem(date, item))
      .sort((a, b) => compareItemsByDate(a, b));
  }

  getItemBackgroundColor(item: Item): string {
    return item.groupIds.length === 0
      ? '444444'
      : this.groupService.getGroupById(item.groupIds[0])?.color ?? '#444444';
  }

  getItemTextColor(item: Item): string {
    return item.groupIds.length === 0
      ? 'white'
      : getGroupTextColor(this.groupService.getGroupById(item.groupIds[0])!!);
  }
}
