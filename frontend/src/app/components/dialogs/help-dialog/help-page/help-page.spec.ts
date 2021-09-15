import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  HelpPageBaseComponent,
  HelpPageFinalComponent,
  HelpPageIconWithTextComponent,
} from './help-page';

describe('HelpPageBaseComponent', () => {
  let component: HelpPageBaseComponent;
  let fixture: ComponentFixture<HelpPageBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpPageBaseComponent],
      imports: [NoopAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    const title = 'Title';
    component.title = title;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toEqual(
      title
    );
  });
});

describe('HelpPageIconWithTextComponent', () => {
  let component: HelpPageIconWithTextComponent;
  let fixture: ComponentFixture<HelpPageIconWithTextComponent>;

  const ICON = 'filter_list';
  const TEXT = 'Filter';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpPageIconWithTextComponent],
      imports: [MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageIconWithTextComponent);
    component = fixture.componentInstance;

    component.icon = ICON;
    component.text = TEXT;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct icon', () => {
    expect(fixture.nativeElement.querySelector('mat-icon').innerText).toEqual(
      ICON
    );
  });

  it('should have correct text', () => {
    expect(fixture.nativeElement.querySelector('b').innerText).toEqual(TEXT);
  });
});

describe('HelpPageFinalComponent', () => {
  let component: HelpPageFinalComponent;
  let fixture: ComponentFixture<HelpPageFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HelpPageFinalComponent, HelpPageBaseComponent],
      imports: [NoopAnimationsModule, MatButtonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    const spy = spyOn(component.closeDialog, 'emit');
    fixture.debugElement.query(By.css('button')).triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});
