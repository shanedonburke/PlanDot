import { Component, Input, ViewEncapsulation } from "@angular/core";
import { slideIn } from "./help-page-animations";

@Component({
  selector: 'app-help-page',
  styleUrls: ['./help-page.component.scss'],
  animations: [slideIn],
  templateUrl: './help-page.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HelpPageComponent {
  @Input('direction') direction = '';
  @Input('content') content = '';
}