export function findElementByXPath(path: string): HTMLElement | null {
  const node = document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  return node && node.nodeType === Node.ELEMENT_NODE
    ? (node as HTMLElement)
    : null;
}

export function findElementWithText(tag: string, text: string): HTMLElement | null {
  return findElementByXPath(`//${tag}[.//*[contains(text(), "${text}")]]`)
}

export function findButtonWithText(text: string): HTMLElement | null {
  return findElementWithText('button', text);
}
