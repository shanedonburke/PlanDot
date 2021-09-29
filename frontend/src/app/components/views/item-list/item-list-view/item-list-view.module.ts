import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ItemCardModule } from '../../../widgets/item-card/item-card.module';
import { ItemListViewComponent } from './item-list-view.component';

@NgModule({
  declarations: [ItemListViewComponent],
  exports: [ItemListViewComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DragDropModule,
    ItemCardModule,
  ],
})
export class ItemListViewModule {}
