export enum View {
  Group = 'group',
  Month = 'month',
  Day = 'day',
  ItemList = 'item_list'
}

export const VIEW_VALUES = Object.values<string>(View);

export function isView(view: string): view is View {
  return VIEW_VALUES.includes(view);
}