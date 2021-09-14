import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { DayToolbarComponent } from "./day-toolbar.component";

@NgModule({
  declarations: [DayToolbarComponent],
  exports: [DayToolbarComponent],
  imports: [MatIconModule, MatButtonModule, MatTooltipModule]
})
export class DayToolbarModule {}