import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import { UserDataAction, UserDataService } from 'src/app/services/user-data.service';
import { GroupDeleteDialogComponent } from '../../../dialogs/group-delete-dialog/group-delete-dialog.component';
import { GroupEditDialogComponent } from '../../../dialogs/group-edit-dialog/group-edit-dialog.component';

/**
 * Component for the group view toolbar.
 */
@Component({
  selector: 'app-group-toolbar',
  templateUrl: './group-toolbar.component.html',
  styleUrls: ['./group-toolbar.component.scss'],
})
export class GroupToolbarComponent {
  /** Whether the 'Groups' menu is visible. Toggled by clicking */
  isGroupsMenuVisible = false;

  /** True if any Material dialog is open */
  isDialogOpen = false;

  constructor(
    public readonly groupService: GroupService,
    private readonly userDataService: UserDataService,
    private readonly dialog: MatDialog,
  ) {}

  /**
   * Open the group edit dialog for a new group.
   */
  addGroup(): void {
    this.editGroup(new Group());
  }

  /**
   * Open the group edit dialog for the given group.
   * @param group The group to edit
   */
  editGroup(group: Group): void {
    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(GroupEditDialogComponent, {
      // Deep copy so that changes to the group aren't saved if the user
      // cancels the dialog.
      data: { group: group.getCopy() },
    });

    dialogRef.afterClosed().subscribe((result: Group) => {
      this.isDialogOpen = false;

      // `result` is truthy if the user clicked 'Save'
      if (result) {
        this.isGroupsMenuVisible = false;
        this.groupService.updateOrCreateGroup(result);
        this.userDataService.saveUserData(UserDataAction.EDIT_GROUP);
      }
    });
  }

  /**
   * Delete the given group.
   * @param group The group to delete
   */
  deleteGroup(group: Group): void {
    if (group.itemIds.length > 0) {
      // Don't immediately delete groups with items. Prompt the user
      // to choose what happens to the group's items.
      this.isDialogOpen = true;

      const dialogRef = this.dialog.open(GroupDeleteDialogComponent, {
        data: { group },
      });
      dialogRef.afterClosed().subscribe(() => {
        this.isDialogOpen = false;
      });
    } else {
      // Delete groups with no items immediately
      this.userDataService.deleteGroup(group);
    }
  }

  /**
   * Toggle whether the 'Groups' menu is visible
   * @param event Event generated by click
   */
  toggleGroupsMenu(event: MouseEvent): void {
    this.isGroupsMenuVisible = !this.isGroupsMenuVisible;
    /** Prevent {@link closeGroupsMenu} from closing the menu */
    event.stopPropagation();
  }

  /**
   * Close the 'Groups' menu on click outside of it, unless there's
   * a dialog open.
   */
  @HostListener('document:click', ['$event'])
  closeGroupsMenu(): void {
    if (!this.isDialogOpen) {
      this.isGroupsMenuVisible = false;
    }
  }

  /**
   * Tracks a group by its ID.
   * @param index Index of the group within its `ngFor`
   * @param group The group to track
   * @returns The group's ID
   */
  trackGroupById(index: number, group: Group): string {
    return group.id;
  }
}
