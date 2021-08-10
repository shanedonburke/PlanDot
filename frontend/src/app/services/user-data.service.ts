import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../domain/group';
import { Item } from '../domain/item';
import { GroupService } from './group.service';
import { ItemService } from './item.service';

export interface ItemDto extends Omit<Item, 'date'> {
  date: string;
}

export interface UserData {
  groups: Array<Group>;
  items: Array<ItemDto>;
}

function isUserData(obj: any): obj is UserData {
  return typeof obj === 'object' && 'groups' in obj;
}

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  constructor(
    private readonly httpClient: HttpClient,
    private readonly groupService: GroupService,
    private readonly itemService: ItemService
  ) {}

  saveUserData(): void {
    this.httpClient
      .post('/api/user_data', {
        items: this.itemService.getItems(),
        groups: this.groupService.getGroups(),
      })
      .subscribe();
  }

  loadUserData(): void {
    this.httpClient
      .get<UserData>('/api/user_data', { withCredentials: true })
      .subscribe((userData) => {
        if (isUserData(userData)) {
          this.groupService.loadGroups(userData.groups);
          this.itemService.loadItems(
            userData.items.map((dto) => {
              return { ...dto, date: new Date(dto.date) };
            })
          );
        }
      });
  }

  deleteGroup(group: Group): void {
    this.groupService.deleteGroup(group);
    this.itemService.removeGroupFromItems(group);
    this.saveUserData();
  }
}
