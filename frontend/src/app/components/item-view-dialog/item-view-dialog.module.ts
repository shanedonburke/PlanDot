import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { GroupNameChipModule } from "../group-name-chip/group-name-chip.module";
import { ItemViewDialogComponent } from "./item-view-dialog.component";

@NgModule({
  declarations: [ItemViewDialogComponent],
  exports: [ItemViewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    GroupNameChipModule,
  ]
})
export class ItemViewDialogModule {}