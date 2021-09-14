import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';
import { GroupDeleteDialogComponent } from '../../../dialogs/group-delete-dialog/group-delete-dialog.component';
import { GroupEditDialogComponent } from '../../../dialogs/group-edit-dialog/group-edit-dialog.component';

@Component({
  selector: 'app-group-toolbar',
  templateUrl: './group-toolbar.component.html',
  styleUrls: ['./group-toolbar.component.scss'],
})
export class GroupToolbarComponent {
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  constructor(
    public readonly groupService: GroupService,
    private readonly userDataService: UserDataService,
    private readonly dialog: MatDialog,
  ) {}

  addGroup(): void {
    this.editGroup(new Group());
  }

  editGroup(group: Group): void {
    this.isGroupEditDialogOpen = true;
    const dialogRef = this.dialog.open(GroupEditDialogComponent, {
      data: { group: group.getDeepCopy() },
    });

    dialogRef.afterClosed().subscribe((result: Group) => {
      this.isGroupEditDialogOpen = false;
      if (result) {
        this.isGroupsMenuVisible = false;
        this.groupService.updateOrCreateGroup(group, result);
        this.userDataService.saveUserData(UserDataAction.EDIT_GROUP);
      }
    });
  }

  deleteGroup(group: Group): void {
    if (group.itemIds.length > 0) {
      this.dialog.open(GroupDeleteDialogComponent, {
        data: { group },
      });   
    } else {
      this.userDataService.deleteGroup(group);
    }
  }

  toggleGroupsMenu(event: MouseEvent): void {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  closeGroupsMenu(): void {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
