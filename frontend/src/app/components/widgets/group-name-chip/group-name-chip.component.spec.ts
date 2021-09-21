import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Group } from 'src/app/domain/group';

import { GroupNameChipComponent } from './group-name-chip.component';

describe('GroupNameChipComponent', () => {
  let component: GroupNameChipComponent;
  let fixture: ComponentFixture<GroupNameChipComponent>;

  let group: Group;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [GroupNameChipComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupNameChipComponent);
    component = fixture.componentInstance;
    component.group = group;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct text', () => {
    expect(fixture.nativeElement.innerText).toContain(group.name);
  });

  function setup(): void {
    group = new Group({ name: 'My Group' });
  }
});
