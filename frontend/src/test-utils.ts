export function findElementByXPath(
  path: string,
  contextNode: Node = document
): HTMLElement | null {
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
}

export function findElementWithText(
  tag: string,
  text: string,
  contextNode: Node = document
): HTMLElement | null {
  return findElementByXPath(
    `.//${tag}[.//*[contains(text(), "${text}")]]`,
    contextNode
  );
}

export function findButtonWithText(
  text: string,
  contextNode: Node = document
): HTMLElement | null {
  return findElementWithText('button', text, contextNode);
}
