import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Group } from 'src/app/domain/group';
import { Item } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';
import { ItemViewDialogComponent } from '../../dialogs/item-view-dialog/item-view-dialog.component';

/**
 * Component that displays the pertinent details of an item.
 * It also provides buttons to favorite the item or view it in the
 * item view dialog.
 *
 * A Material drag-and-drop handle can be added to the card
 * by placing it in the template as this component's content.
 */
@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss'],
})
export class ItemCardComponent {
  /** The item to display */
  @Input() item!: Item;

  constructor(
    public readonly groupService: GroupService,
    private readonly dialog: MatDialog
  ) {}

  /**
   * View the item in the item view dialog.
   */
  expandItem() {
    this.dialog.open(ItemViewDialogComponent, {
      data: { item: this.item },
      autoFocus: false,
    });
  }

  /**
   * Tracks a group by its ID.
   * @param index Index of the group within its `ngFor`
   * @param group The group to track
   * @returns The group's ID
   */
  trackGroupById(index: number, group: Group): string {
    return group.id;
  }
}
