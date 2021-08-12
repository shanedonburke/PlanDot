import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MonthViewComponent } from "./month-view.component";

@NgModule({
  declarations: [MonthViewComponent],
  exports: [MonthViewComponent],
  imports: [CommonModule]
})
export class MonthViewModule {}