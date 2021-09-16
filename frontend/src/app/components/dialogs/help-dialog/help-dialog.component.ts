import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Inject,
  ViewChild,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HelpPageDirective } from 'src/app/directives/help-page.directive';
import {
  HelpPage0Component,
  HelpPage1Component,
  HelpPage2Component,
  HelpPage3Component,
  HelpPage4Component,
  HelpPage5Component,
  HelpPage6Component,
  HelpPageFinalComponent,
} from './help-pages/help-pages';

/**
 * A dialog shown when the user clicks the help button.
 * Contains multiple pages of help text for the user to read.
 */
@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
})
export class HelpDialogComponent {
  /** Components to load for each help page */
  static HELP_PAGES = [
    HelpPage0Component,
    HelpPage1Component,
    HelpPage2Component,
    HelpPage3Component,
    HelpPage4Component,
    HelpPage5Component,
    HelpPage6Component,
    HelpPageFinalComponent,
  ];

  /** The container for each dynamically-loaded help page */
  @ViewChild(HelpPageDirective) helpPageHost!: HelpPageDirective;

  /**
   * The SVG elements that indicate which page the user is on.
   * The active page's bubble is `true`, while all others are `false`.
   */
  get bubbles(): Array<boolean> {
    return Array(HelpDialogComponent.HELP_PAGES.length)
      .fill(0)
      .map((_, i) => i === this.pageIndex);
  }

  /** Index of the current help page */
  pageIndex = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<HelpDialogComponent>,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly cdr: ChangeDetectorRef,
    private readonly document: Document
  ) {}

  ngAfterViewInit(): void {
    // Adding this style in SCSS will make it apply to all subsequent dialogs
    this.document
      .querySelector('mat-dialog-container')!!
      .setAttribute('style', 'height: 90vh !important');
      
    this.loadHelpPage(0);
  }

  /**
   * Go to the next page of help text.
   */
  goToNextPage(): void {
    const newStep = this.pageIndex + 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }

  /**
   * Go to the previous page of help text.
   */
  goToPreviousPage(): void {
    const newStep = this.pageIndex - 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }

  /**
   * @returns false if the user is on the final page of help text
   */
  hasNextPage(): boolean {
    return this.pageIndex < HelpDialogComponent.HELP_PAGES.length - 1;
  }

  /**
   * @returns false if the user is on the first page of help text
   */
  hasPreviousPage(): boolean {
    return this.pageIndex > 0;
  }

  /**
   * Loads the help page at the given index.
   * @param pageIndex The index of the help page to load
   */
  private loadHelpPage(pageIndex: number): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        HelpDialogComponent.HELP_PAGES[pageIndex]
      );
    const viewContainerRef = this.helpPageHost.viewContainerRef;
    viewContainerRef.clear();

    const instance =
      viewContainerRef.createComponent(componentFactory).instance;

    // Set animation direction to indicate 'next' vs. 'back' movement
    instance.direction = pageIndex > this.pageIndex ? 'left' : 'right';

    // The final help page has a button to close the dialog, so we need to
    // subscribe to the button's click event
    if (componentFactory.componentType === HelpPageFinalComponent) {
      (instance as HelpPageFinalComponent).closeDialog.subscribe(() => {
        this.dialogRef.close();
      });
    }
    this.cdr.detectChanges();
  }
}
