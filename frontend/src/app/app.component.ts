import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { v4 } from 'uuid';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GroupEditDialogComponent } from './components/group-edit-dialog/group-edit-dialog.component';
import { ItemEditDialogComponent } from './components/item-edit-dialog/item-edit-dialog.component';
import { Group } from './domain/group';
import { createItem, Item, RepeatEvery, TimePeriod } from './domain/item';
import { GroupService } from './services/group.service';
import { ItemService } from './services/item.service';
import { UserDataService } from './services/user-data.service';
import { UserAuthService } from './services/user-auth.service';
import { getCookie, setCookie } from './util/cookies';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  constructor(
    public readonly dialog: MatDialog,
    public readonly groupService: GroupService,
    public readonly itemService: ItemService,
    public readonly userAuthService: UserAuthService,
    public readonly userDataService: UserDataService,
  ) {
    this.userDataService.loadUserData();
  }

  ngOnInit() {
    if (getCookie('view') === null) {
      setCookie('view', 'group');
    }
  }

  getViewName(): string {
    return getCookie('view') ?? 'group';
  }

  isGroupView(): boolean {
    return this.getViewName() === 'group';
  }

  isMonthView(): boolean {
    return this.getViewName() === 'month';
  }

  setView(viewName: string): void {
    setCookie('view', viewName);
  }

  addGroup() {
    this.editGroup({
      id: v4(),
      name: `Group ${this.groupService.getGroups().length + 1}`,
      color: '#' + Math.floor(Math.random() * 0xffffff).toString(16),
      itemIds: [],
    });
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
        this.userDataService.saveUserData();
      }
    });
  }

  toggleGroupsMenu(event: MouseEvent) {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    event.stopPropagation();
  }

  addNewItem() {
    this.userDataService.editItem(createItem());
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
