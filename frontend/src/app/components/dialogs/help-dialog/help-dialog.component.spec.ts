import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HelpPageDirective } from 'src/app/directives/help-page.directive';

import { HelpDialogComponent } from './help-dialog.component';

fdescribe('HelpDialogComponent', () => {
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

  function setup() {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    doc = jasmine.createSpyObj('Document', ['querySelector']);
    element = jasmine.createSpyObj('Element', ['setAttribute']);

    doc.querySelector.and.returnValue(element);
  }
});
