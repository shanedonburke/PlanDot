import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IconButtonComponent } from './icon-button.component';

describe('IconButtonComponent', () => {
  const SIZE = '32px';
  const ICON = 'filter_list';

  let component: IconButtonComponent;
  let fixture: ComponentFixture<IconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconButtonComponent ],
      imports: [MatButtonModule, MatIconModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconButtonComponent);
    component = fixture.componentInstance;

    component.size = SIZE;
    component.icon = ICON;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct icon', () => {
    expect(fixture.nativeElement.innerText).toContain(ICON);
  });

  it('should have correct size', () => {
    const iconEl = fixture.nativeElement.querySelector('mat-icon');
    expect(iconEl.style.fontSize).withContext('wrong font size').toBe(SIZE);
    expect(iconEl.style.width).withContext('wrong width').toBe(SIZE);
    expect(iconEl.style.height).withContext('wrong height').toBe(SIZE);
  })
});
