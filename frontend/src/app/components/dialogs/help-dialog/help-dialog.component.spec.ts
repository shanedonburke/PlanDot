import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { HelpPageDirective } from 'src/app/directives/help-page.directive';

import { HelpDialogComponent } from './help-dialog.component';
import {
  HelpPage0Component,
  HelpPage1Component,
} from './help-pages/help-pages';

describe('HelpDialogComponent', () => {
  let component: HelpDialogComponent;
  let fixture: ComponentFixture<HelpDialogComponent>;

  let dialogRef: jasmine.SpyObj<MatDialogRef<HelpDialogComponent>>;
  let doc: jasmine.SpyObj<Document>;
  let element: jasmine.SpyObj<Element>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [HelpDialogComponent, HelpPageDirective],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: Document, useValue: doc },
      ],
      imports: [MatIconModule, MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get bubbles', () => {
    const bubbles = component.bubbles;
    expect(bubbles.length)
      .withContext('wrong number of bubbles')
      .toEqual(HelpDialogComponent.HELP_PAGES.length);
    expect(bubbles[0]).withContext('first bubble should be active').toBeTrue();
    expect(bubbles[1])
      .withContext('second bubble should be inactive')
      .toBeFalse();
  });

  it('should set dialog container height', () => {
    expect(element.setAttribute).toHaveBeenCalledTimes(1);
  });

  it('should create help page', () => {
    expect(
      fixture.debugElement.query(By.directive(HelpPage0Component))
    ).toBeTruthy();
  });

  it('should not show back button on first page', () => {
    expect(findBackButton()?.classes.invisible).toBeTruthy();
  });

  it('should show next button on first page', () => {
    expect(findNextButton()?.classes.invisible).toBeFalsy();
  });

  it('should go to next page', () => {
    findNextButton()?.nativeElement.click();
    fixture.detectChanges();
    expect(findBackButton()?.classes.invisible)
      .withContext('should show back button')
      .toBeFalsy();
    expect(fixture.debugElement.query(By.directive(HelpPage1Component)))
      .withContext('should show 2nd help page')
      .toBeTruthy();
  });

  it('should hide next button on last page', () => {
    for (let i = 0; i < HelpDialogComponent.HELP_PAGES.length - 1; i++) {
      findNextButton()?.nativeElement.click();
      fixture.detectChanges();
    }
    expect(findNextButton()?.classes.invisible).toBeTruthy();
  });

  function setup() {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    doc = jasmine.createSpyObj('Document', ['querySelector']);
    element = jasmine.createSpyObj('Element', ['setAttribute']);

    doc.querySelector.and.returnValue(element);
  }

  function findBackButton(): DebugElement | null {
    return findButtonWithIcon('chevron_left');
  }

  function findNextButton(): DebugElement | null {
    return findButtonWithIcon('chevron_right');
  }

  function findButtonWithIcon(icon: string): DebugElement | null {
    return (
      fixture.debugElement
        .queryAll(By.css('button'))
        .find((el) =>
          (el.nativeElement as HTMLElement).innerHTML.includes(icon)
        ) ?? null
    );
  }
});
