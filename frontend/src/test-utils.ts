import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { MatButtonToggle } from "@angular/material/button-toggle";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatChip, MatChipInput, MatChipRemove } from "@angular/material/chips";
import { MatOption } from "@angular/material/core";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { By } from "@angular/platform-browser";

export function getTestUtils(fixtureRef: () => ComponentFixture<any>) {
  const findElementByXPath = (
    path: string,
    contextNode: Node = fixtureRef().nativeElement,
  ): HTMLElement | null => {
    const node = document.evaluate(
      path,
      contextNode,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue;
    return node && node.nodeType === Node.ELEMENT_NODE
      ? (node as HTMLElement)
      : null;
  };

  const findAllElementsByXPath = (
    path: string,
    contextNode: Node = fixtureRef().nativeElement,
  ): Array<HTMLElement> => {
    const elements = [];
    const snapshot = document.evaluate(
      path,
      contextNode,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );
    for (let i = 0; i < snapshot.snapshotLength; i++) {
      const node = snapshot.snapshotItem(i)!!;
      if (node.nodeType === Node.ELEMENT_NODE) {
        elements.push(node as HTMLElement);
      }
    }
    return elements;
  }

  const findElementWithText = (
    tag: string,
    text: string,
    contextNode: Node = fixtureRef().nativeElement,
  ): HTMLElement | null => {
    return findElementByXPath(
      `.//${tag}[.//*[contains(text(), "${text}")]]`,
      contextNode
    );
  };

  const findButtonWithText = (
    text: string,
    contextNode: Node = fixtureRef().nativeElement,
  ): HTMLElement | null => {
    return findElementWithText('button', text, contextNode);
  };

  const findFormFieldsWithLabel = (label: string): Array<DebugElement> => {
    return fixtureRef().debugElement
      .queryAll(By.directive(MatFormField))
      .filter((ff) => {
        return (
          (ff.query(By.directive(MatLabel)).nativeElement as HTMLElement)
            ?.innerText === label
        );
      });
  }

  const findInputWithPlaceholder = (placeholder: string): HTMLInputElement => {
    const fixture = fixtureRef();
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

  const findInputWithLabel = (label: string): HTMLInputElement | null => {
    return findFormFieldsWithLabel(label)[0]?.query(By.directive(MatInput))
      .nativeElement as HTMLInputElement;
  }

  const enterText = (input: HTMLInputElement, text: string): void => {
    input.value = text;
    fixtureRef().detectChanges();
    input.dispatchEvent(new Event('input'));
  }

  const openAutocomplete = async (input: HTMLInputElement): Promise<void> => {
    const fixture = fixtureRef();
    input.dispatchEvent(new Event('focusin'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  const findButtonToggle = (value: any): MatButtonToggle | null => {
    return (
      fixtureRef().debugElement
        .queryAll(By.directive(MatButtonToggle))
        .find((btn) => {
          return (btn.componentInstance as MatButtonToggle).value === value;
        })
        ?.injector.get(MatButtonToggle) ?? null
    );
  }

  const clickButtonToggle = (value: any): void => {
    findButtonToggle(value)!!._buttonElement.nativeElement.click();
    fixtureRef().detectChanges();
  }

  const clickCheckbox = (label: string): void => {
    const fixture = fixtureRef();
    const checkbox = fixture.debugElement
      .queryAll(By.directive(MatCheckbox))
      .find((chk) => (chk.nativeElement as HTMLElement).innerText === label)!!
      .componentInstance as MatCheckbox;
    checkbox._inputElement.nativeElement.click();
    fixture.detectChanges();
  }

  const findChip = (text: string): DebugElement | null => {
    return (
      fixtureRef().debugElement.queryAll(By.directive(MatChip)).find((chip) => {
        return (
          (chip.query(By.css('span')).nativeElement as HTMLElement)
            .innerText === text
        );
      }) ?? null
    );
  }

  const removeChip = (text: string): void => {
    const chip = findChip(text)!!;
    chip.query(By.directive(MatChipRemove)).nativeElement.click();
    fixtureRef().detectChanges();
  }

  const openSelect = (formFieldLabel: string): void => {
    const select = findFormFieldsWithLabel(formFieldLabel)[0]?.query(
      By.css('.mat-select-trigger')
    ).nativeElement as HTMLElement;
    select.click();
    fixtureRef().detectChanges();
  }

  const selectOption = (optionText: string): void => {
    findOption(optionText)!!.click();
    fixtureRef().detectChanges();
  }

  const findOption = (text: string): HTMLElement | null => {
    return (
      fixtureRef().debugElement
        .queryAll(By.directive(MatOption))
        .find((opt) => opt.nativeElement.innerText === text)?.nativeElement ??
      null
    );
  }

  const clickDocument = (): void => {
    document.dispatchEvent(new Event('click'));
    fixtureRef().detectChanges();
  }

  return {
    findElementByXPath,
    findAllElementsByXPath,
    findElementWithText,
    findButtonWithText,
    findFormFieldsWithLabel,
    findInputWithPlaceholder,
    findInputWithLabel,
    enterText,
    openAutocomplete,
    findButtonToggle,
    clickButtonToggle,
    clickCheckbox,
    findChip,
    removeChip,
    openSelect,
    selectOption,
    findOption,
    clickDocument,
  };
}