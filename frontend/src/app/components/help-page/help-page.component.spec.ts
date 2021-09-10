import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpPageBaseComponent } from './help-page.component';

describe('HelpPageComponent', () => {
  let component: HelpPageBaseComponent;
  let fixture: ComponentFixture<HelpPageBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HelpPageBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpPageBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
