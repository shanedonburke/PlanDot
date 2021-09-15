import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
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
  @Input('title') title = '';
}

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
  @Input('icon') icon!: string;
  @Input('text') text!: string;
}

@Component({
  selector: 'app-help-page-group-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="view_agenda" text="Group view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageGroupViewComponent {}

@Component({
  selector: 'app-help-page-month-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="calendar_view_month" text="Month view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageMonthViewComponent {}

@Component({
  selector: 'app-help-page-day-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="calendar_view_day" text="Day view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageDayViewComponent {}

@Component({
  selector: 'app-help-page-item-list-view',
  styleUrls: ['./help-page.component.scss'],
  template: `
    <app-help-page-icon-with-text icon="view_list" text="Item list view">
    </app-help-page-icon-with-text>
  `,
})
export class HelpPageItemListViewComponent {}

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

@Component({
  selector: 'app-help-page-2',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-2.component.html',
})
export class HelpPage2Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-3',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-3.component.html',
})
export class HelpPage3Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-4',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-4.component.html',
})
export class HelpPage4Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-5',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-5.component.html',
})
export class HelpPage5Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-6',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-6.component.html',
})
export class HelpPage6Component extends HelpPageComponent {}

@Component({
  selector: 'app-help-page-final',
  styleUrls: ['./help-page.component.scss'],
  templateUrl: './help-page-templates/help-page-final.component.html',
})
export class HelpPageFinalComponent extends HelpPageComponent {
  @Output() closeDialog = new EventEmitter();
}