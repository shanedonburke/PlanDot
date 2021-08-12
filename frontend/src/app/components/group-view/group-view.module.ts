import { DragDropModule } from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { GroupViewComponent } from "./group-view.component";

@NgModule({
  declarations: [GroupViewComponent],
  exports: [GroupViewComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    MatButtonModule,
  ],
})
export class GroupViewModule {}