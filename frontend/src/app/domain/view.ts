/**
 * Represents the views available to the user. The value of each view in
 * this enum is the value used in the `view` query parameter.
 */
export enum View {
  Group = 'group',
  Month = 'month',
  Day = 'day',
  ItemList = 'item_list',
}

/** The valid values for the `view` query parameter */
export const VIEW_VALUES = Object.values<string>(View);

/**
 * Verifies that the given string is a valid value for the
 * `view` query parameter.
 * @param view A potential value of the `view` query parameter
 * @returns True if the string represents a known view, false otherwise
 */
export function isView(view: string): view is View {
  return VIEW_VALUES.includes(view);
}
