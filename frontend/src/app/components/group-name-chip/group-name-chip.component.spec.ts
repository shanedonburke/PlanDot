import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNameChipComponent } from './group-name-chip.component';

describe('GroupNameChipComponent', () => {
  let component: GroupNameChipComponent;
  let fixture: ComponentFixture<GroupNameChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupNameChipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupNameChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
