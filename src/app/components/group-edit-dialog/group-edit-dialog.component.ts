import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Group } from 'src/app/app.component';

export interface GroupEditDialogData {
  group: Group;
}

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
