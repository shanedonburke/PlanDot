import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { Item } from '../domain/item';
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

  getItemById(itemId: string): Item {
    return this.itemMap.get(itemId)!!;
  }

  updateOrCreateItem(item: Item): void {
    this.itemMap.set(item.id, item);
    if (!this.itemOrder.includes(item.id)) {
      this.itemOrder.push(item.id);
    }
    this.groupService.getGroups().forEach((group) => {
      if (group.itemIds.includes(item.id) && !item.groupIds.includes(item.id)) {
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
    return this.getItems().filter((item) => {
      return (
        item.dateEnabled &&
        item.date.getFullYear() === date.getFullYear() &&
        item.date.getMonth() === date.getMonth() &&
        item.date.getDate() === date.getDate()
      );
    });
  }
}
