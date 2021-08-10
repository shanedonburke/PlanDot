import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { v4 } from 'uuid';
import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from './components/group-edit-dialog/group-edit-dialog.component';
import { ItemEditDialogComponent } from './components/item-edit-dialog/item-edit-dialog.component';
import { Group } from './domain/group';
import { createItem, Item, RepeatEvery, TimePeriod } from './domain/item';
import { GroupService } from './services/group.service';
import { ItemService } from './services/item.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  constructor(
    public dialog: MatDialog,
    public groupService: GroupService,
    public itemService: ItemService
  ) {}

  addGroup() {
    this.editGroup({
      id: v4(),
      name: `Group ${this.groupService.getGroups().length + 1}`,
      color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
      itemIds: [],
    });
  }

  deleteGroup(group: Group) {
    this.groupService.deleteGroup(group);
  }

  editGroup(group: Group) {
    this.isGroupEditDialogOpen = true;
    const dialogRef = this.dialog.open(GroupEditDialogComponent, {
      data: { group: { ...group } },
    });

    dialogRef.afterClosed().subscribe((result: Group) => {
      this.isGroupEditDialogOpen = false;
      if (result) {
        this.isGroupsMenuVisible = false;
        this.groupService.updateOrCreateGroup(group, result);
      }
    });
  }

  toggleGroupsMenu(event: MouseEvent) {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    event.stopPropagation();
  }

  addNewItem() {
    this.addItem(createItem());
  }

  addNewItemToGroup(group: Group) {
    this.addItem(createItem([group]));
  }

  addItem(item: Item) {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        this.itemService.addItem(result);
      }
    });
  }

  getDisplayTime(item: Item): string {
    return `${item.time.hours}:${item.time.minutes
      .toString()
      .padStart(2, '0')} ${item.time.period}`;
  }

  dropGroupItem(group: Group, event: CdkDragDrop<Array<Item>>) {
    moveItemInArray(group.itemIds, event.previousIndex, event.currentIndex);
  }

  sortByDate(group: Group) {
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
            if (itemA.time.period === TimePeriod.AM && itemB.time.period === TimePeriod.PM) {
              return -1;
            } else if (itemA.time.period === TimePeriod.PM && itemB.time.period === TimePeriod.AM) {
              return 1;
            } else {
              const hoursDiff = itemA.time.hours % 12 - itemB.time.hours % 12;
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
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
