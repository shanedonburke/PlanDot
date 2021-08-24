import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ItemSortButtonComponent } from './item-sort-button.component';

@NgModule({
  declarations: [ItemSortButtonComponent],
  exports: [ItemSortButtonComponent],
  imports: [MatIconModule, MatButtonModule, MatMenuModule],
})
export class ItemSortButtonModule {}
