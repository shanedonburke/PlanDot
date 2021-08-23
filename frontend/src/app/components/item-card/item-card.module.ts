import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ItemViewDialogModule } from "../item-view-dialog/item-view-dialog.module";
import { ItemCardComponent } from "./item-card.component";

@NgModule({
  declarations: [ItemCardComponent],
  exports: [ItemCardComponent],
  imports: [CommonModule, ItemViewDialogModule, MatIconModule]
})
export class ItemCardModule {}