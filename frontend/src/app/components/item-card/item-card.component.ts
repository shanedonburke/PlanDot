import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { getDisplayTime, Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemViewDialogComponent } from '../item-view-dialog/item-view-dialog.component';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  @Input() item!: Item;

  constructor(
    public readonly groupService: GroupService,
    private readonly dialog: MatDialog
  ) {}

  expandItem() {
    this.dialog.open(ItemViewDialogComponent, {
      data: { item: this.item },
    });
  }

  getDisplayTime(item: Item): string {
    return getDisplayTime(item);
  }
}
