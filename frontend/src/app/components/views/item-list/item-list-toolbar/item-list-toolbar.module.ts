import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IconButtonModule } from '../../../widgets/icon-button/icon-button.module';
import { ItemSortButtonModule } from '../../../widgets/item-sort-button/item-sort-button.module';
import { ItemListToolbarComponent } from './item-list-toolbar.component';

@NgModule({
  declarations: [ItemListToolbarComponent],
  exports: [ItemListToolbarComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
    MatCheckboxModule,
    IconButtonModule,
    ItemSortButtonModule
  ],
})
export class ItemListToolbarModule {}
