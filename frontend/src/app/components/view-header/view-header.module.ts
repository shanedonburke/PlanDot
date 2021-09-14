import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ViewHeaderComponent } from "./view-header.component";

@NgModule({
  declarations: [ViewHeaderComponent],
  exports: [ViewHeaderComponent],
  imports: [MatIconModule],
})
export class ViewHeaderModule {}