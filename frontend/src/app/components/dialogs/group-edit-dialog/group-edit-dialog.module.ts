import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupEditDialogComponent } from './group-edit-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [GroupEditDialogComponent],
  exports: [GroupEditDialogComponent],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ColorPickerModule,
  ],
})
export class GroupEditDialogModule {}
