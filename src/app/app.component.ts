import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from './components/group-edit-dialog/group-edit-dialog.component';
import {
  ItemEditDialogComponent,
  RepeatEvery,
} from './components/item-edit-dialog/item-edit-dialog.component';

export enum TimePeriod {
  AM = 'AM',
  PM = 'PM',
}

export interface Item {
  title: string;
  description: string;
  date: Date;
  dateEnabled: boolean;
  repeatEvery: RepeatEvery;
  time: {
    hours: number;
    minutes: number;
    period: TimePeriod;
  };
  timeEnabled: boolean;
}

export interface Group {
  name: string;
  color: string;
  items: Array<Item>;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  groups: Array<Group> = [];
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  constructor(public dialog: MatDialog) {}

  addGroup() {
    this.editGroup({
      name: `Group ${this.groups.length + 1}`,
      color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
      items: [],
    });
  }

  deleteGroup(index: number) {
    this.groups.splice(index);
  }

  editGroup(group: Group) {
    this.isGroupEditDialogOpen = true;
    const dialogRef = this.dialog.open(GroupEditDialogComponent, {
      data: { group: { ...group } },
    });

    dialogRef.afterClosed().subscribe((result: Group) => {
      this.isGroupEditDialogOpen = false;
      if (result) {
        const index = this.groups.indexOf(group);
        if (index !== -1) {
          this.groups[index] = result;
        } else {
          this.groups.push(result);
        }
      }
    });
  }

  getGroupTextColor(group: Group): string {
    const red = parseInt(group.color.substr(1, 2), 16);
    const green = parseInt(group.color.substr(3, 2), 16);
    const blue = parseInt(group.color.substr(5, 2), 16);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186
      ? '#000000'
      : '#ffffff';
  }

  toggleGroupsMenu(event: MouseEvent) {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    event.stopPropagation();
  }

  addNewItemToGroup(group: Group) {
    const newItem: Item = {
      title: 'New Item',
      description: '',
      date: new Date(),
      dateEnabled: false,
      repeatEvery: RepeatEvery.NEVER,
      timeEnabled: false,
      time: {
        hours: 12,
        minutes: 0,
        period: TimePeriod.PM,
      },
    };

    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: { item: newItem },
    });

    dialogRef.afterClosed().subscribe((result: Item) => {
      if (result) {
        group.items.push(result);
      }
    });
  }

  getDisplayTime(item: Item): string {
    return `${item.time.hours}:${item.time.minutes
      .toString()
      .padStart(2, '0')} ${item.time.period}`;
  }

  dropGroupItem(group: Group, event: CdkDragDrop<string[]>) {
    moveItemInArray(group.items, event.previousIndex, event.currentIndex);
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
