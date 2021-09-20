import { ComponentFixture } from "@angular/core/testing";

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

  return {
    findElementByXPath,
    findElementWithText,
    findButtonWithText,
  };
}