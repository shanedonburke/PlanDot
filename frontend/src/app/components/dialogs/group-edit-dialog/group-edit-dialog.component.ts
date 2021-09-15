import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';

export interface GroupEditDialogData {
  group: Group;
}

/**
 * Dialog for editing a group.
 * The user may choose the group name and color.
 */
@Component({
  selector: 'app-group-edit-dialog',
  templateUrl: './group-edit-dialog.component.html',
  styleUrls: ['./group-edit-dialog.component.scss'],
})
export class GroupEditDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GroupEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GroupEditDialogData
  ) {}
}
