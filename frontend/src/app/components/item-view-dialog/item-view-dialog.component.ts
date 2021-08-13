import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as marked from 'marked';
import * as createDOMPurify from 'dompurify';
import { getDisplayTime, Item, Repeat, WEEKDAYS } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
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
  descriptionHtml: string;

  constructor(
    public readonly dialogRef: MatDialogRef<ItemViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemViewDialogData,
    public readonly userDataService: UserDataService,
    public readonly groupService: GroupService
  ) {
    this.descriptionHtml = createDOMPurify().sanitize(
      marked(this.data.item.description)
    );
  }

  editItem(): void {
    this.dialogRef
      .afterClosed()
      .subscribe(() => this.userDataService.editItem(this.data.item, true));
    this.dialogRef.close();
  }

  deleteItem() {
    this.userDataService.deleteItem(this.data.item);
    this.dialogRef.close();
  }

  getDisplayTime(): string {
    return getDisplayTime(this.data.item);
  }

  getDisplayRepeat(): string {
    if (this.data.item.repeat === Repeat.DAILY_WEEKLY) {
      return `${Repeat.DAILY_WEEKLY} (${this.data.item.weekdays
        .map((dayIdx) => WEEKDAYS[dayIdx])
        .join(', ')})`;
    } else {
      return this.data.item.repeat;
    }
  }
}
