import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { GroupService } from 'src/app/services/group.service';
import { GroupDeletionItemAction, UserDataService } from 'src/app/services/user-data.service';

export interface GroupDeleteDialogData {
  group: Group;
}

@Component({
  selector: 'app-group-delete-dialog',
  templateUrl: './group-delete-dialog.component.html',
  styleUrls: ['./group-delete-dialog.component.scss'],
})
export class GroupDeleteDialogComponent {
  ITEM_ACTIONS = Object.values(GroupDeletionItemAction);

  itemAction: GroupDeletionItemAction | null = null;
  replacementGroup: Group | null = null;

  get shouldShowReplacementGroupForm(): boolean {
    return this.itemAction === GroupDeletionItemAction.KEEP_ALL_ITEMS;
  }

  constructor(
    public readonly dialogRef: MatDialogRef<GroupDeleteDialogComponent>,
    private readonly groupService: GroupService,
    private readonly userDataService: UserDataService,
    @Inject(MAT_DIALOG_DATA) public data: GroupDeleteDialogData
  ) {}

  getReplacementGroupOptions(): Array<Group> {
    return this.groupService
      .getGroups()
      .filter((group) => group.id !== this.data.group.id);
  }

  deleteGroup() {
    this.userDataService.deleteGroup(this.data.group, this.itemAction!!, this.replacementGroup);
    this.dialogRef.close();
  }
}
