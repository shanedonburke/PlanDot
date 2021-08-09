import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ItemEditDialogComponent } from './item-edit-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [ItemEditDialogComponent],
  exports: [ItemEditDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
})
export class ItemEditDialogModule {}
