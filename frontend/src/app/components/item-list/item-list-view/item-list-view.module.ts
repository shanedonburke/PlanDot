import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ItemCardModule } from "../../item-card/item-card.module";
import { ItemListViewComponent } from "./item-list-view.component";

@NgModule({
  declarations: [ItemListViewComponent],
  exports: [ItemListViewComponent],
  imports: [CommonModule, ItemCardModule],
})
export class ItemListViewModule {}