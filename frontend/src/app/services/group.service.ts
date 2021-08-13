import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { Item } from '../domain/item';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groupOrder: Array<string> = [];
  private groupMap = new Map<string, Group>();

  loadGroups(groups: Array<Group>) {
    groups.forEach((group) => {
      this.groupMap.set(group.id, group);
    });
    this.groupOrder = groups.map((group) => group.id);
  }

  getGroups(): ReadonlyArray<Group> {
    return <ReadonlyArray<Group>>(
      this.groupOrder
        .filter((group) => this.groupMap.has(group))
        .map((group) => this.groupMap.get(group))
    );
  }

  getGroupById(id: string): Group | undefined {
    return this.groupMap.get(id);
  }

  hasGroup(groupId: string): boolean {
    return this.groupMap.has(groupId);
  }

  getItemGroups(item: Item): ReadonlyArray<Group> {
    return <ReadonlyArray<Group>>(
      item.groupIds
        .filter((id) => this.groupMap.has(id))
        .map((id) => this.groupMap.get(id))
    );
  }

  deleteGroup(group: Group): void {
    this.groupOrder.splice(this.groupOrder.indexOf(group.id), 1);
    this.groupMap.delete(group.id);
  }

  updateOrCreateGroup(group: Group, newGroup: Group): void {
    this.groupMap.set(group.id, newGroup);
    if (!this.groupOrder.includes(newGroup.id)) {
      this.groupOrder.push(newGroup.id);
    }
  }

  removeItemFromGroups(item: Item): void {
    this.getGroups().forEach((group) => {
      const itemIdIndex = group.itemIds.indexOf(item.id);
      if (itemIdIndex !== -1) {
        group.itemIds.splice(itemIdIndex, 1);
      }
    });
  }
}
