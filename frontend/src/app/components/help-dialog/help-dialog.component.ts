import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
} from '@angular/core';
import { HelpPageDirective } from 'src/app/directives/help-page.directive';
import { HelpPageComponent } from '../help-page/help-page.component';

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
})
export class HelpDialogComponent {
  private static STEP_CONTENTS = [
    `
      <h1 class="">Welcome to plan.</h1>
      <p>
        <b>plan.</b> ("plan-dot") is a personal planning tool that makes keeping track of your life
        easier than ever before.
      </p>
      <ul class="bullets">
        <li>
          Capture assignments, tasks, events, and notes in the form of <i>items</i>.
          Then, organize your items by placing them in <i>groups</i>.
        </li>
        <li>
          Assign dates, times, and locations to your items. Or don't!
        </li>
        <li>
          Sort, filter, and search
          to easily find and prioritize the things you need to do.
        </li>
        <li>
          View your items as a monthy calendar, or as a daily agenda.
        </li>
      </ul>
      <p>
        Continue to the next step to learn more about the features of <b>plan.</b>
      </p>
    `,
    `
      <h1>The group view</h1>
      <img src="assets/images/help_group_view.png">
    `,
  ];

  @ViewChild(HelpPageDirective) helpPageHost!: HelpPageDirective;

  get bubbles(): Array<boolean> {
    return Array(HelpDialogComponent.STEP_CONTENTS.length)
      .fill(0)
      .map((_, i) => i === this.step);
  }

  step = 0;

  constructor(
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.loadHelpPage(0);
  }

  goToNextStep(): void {
    const newStep = this.step + 1;
    this.loadHelpPage(newStep);
    this.step = newStep;
  }

  goToPreviousStep(): void {
    const newStep = this.step - 1;
    this.loadHelpPage(newStep);
    this.step = newStep;
  }

  private loadHelpPage(step: number): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(HelpPageComponent);
    const viewContainerRef = this.helpPageHost.viewContainerRef;
    viewContainerRef.clear();

    const instance =
      viewContainerRef.createComponent(componentFactory).instance;
    instance.direction = step > this.step ? 'left' : 'right';
    instance.content = HelpDialogComponent.STEP_CONTENTS[step];
    this.cdr.detectChanges();
  }
}
