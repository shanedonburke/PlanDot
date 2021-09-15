import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { slideIn } from './help-page-animations';

/**
 * Base component for a page in the help dialog.
 */
@Component({
  selector: 'app-help-page-base',
  styleUrls: ['./help-page.component.scss'],
  animations: [slideIn],
  templateUrl: './help-page.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HelpPageBaseComponent {
  /** Direction of the slide-in animation */
  @Input('direction') direction = '';

  /** Page title */
  @Input('title') title = '';
}

/**
 * Convenience component for showing some text next to an icon.
 * Meant to be used within a block of text.
 */
@Component({
  selector: 'app-help-page-icon-with-text',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <span
      class="inline-flex align-middle items-center mr-[2px] -translate-y-px"
    >
      <mat-icon class="material-icons-outlined mr-1">{{ icon }}</mat-icon
      ><b>{{ text }}</b>
    </span>
  `,
})
export class HelpPageIconWithTextComponent {
  /** Material icon name */
  @Input('icon') icon!: string;

  /** Text to be shown next to icon */
  @Input('text') text!: string;
}

/**
 * The text 'Group View' next to the group view icon.
 */
@Component({
  selector: 'app-help-page-group-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="view_agenda" text="Group view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageGroupViewComponent {}

/**
 * The text 'Month view' next to the month view icon.
 */
@Component({
  selector: 'app-help-page-month-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="calendar_view_month" text="Month view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageMonthViewComponent {}

/**
 * The text 'Day view' next to the day view icon.
 */
@Component({
  selector: 'app-help-page-day-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="calendar_view_day" text="Day view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageDayViewComponent {}

/**
 * The text 'Item list view' next to the item list view icon.
 */
@Component({
  selector: 'app-help-page-item-list-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="view_list" text="Item list view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageItemListViewComponent {}

/**
 * A page in the help dialog with no content.
 * Meant to be extended by other pages.
 */
@Component({ template: '' })
export class HelpPageComponent {
  /** Direction of the slide-in animation */
  @Input('direction') direction = '';
}

/**
 * The introductory help page.
 */
@Component({
  selector: 'app-help-page-0',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-0.component.html',
})
export class HelpPage0Component extends HelpPageComponent {}

/**
 * The help page for the group view.
 */
@Component({
  selector: 'app-help-page-1',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-1.component.html',
})
export class HelpPage1Component extends HelpPageComponent {}

/**
 * The help page for creating items.
 */
@Component({
  selector: 'app-help-page-2',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-2.component.html',
})
export class HelpPage2Component extends HelpPageComponent {}

/**
 * The help page for the month view.
 */
@Component({
  selector: 'app-help-page-3',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-3.component.html',
})
export class HelpPage3Component extends HelpPageComponent {}

/**
 * The help page for the day view.
 */
@Component({
  selector: 'app-help-page-4',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-4.component.html',
})
export class HelpPage4Component extends HelpPageComponent {}

/**
 * The help page for the item list view.
 */
@Component({
  selector: 'app-help-page-5',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-5.component.html',
})
export class HelpPage5Component extends HelpPageComponent {}

/**
 * The help page for undo/redo.
 */
@Component({
  selector: 'app-help-page-6',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-6.component.html',
})
export class HelpPage6Component extends HelpPageComponent {}

/**
 * The final help page. Has a button to close the dialog.
 */
@Component({
  selector: 'app-help-page-final',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-final.component.html',
})
export class HelpPageFinalComponent extends HelpPageComponent {
  /** Emits when the 'Close' button is clicked */
  @Output() closeDialog = new EventEmitter();
}