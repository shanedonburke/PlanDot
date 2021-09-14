import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FavoriteButtonModule } from '../favorite-button/favorite-button.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ItemViewDialogModule } from '../../dialogs/item-view-dialog/item-view-dialog.module';
import { ItemCardComponent } from './item-card.component';

@NgModule({
  declarations: [ItemCardComponent],
  exports: [ItemCardComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ItemViewDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    IconButtonModule,
    FavoriteButtonModule,
  ],
})
export class ItemCardModule {}
