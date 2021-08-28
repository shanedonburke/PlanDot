import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ItemCardModule } from '../../item-card/item-card.module';
import { ItemListViewComponent } from './item-list-view.component';

@NgModule({
  declarations: [ItemListViewComponent],
  exports: [ItemListViewComponent],
  imports: [CommonModule, MatDividerModule, DragDropModule, ItemCardModule],
})
export class ItemListViewModule {}
