import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { IconButtonComponent } from "./icon-button.component";

@NgModule({
  declarations: [IconButtonComponent],
  exports: [IconButtonComponent],
  imports: [MatButtonModule, MatIconModule]
})
export class IconButtonModule {}