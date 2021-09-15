import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import {
  GroupDeletionItemAction,
  UserDataService,
} from 'src/app/services/user-data.service';

/** Data passed to the dialog */
export interface GroupDeleteDialogData {
  group: Group;
}

/**
 * Dialog for deleting a group.
 * The user may choose what happens to items within the deleted group.
 */
@Component({
  selector: 'app-group-delete-dialog',
  templateUrl: './group-delete-dialog.component.html',
  styleUrls: ['./group-delete-dialog.component.scss'],
})
export class GroupDeleteDialogComponent {
  /** Possible actions (options) for items in deleted group */
  ITEM_ACTIONS = Object.values(GroupDeletionItemAction);

  /** Selected action */
  itemAction: GroupDeletionItemAction | null = null;

  /** Group into which all of the deleted group's items will go */
  replacementGroup: Group | null = null;

  /** Whether the replacement group input should be shown */
  get shouldShowReplacementGroupForm(): boolean {
    return this.itemAction === GroupDeletionItemAction.KEEP_ALL_ITEMS;
  }

  constructor(
    public readonly dialogRef: MatDialogRef<GroupDeleteDialogComponent>,
    private readonly groupService: GroupService,
    private readonly userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: GroupDeleteDialogData
  ) {}

  /**
   * @returns a list of all groups except the one being deleted
   */
  getReplacementGroupOptions(): Array<Group> {
    return this.groupService
      .getGroups()
      .filter((group) => group.id !== this.data.group.id);
  }

  /**
   * Deletes the group and close the dialog.
   */
  deleteGroup() {
    this.userDataService.deleteGroup(
      this.data.group,
      this.itemAction!!,
      this.replacementGroup
    );
    this.dialogRef.close();
  }
}
