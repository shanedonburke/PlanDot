import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { GroupNameChipModule } from "../../group-name-chip/group-name-chip.module";
import { ItemCardModule } from "../../item-card/item-card.module";
import { ItemSortButtonModule } from "../../item-sort-button/item-sort-button.module";
import { GroupViewComponent } from "./group-view.component";

@NgModule({
  declarations: [GroupViewComponent],
  exports: [GroupViewComponent],
  imports: [
    CommonModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    GroupNameChipModule,
    ItemCardModule,
    ItemSortButtonModule,
  ],
})
export class GroupViewModule {}