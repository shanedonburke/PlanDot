import { Injectable } from '@angular/core';
import { Group } from '../domain/group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private groups: Array<Group> = [];

  getGroups(): ReadonlyArray<Group> {
    return this.groups;
  }

  deleteGroup(group: Group): void {
    this.groups.splice(this.groups.indexOf(group), 1);
  }

  updateOrCreateGroup(group: Group, newGroup: Group): void {
    const index = this.groups.indexOf(group);
    if (index !== -1) {
      this.groups[index] = newGroup;
    } else {
      this.groups.push(newGroup);
    }
  }

  getGroupTextColor(group: Group): string {
    const red = parseInt(group.color.substr(1, 2), 16);
    const green = parseInt(group.color.substr(3, 2), 16);
    const blue = parseInt(group.color.substr(5, 2), 16);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186
      ? '#000000'
      : '#ffffff';
  }
}
