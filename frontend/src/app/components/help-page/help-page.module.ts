import { NgModule } from "@angular/core";
import { HelpPage0Component, HelpPage1Component, HelpPageBaseComponent } from "./help-page.component";

@NgModule({
  declarations: [HelpPageBaseComponent, HelpPage0Component, HelpPage1Component],
  exports: [HelpPageBaseComponent, HelpPage0Component, HelpPage1Component],
})
export class HelpPageModule {}