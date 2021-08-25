import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { GroupEditDialogComponent } from '../../group-edit-dialog/group-edit-dialog.component';

@Component({
  selector: 'app-group-toolbar',
  templateUrl: './group-toolbar.component.html',
  styleUrls: ['./group-toolbar.component.scss'],
})
export class GroupToolbarComponent {
  isGroupsMenuVisible = false;
  isGroupEditDialogOpen = false;

  constructor(
    public readonly userDataService: UserDataService,
    public readonly groupService: GroupService,
    private readonly dialog: MatDialog,
  ) {}

  addGroup() {
    this.editGroup(new Group());
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

  @HostListener('document:click', ['$event'])
  closeGroupsMenu() {
    if (!this.isGroupEditDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }
}
