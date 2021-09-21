import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as createDOMPurify from 'dompurify';
import * as marked from 'marked';
import { Item, Repeat } from 'src/app/domain/item';
import { DateService } from 'src/app/services/date.service';
import { GroupService } from 'src/app/services/group.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { ViewService } from 'src/app/services/view.service';
import { WEEKDAYS } from 'src/app/util/constants';

export interface ItemViewDialogData {
  item: Item;
}

/**
 * A dialog that shows the details of an item.
 */
@Component({
  selector: 'app-item-view-dialog',
  templateUrl: './item-view-dialog.component.html',
  styleUrls: ['./item-view-dialog.component.scss'],
})
export class ItemViewDialogComponent {
  /** Markdown description converted to HTML */
  descriptionHtml: string;

  constructor(
    public readonly dialogRef: MatDialogRef<ItemViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ItemViewDialogData,
    public readonly userDataService: UserDataService,
    public readonly groupService: GroupService,
    private readonly dateService: DateService,
    private readonly viewService: ViewService,
  ) {
    // Sanitize Markdown and convert to HTML
    this.descriptionHtml = createDOMPurify().sanitize(
      marked(this.data.item.description)
    );
  }

  /**
   * Edit the item.
   */
  editItem(): void {
    this.dialogRef
      .afterClosed()
      .subscribe(() => this.userDataService.editItem(this.data.item, true));
    this.dialogRef.close();
  }

  /**
   * Delete the item.
   */
  deleteItem() {
    this.userDataService.deleteItem(this.data.item);
    this.dialogRef.close();
  }

  /**
   * @returns a string representing when the item occurs.
   */
  getDisplayRepeat(): string {
    if (this.data.item.repeat === Repeat.DAILY_WEEKLY) {
      // e.g., 'Daily/Weekly (Mo, We, Fr)'
      return `${Repeat.DAILY_WEEKLY} (${this.data.item.weekdays
        .map((dayIdx) => WEEKDAYS[dayIdx])
        .join(', ')})`;
    } else {
      return this.data.item.repeat;
    }
  }

  /**
   * View this item's date in the day view.
   */
  goToItemDate(): void {
    this.dateService.date = this.data.item.date;
    this.dialogRef.close();
    this.viewService.goToDayView();
  }
}
