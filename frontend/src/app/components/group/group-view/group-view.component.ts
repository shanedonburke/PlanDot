import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { getGroupTextColor, Group } from 'src/app/domain/group';
import {
  compareItemsByDate,
  ItemJson,
  Item
} from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss'],
})
export class GroupViewComponent {
  constructor(
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userDataService: UserDataService
  ) {}

  addNewItemToGroup(group: Group) {
    this.userDataService.editItem(new Item({groupIds: [group.id]}));
  }

  dropGroupItem(group: Group, event: CdkDragDrop<Array<ItemJson>>) {
    moveItemInArray(group.itemIds, event.previousIndex, event.currentIndex);
    this.userDataService.saveUserData();
  }

  sortByDate(group: Group) {
    console.log(this.groupService.getGroups());
    console.log(this.itemService.getItems());
    group.itemIds.sort((a, b) => {
      return compareItemsByDate(
        this.itemService.getItemById(a)!!,
        this.itemService.getItemById(b)!!
      );
    });
    this.userDataService.saveUserData();
  }

  sortByTitle(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)!!
        .title.localeCompare(this.itemService.getItemById(b)!!.title);
    });
    this.userDataService.saveUserData();
  }

  getGroupTextColor(group: Group): string {
    return getGroupTextColor(group);
  }
}
