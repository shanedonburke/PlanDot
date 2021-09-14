import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { GroupNameChipModule } from '../../widgets/group-name-chip/group-name-chip.module';
import { GroupDeleteDialogComponent } from './group-delete-dialog.component';

@NgModule({
  declarations: [GroupDeleteDialogComponent],
  exports: [GroupDeleteDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    GroupNameChipModule,
  ],
})
export class GroupDeleteDialogModule {}
