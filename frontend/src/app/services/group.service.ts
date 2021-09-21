import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { ItemJson } from '../domain/item';

/**
 * A service to store and manage user-created groups.
 */
@Injectable({
  providedIn: 'root',
})
export class GroupService {
  /** Group IDs in the order they're displayed */
  private groupOrder: Array<string> = [];

  /** Map of group IDs to `Group` objects */
  private groupMap = new Map<string, Group>();

  /**
   * Replaces the current group state with the given groups.
   * @param groups Groups to be loaded
   */
  loadGroups(groups: Array<Group>) {
    this.groupMap.clear();
    this.groupOrder = [];
    
    groups.forEach((group) => {
      this.groupMap.set(group.id, group);
    });
    this.groupOrder = groups.map((group) => group.id);
  }

  /**
   * @returns An array of all groups
   */
  getGroups(): ReadonlyArray<Group> {
    return <ReadonlyArray<Group>>(
      this.groupOrder
        .filter((groupId) => this.groupMap.has(groupId))
        .map((groupId) => this.groupMap.get(groupId))
    );
  }

  /**
   * Gets a group by its ID.
   * @param id A group ID
   * @returns The group with the given ID, or undefined
   */
  getGroupById(id: string): Group | undefined {
    return this.groupMap.get(id);
  }

  /**
   * Determines whether a group with the given ID exists.
   * @param groupId A group ID
   * @returns True if the group exists
   */
  hasGroup(groupId: string): boolean {
    return this.groupMap.has(groupId);
  }

  /**
   * Gets the groups to which the given item belongs.
   * @param item The item whose groups we want
   * @returns An array of the item's groups
   */
  getItemGroups(item: ItemJson): ReadonlyArray<Group> {
    return <ReadonlyArray<Group>>(
      item.groupIds
        .filter((id) => this.groupMap.has(id))
        .map((id) => this.groupMap.get(id))
    );
  }

  /**
   * Deletes a group.
   * 
   * NOTE: This method should only be called by `UserDataService`.
   * @param group The group to delete
   */
  deleteGroup(group: Group): void {
    this.groupOrder.splice(this.groupOrder.indexOf(group.id), 1);
    this.groupMap.delete(group.id);
  }

  /**
   * If the ID of {@link group} matches a known group, then that group will be
   * updated. Otherwise, it will be added to the service as a new group.
   * @param group The new or updated group
   */
  updateOrCreateGroup(group: Group): void {
    this.groupMap.set(group.id, group);
    if (!this.groupOrder.includes(group.id)) {
      this.groupOrder.push(group.id);
    }
  }

  /**
   * Removes {@link item} from any groups it belongs to.
   * @param item The item to remove from groups
   */
  removeItemFromGroups(item: ItemJson): void {
    this.getGroups().forEach((group) => {
      const itemIdIndex = group.itemIds.indexOf(item.id);
      if (itemIdIndex !== -1) {
        group.itemIds.splice(itemIdIndex, 1);
      }
    });
  }

  /**
   * @returns The total number of groups.
   */
  getGroupCount(): number {
    return this.groupOrder.length;
  }
}
