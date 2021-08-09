import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/app.component';

export interface ItemEditDialogData {
  item: Item;
}

export enum RepeatEvery {
  NEVER = 'Never',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  BI_WEEKLY = 'Bi-weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly'
}

@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss'],
})
export class ItemEditDialogComponent {
  REPEAT_EVERY_OPTIONS = Object.values(RepeatEvery);
  HOURS_ARRAY = [...Array.from(Array(12).keys()).map((h) => h + 1)];
  MINUTES_ARRAY = [...Array(60).keys()];

  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemEditDialogData
  ) {}
}
