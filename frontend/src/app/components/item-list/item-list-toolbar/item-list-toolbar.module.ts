import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IconButtonModule } from '../../icon-button/icon-button.module';
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
    IconButtonModule,
  ],
})
export class ItemListToolbarModule {}
