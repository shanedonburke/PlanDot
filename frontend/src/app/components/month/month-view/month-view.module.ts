import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ViewHeaderModule } from "../../view-header/view-header.module";
import { MonthViewComponent } from "./month-view.component";

@NgModule({
  declarations: [MonthViewComponent],
  exports: [MonthViewComponent],
  imports: [CommonModule, MatIconModule, ViewHeaderModule]
})
export class MonthViewModule {}