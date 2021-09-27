import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A button that displays a Material icon.
 * A custom size and icon may be specified.
 */
@Component({
  selector: 'app-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  host: {
    role: 'button',
    tabindex: '0',
    '(click)': 'action.emit()',
    '(keydown.enter)': 'action.emit()'
  },
})
export class IconButtonComponent {
  /** Material icon to display */
  @Input() icon!: string;

  /** CSS size of the button/icon, e.g., '24px' */
  @Input() size = '24px';

  /** ARIA label to display */
  @Input() ariaLabel = '';

  /** Action to take on click or enter keystroke */
  @Output() action = new EventEmitter();
}
