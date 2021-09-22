import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * A header bar that shows previous/next buttons and some text between them.
 */
@Component({
  selector: 'app-view-header',
  templateUrl: './view-header.component.html',
  styleUrls: ['./view-header.component.scss'],
})
export class ViewHeaderComponent {
  /** Text to display */
  @Input() text!: string;

  /** Accessibility label, e.g., "month" to create label "month navigation" */
  @Input() label!: string;

  /** Emits when the back arrow is clicked */
  @Output() previous = new EventEmitter();

  /** Emits when the next arrow is clicked */
  @Output() next = new EventEmitter();
  
  constructor() {}
}
