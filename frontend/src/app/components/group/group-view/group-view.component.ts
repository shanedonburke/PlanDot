import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent {
  isUserDataLoaded = false;

  constructor(
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userDataService: UserDataService,
  ) {
    this.userDataService.onUserDataLoaded.subscribe(() => {
      this.isUserDataLoaded = true;
    });
  }

  addNewItemToGroup(group: Group) {
    this.userDataService.editItem(new Item({ groupIds: [group.id] }));
  }

  dropGroupItem(group: Group, event: CdkDragDrop<Array<Item>>) {
    moveItemInArray(group.itemIds, event.previousIndex, event.currentIndex);
    this.userDataService.saveUserData(UserDataAction.REORDER_GROUP_ITEMS);
  }

  sortByDate(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)!
        .compareDateTo(this.itemService.getItemById(b)!);
    });
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }

  sortByTitle(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)!!
        .title.localeCompare(this.itemService.getItemById(b)!!.title);
    });
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }

  sortByFavorited(group: Group) {
    const favorited: Array<string> = [];
    const notFavorited: Array<string> = [];

    group.itemIds.forEach((itemId) => {
      if (this.itemService.getItemById(itemId)!.isFavorited) {
        favorited.push(itemId);
      } else {
        notFavorited.push(itemId);
      }
    });
    group.itemIds = [...favorited, ...notFavorited];
    this.userDataService.saveUserData(UserDataAction.SORT_GROUP_ITEMS);
  }
}
