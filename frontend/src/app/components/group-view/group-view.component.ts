import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { Group } from 'src/app/domain/group';
import { createItem, Item, TimePeriod } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemService } from 'src/app/services/item.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent {

  constructor(
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userDataService: UserDataService,
  ) { }

  addNewItemToGroup(group: Group) {
    this.userDataService.editItem(createItem([group]));
  }

  getDisplayTime(item: Item): string {
    return `${item.time.hours}:${item.time.minutes
      .toString()
      .padStart(2, '0')} ${item.time.period}`;
  }

  dropGroupItem(group: Group, event: CdkDragDrop<Array<Item>>) {
    moveItemInArray(group.itemIds, event.previousIndex, event.currentIndex);
    this.userDataService.saveUserData();
  }

  sortByDate(group: Group) {
    console.log(this.groupService.getGroups());
    console.log(this.itemService.getItems());
    group.itemIds.sort((a, b) => {
      const itemA = this.itemService.getItemById(a);
      const itemB = this.itemService.getItemById(b);
      if (!itemA.dateEnabled && !itemB.dateEnabled) {
        return 0;
      } else if (itemA.dateEnabled && !itemB.dateEnabled) {
        return -1;
      } else if (itemB.dateEnabled && !itemA.dateEnabled) {
        return 1;
      } else {
        const dateDiff = itemA.date.getTime() - itemB.date.getTime();
        if (dateDiff === 0) {
          if (!itemA.timeEnabled && !itemB.timeEnabled) {
            return 0;
          } else if (itemA.timeEnabled && !itemB.timeEnabled) {
            return -1;
          } else if (itemB.timeEnabled && !itemA.timeEnabled) {
            return 1;
          } else {
            if (
              itemA.time.period === TimePeriod.AM &&
              itemB.time.period === TimePeriod.PM
            ) {
              return -1;
            } else if (
              itemA.time.period === TimePeriod.PM &&
              itemB.time.period === TimePeriod.AM
            ) {
              return 1;
            } else {
              const hoursDiff =
                (itemA.time.hours % 12) - (itemB.time.hours % 12);
              if (hoursDiff === 0) {
                return itemA.time.minutes - itemB.time.minutes;
              } else {
                return hoursDiff;
              }
            }
          }
        } else {
          return dateDiff;
        }
      }
    });
    this.userDataService.saveUserData();
  }

  sortByTitle(group: Group) {
    group.itemIds.sort((a, b) => {
      return this.itemService
        .getItemById(a)
        .title.localeCompare(this.itemService.getItemById(b).title);
    });
    this.userDataService.saveUserData();
  }
}
