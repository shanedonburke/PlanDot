import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from 'src/app/domain/item';
import { UserDataService } from 'src/app/services/user-data.service';

export interface ItemViewDialogData {
  item: Item;
}

@Component({
  selector: 'app-item-view-dialog',
  templateUrl: './item-view-dialog.component.html',
  styleUrls: ['./item-view-dialog.component.scss'],
})
export class ItemViewDialogComponent {
  constructor(
    public readonly dialogRef: MatDialogRef<ItemViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemViewDialogData,
    public readonly userDataService: UserDataService
  ) {}

  editItem(): void {
    this.dialogRef
      .afterClosed()
      .subscribe(() => this.userDataService.editItem(this.data.item));
    this.dialogRef.close();
  }
}
