import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ItemViewDialogModule } from '../item-view-dialog/item-view-dialog.module';
import { ItemCardComponent } from './item-card.component';

@NgModule({
  declarations: [ItemCardComponent],
  exports: [ItemCardComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ItemViewDialogModule,
    MatIconModule,
    IconButtonModule,
  ],
})
export class ItemCardModule {}
