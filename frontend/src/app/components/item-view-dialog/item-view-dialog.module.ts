import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { ItemViewDialogComponent } from "./item-view-dialog.component";

@NgModule({
  declarations: [ItemViewDialogComponent],
  exports: [ItemViewDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
  ]
})
export class ItemViewDialogModule {}