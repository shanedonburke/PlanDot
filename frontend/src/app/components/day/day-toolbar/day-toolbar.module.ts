import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { DayToolbarComponent } from "./day-toolbar.component";

@NgModule({
  declarations: [DayToolbarComponent],
  exports: [DayToolbarComponent],
  imports: [MatIconModule, MatButtonModule]
})
export class DayToolbarModule {}