import { Component, Input } from '@angular/core';

/**
 * A button that displays a Material icon.
 * A custom size and icon may be specified.
 */
@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
})
export class IconButtonComponent {
  /** Material icon to display */
  @Input() icon!: string;

  /** CSS size of the button/icon, e.g., '24px' */
  @Input() size: string = '24px';
}
