export function getElementByXPath(path: string): HTMLElement | null {
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
