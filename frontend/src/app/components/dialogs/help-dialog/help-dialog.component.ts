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

@Component({
  selector: 'app-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss'],
})
export class HelpDialogComponent {
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

  @ViewChild(HelpPageDirective) helpPageHost!: HelpPageDirective;

  get bubbles(): Array<boolean> {
    return Array(HelpDialogComponent.HELP_PAGES.length)
      .fill(0)
      .map((_, i) => i === this.pageIndex);
  }

  pageIndex = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<HelpDialogComponent>,
    private readonly componentFactoryResolver: ComponentFactoryResolver,
    private readonly cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngAfterViewInit(): void {
    // Adding this style in SCSS will make it apply to all subsequent dialogs
    this.document
      .querySelector('mat-dialog-container')!!
      .setAttribute('style', 'height: 90vh !important');
      
    this.loadHelpPage(0);
  }

  goToNextPage(): void {
    const newStep = this.pageIndex + 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }

  goToPreviousPage(): void {
    const newStep = this.pageIndex - 1;
    this.loadHelpPage(newStep);
    this.pageIndex = newStep;
  }

  hasNextPage(): boolean {
    return this.pageIndex < HelpDialogComponent.HELP_PAGES.length - 1;
  }

  hasPreviousPage(): boolean {
    return this.pageIndex > 0;
  }

  private loadHelpPage(step: number): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        HelpDialogComponent.HELP_PAGES[step]
      );
    const viewContainerRef = this.helpPageHost.viewContainerRef;
    viewContainerRef.clear();

    const instance =
      viewContainerRef.createComponent(componentFactory).instance;
    instance.direction = step > this.pageIndex ? 'left' : 'right';

    if (componentFactory.componentType === HelpPageFinalComponent) {
      (instance as HelpPageFinalComponent).closeDialog.subscribe(() => {
        this.dialogRef.close();
      });
    }

    this.cdr.detectChanges();
  }
}
