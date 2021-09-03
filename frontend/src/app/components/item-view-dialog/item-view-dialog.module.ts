import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FavoriteButtonModule } from '../favorite-button/favorite-button.module';
import { GroupNameChipModule } from '../group-name-chip/group-name-chip.module';
import { IconButtonModule } from '../icon-button/icon-button.module';
import { ItemViewDialogComponent } from './item-view-dialog.component';

@NgModule({
  declarations: [ItemViewDialogComponent],
  exports: [ItemViewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    GroupNameChipModule,
    IconButtonModule,
    FavoriteButtonModule,
    RouterModule,
  ],
})
export class ItemViewDialogModule {}
