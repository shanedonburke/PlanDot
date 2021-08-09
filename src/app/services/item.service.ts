import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Group, Item } from '../domain/group';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private items: Array<Item> = [];

  getItems(): ReadonlyArray<Item> {
    return this.items;
  }

  addItem(item: Item): void {
    this.items.push(item);
  }

  getGroupItems(group: Group): Array<Item> {
    return this.items.filter(item => item.groups.includes(group));
  }

  handleGroupItemDrop(group: Group, event: CdkDragDrop<Array<Item>>): void {
    const groupItems = this.getGroupItems(group);
    const item = groupItems[event.previousIndex];
    const prevIndex = this.items.indexOf(groupItems[event.previousIndex]);
    const currIndex = this.items.indexOf(groupItems[event.currentIndex]);
    if (event.previousIndex < event.currentIndex) {
      for (let i = prevIndex + 1; i <= currIndex; i++) {
        this.items[i - 1] = this.items[i];
      }
    } else if (event.previousIndex > event.currentIndex) {
      for (let i = prevIndex - 1; i >= currIndex; i--) {
        this.items[i + 1] = this.items[i];
      }
    }
    this.items[currIndex] = item;
  }
}
