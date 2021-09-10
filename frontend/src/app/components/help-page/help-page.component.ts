import { Component, Input, ViewEncapsulation } from '@angular/core';
import { slideIn } from './help-page-animations';

@Component({
  selector: 'app-help-page-base',
  styleUrls: ['./help-page.component.scss'],
  animations: [slideIn],
  templateUrl: './help-page.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HelpPageBaseComponent {
  @Input('direction') direction = '';
}

@Component({ template: '' })
export class HelpPageComponent {
  @Input('direction') direction = '';
}

@Component({
  selector: 'app-help-page-0',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-0.component.html',
})
export class HelpPage0Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-1',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-1.component.html',
})
export class HelpPage1Component extends HelpPageComponent {}
