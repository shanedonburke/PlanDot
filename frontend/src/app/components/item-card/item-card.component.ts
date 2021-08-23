import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDisplayTime, Item } from 'src/app/domain/item';
import { ItemViewDialogComponent } from '../item-view-dialog/item-view-dialog.component';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {
  @Input() item!: Item;

  constructor(private readonly dialog: MatDialog) {}

  expandItem(item: Item) {
    this.dialog.open(ItemViewDialogComponent, {
      data: { item },
    });
  }

  getDisplayTime(item: Item): string {
    return getDisplayTime(item);
  }
}
