import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ItemEditDialogComponent } from './item-edit-dialog.component';

@NgModule({
  declarations: [ItemEditDialogComponent],
  exports: [ItemEditDialogComponent],
  imports: [MatDialogModule],
})
export class ItemEditDialogModule {}
