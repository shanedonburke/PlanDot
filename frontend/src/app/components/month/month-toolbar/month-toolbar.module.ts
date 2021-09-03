import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MonthToolbarComponent } from "./month-toolbar.component";

@NgModule({
  declarations: [MonthToolbarComponent],
  exports: [MonthToolbarComponent],
  imports: [MatIconModule, MatButtonModule, MatTooltipModule]
})
export class MonthToolbarModule {}