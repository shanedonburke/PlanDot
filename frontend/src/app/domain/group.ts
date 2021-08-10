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
