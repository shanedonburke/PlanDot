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

  addItem(item: Item): void {
    this.itemMap.set(item.id, item);
    this.itemOrder.push(item.id);
    item.groupIds.forEach((groupId) => {
      this.groupService.getGroupById(groupId)!!.itemIds.push(item.id);
    });
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
}
