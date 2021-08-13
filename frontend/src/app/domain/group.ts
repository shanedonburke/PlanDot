export function isGroup(obj: any): obj is Group {
  return (
    typeof obj === 'object' && 'id' in obj && 'name' in obj && 'color' in obj
  );
}

export interface Group {
  id: string;
  name: string;
  color: string;
  itemIds: Array<string>;
}

export function getGroupTextColor(group: Group): string {
  const red = parseInt(group.color.substr(1, 2), 16);
  const green = parseInt(group.color.substr(3, 2), 16);
  const blue = parseInt(group.color.substr(5, 2), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 186
    ? '#000000'
    : '#ffffff';
}