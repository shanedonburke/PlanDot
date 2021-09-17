import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatChip,
  MatChipInput,
  MatChipRemove,
  MatChipsModule,
} from '@angular/material/chips';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Group } from 'src/app/domain/group';
import { Item, Repeat } from 'src/app/domain/item';
import { GroupService } from 'src/app/services/group.service';

import {
  ItemEditDialogComponent,
  ItemEditDialogData,
} from './item-edit-dialog.component';

describe('ItemEditDialogComponent', () => {
  let component: ItemEditDialogComponent;
  let fixture: ComponentFixture<ItemEditDialogComponent>;

  let item: Item;
  let groups: Array<Group>;
  let date: Date;

  let dialogRef: jasmine.SpyObj<MatDialogRef<ItemEditDialogComponent>>;
  let data: ItemEditDialogData;
  let groupService: jasmine.SpyObj<GroupService>;

  beforeEach(async () => {
    setup();

    await TestBed.configureTestingModule({
      declarations: [ItemEditDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: GroupService, useValue: groupService },
      ],
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatChipsModule,
        MatIconModule,
        MatAutocompleteModule,
        MatButtonToggleModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit title', () => {
    const title = 'New title';
    enterTitle(title);
    expect(component.data.item.title).toBe(title);
  });

  it('should edit description', () => {
    const description = 'New description';
    enterDescription(description);
    expect(component.data.item.description).toBe(description);
  });

  it('should edit location', () => {
    const location = 'New location';
    enterLocation(location);
    expect(component.data.item.location).toBe(location);
  });

  it('should have group chip', () => {
    expect(findChip(groups[0].name)).toBeTruthy();
  });

  it('should remove chip', () => {
    removeChip(groups[0].name);

    expect(component.data.item.groupIds)
      .withContext('should remove group from item')
      .toEqual([]);
  });

  it('should add group', async () => {
    const input = findInputWithPlaceholder('Add group');
    await openAutocomplete(input);

    selectOption(groups[1].name);
    expect(data.item.groupIds)
      .withContext('should add group to item')
      .toEqual([groups[0].id, groups[1].id]);

    await openAutocomplete(input);

    expect(findOption(groups[0].name))
      .withContext('should not show 1st group in autocomplete')
      .toBeFalsy();
    expect(findOption(groups[1].name))
      .withContext('should not show 2nd group in autocomplete')
      .toBeFalsy();
    expect(findOption(groups[2].name))
      .withContext('should show 3rd group in autocomplete')
      .toBeTruthy();
  });

  describe('with date enabled', () => {
    beforeEach(() => {
      clickCheckbox('Add date');
    });

    it('should have date enabled', () => {
      expect(component.data.item.isDateEnabled).toBeTrue();
    });

    it("should show today's date", () => {
      expect(findInputWithLabel('Date')?.value).toEqual(
        date.toLocaleDateString()
      );
    });

    it('should set date', () => {
      const newDate = new Date(2020, 1, 1);
      enterDate(newDate);

      expect(component.data.item.date).toEqual(newDate);
    });

    it('should repeat daily', async () => {
      openSelect('Repeat every');
      selectOption(Repeat.DAILY_WEEKLY);
      await fixture.whenStable();

      expect(component.data.item.repeat)
        .withContext('should set repeat property')
        .toEqual(Repeat.DAILY_WEEKLY);
      expect(fixture.debugElement.query(By.directive(MatButtonToggleGroup)))
        .withContext('should show toggle group')
        .toBeTruthy();

      clickButtonToggle(1);
      expect(component.data.item.weekdays.includes(1))
        .withContext('should remove Monday when clicked')
        .toBeFalse();

      clickButtonToggle(1);
      expect(component.data.item.weekdays.includes(1))
        .withContext('should re-add Monday when clicked')
        .toBeTrue();

      clickButtonToggle(0);
      expect(component.data.item.weekdays.includes(0))
        .withContext("should not be able to remove the item's initial day")
        .toBeTrue();

      clickButtonToggle(2);
      expect(component.data.item.weekdays.includes(2))
        .withContext('should remove Tuesday when clicked')
        .toBeFalse();

      enterDate(new Date('9/14/2021')); // Tuesday
      const tuesdayToggle = findButtonToggle(2)!!;
      expect(tuesdayToggle.disabled)
        .withContext('should disable Tuesday toggle')
        .toBeTrue();
      expect(tuesdayToggle.checked)
        .withContext('should check Tuesday toggle')
        .toBeTrue();

      clickButtonToggle(0);
      expect(component.data.item.weekdays.includes(0))
        .withContext('should now be able to remove Sunday')
        .toBeFalse();
    });

    describe('with start time enabled', () => {
      beforeEach(() => {
        clickCheckbox('Add start time');
      });

      it('should have start time enabled', () => {
        expect(component.data.item.isStartTimeEnabled).toBeTrue();
      });

      it('should show start time input', () => {
        expect(findFormFieldsWithLabel('Hours').length).toBe(1);
      });

      describe('with end time enabled', () => {
        beforeEach(() => {
          clickCheckbox('Add end time');
        });

        it('should have end time enabled', () => {
          expect(component.data.item.isEndTimeEnabled).toBeTrue();
        });

        it('should show end time input', () => {
          expect(findFormFieldsWithLabel('Hours').length).toBe(2);
        });
      });
    });
  });

  function setup(): void {
    date = new Date('9/19/2021'); // Sunday
    item = new Item({ date });
    groups = [
      new Group({ name: 'Group 1', itemIds: [item.id] }),
      new Group({ name: 'Group 2' }),
      new Group({ name: 'Group 3' }),
    ];
    item.groupIds = [groups[0].id];

    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    groupService = jasmine.createSpyObj('GroupService', [
      'getGroups',
      'getItemGroups',
    ]);
    data = { item };

    groupService.getGroups.and.returnValue(groups);
    groupService.getItemGroups.and.returnValue(
      groups.filter((g) => g.itemIds.includes(item.id))
    );
  }

  function enterTitle(title: string): void {
    const input = findInputWithPlaceholder('Item title');
    enterText(input, title);
  }

  function enterDescription(description: string): void {
    const input = findInputWithPlaceholder('Item description');
    enterText(input, description);
  }

  function enterLocation(location: string): void {
    const input = findInputWithPlaceholder('Location');
    enterText(input, location);
  }

  function enterText(input: HTMLInputElement, text: string): void {
    input.value = text;
    fixture.detectChanges();
    input.dispatchEvent(new Event('input'));
  }

  async function openAutocomplete(input: HTMLInputElement): Promise<void> {
    input.dispatchEvent(new Event('focusin'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function findInputWithPlaceholder(placeholder: string): HTMLInputElement {
    const inputs = [
      ...fixture.debugElement.queryAll(By.directive(MatInput)),
      ...fixture.debugElement.queryAll(By.directive(MatChipInput)),
    ];
    return inputs.find((inp) => {
      try {
        return inp.injector.get(MatInput).placeholder === placeholder;
      } catch {
        return inp.injector.get(MatChipInput).placeholder === placeholder;
      }
    })!!.nativeElement as HTMLInputElement;
  }

  function findInputWithLabel(label: string): HTMLInputElement | null {
    return findFormFieldsWithLabel(label)[0]?.query(By.directive(MatInput))
      .nativeElement as HTMLInputElement;
  }

  function openSelect(formFieldLabel: string): void {
    const select = findFormFieldsWithLabel(formFieldLabel)[0]?.query(
      By.css('.mat-select-trigger')
    ).nativeElement as HTMLElement;
    select.click();
    fixture.detectChanges();
  }

  function selectOption(optionText: string): void {
    findOption(optionText)!!.click();
    fixture.detectChanges();
  }

  function findOption(text: string): HTMLElement | null {
    return (
      fixture.debugElement
        .queryAll(By.directive(MatOption))
        .find((opt) => opt.nativeElement.innerText === text)?.nativeElement ??
      null
    );
  }

  function findButtonToggle(value: any): MatButtonToggle | null {
    return (
      fixture.debugElement
        .queryAll(By.directive(MatButtonToggle))
        .find((btn) => {
          return (btn.componentInstance as MatButtonToggle).value === value;
        })
        ?.injector.get(MatButtonToggle) ?? null
    );
  }

  function clickButtonToggle(value: any): void {
    findButtonToggle(value)!!._buttonElement.nativeElement.click();
    fixture.detectChanges();
  }

  function findFormFieldsWithLabel(label: string): Array<DebugElement> {
    return fixture.debugElement
      .queryAll(By.directive(MatFormField))
      .filter((ff) => {
        return (
          (ff.query(By.directive(MatLabel)).nativeElement as HTMLElement)
            ?.innerText === label
        );
      });
  }

  function clickCheckbox(label: string): void {
    const checkbox = fixture.debugElement
      .queryAll(By.directive(MatCheckbox))
      .find((chk) => (chk.nativeElement as HTMLElement).innerText === label)!!
      .componentInstance as MatCheckbox;
    checkbox._inputElement.nativeElement.click();
    fixture.detectChanges();
  }

  function findChip(text: string): DebugElement | null {
    return (
      fixture.debugElement.queryAll(By.directive(MatChip)).find((chip) => {
        return (
          (chip.query(By.css('span')).nativeElement as HTMLElement)
            .innerText === text
        );
      }) ?? null
    );
  }

  function removeChip(text: string): void {
    const chip = findChip(text)!!;
    chip.query(By.directive(MatChipRemove)).nativeElement.click();
    fixture.detectChanges();
  }

  function enterDate(date: Date): void {
    const input = findInputWithLabel('Date')!!;
    input.value = date.toDateString();
    fixture.detectChanges();
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }
});
