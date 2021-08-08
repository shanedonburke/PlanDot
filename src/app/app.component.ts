import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from './components/group-edit-dialog/group-edit-dialog.component';

export interface Item {
  title: string;
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
    this.groups.push({
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
        this.groups[index] = result;
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
    group.items.push({
      title: 'New item',
    });
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
