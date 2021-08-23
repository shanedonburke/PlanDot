import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupToolbarComponent } from './group-toolbar.component';

describe('GroupToolbarComponent', () => {
  let component: GroupToolbarComponent;
  let fixture: ComponentFixture<GroupToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupToolbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
