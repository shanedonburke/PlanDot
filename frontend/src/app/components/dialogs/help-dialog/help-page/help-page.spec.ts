import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  HelpPageBaseComponent,
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

fdescribe('HelpPageIconWithTextComponent', () => {
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
