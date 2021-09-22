import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';

import { ViewHeaderComponent } from './view-header.component';

describe('ViewHeaderComponent', () => {
  const TEXT = 'My text';
  const LABEL = 'date';

  let component: ViewHeaderComponent;
  let fixture: ComponentFixture<ViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewHeaderComponent],
      imports: [MatIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHeaderComponent);
    component = fixture.componentInstance;

    component.text = TEXT;
    component.label = LABEL;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct text', () => {
    expect(fixture.nativeElement.querySelector('span').innerText).toEqual(TEXT);
  });

  it('should go to previous', () => {
    const previousSpy = spyOn(component.previous, 'emit');
    getButton(0).click();
    expect(previousSpy).toHaveBeenCalled();
  });

  it('should go to next', () => {
    const nextSpy = spyOn(component.next, 'emit');
    getButton(1).click();
    expect(nextSpy).toHaveBeenCalled();
  });

  it('should have aria-label', () => {
    expect(
      fixture.nativeElement
        .querySelector('.view-header')
        .getAttribute('aria-label')
    ).toEqual(`${LABEL} navigation`);
  });

  function getButton(index: number): HTMLButtonElement {
    return fixture.nativeElement.querySelectorAll('button')[index];
  }
});
