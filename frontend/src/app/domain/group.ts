import { v4 } from 'uuid';
import { deepCopy } from '../util/deep-copy';

export function isGroupJson(obj: any): obj is Group {
  return typeof obj === 'object' && 'itemIds' in obj;
}

export interface GroupJson {
  id: string;
  name: string;
  color: string;
  itemIds: Array<string>;
}

export class Group implements GroupJson {
  id = v4();
  name = 'New group';
  color = Group.generateColor();
  itemIds: Array<string> = [];

  constructor(groupJson: Partial<GroupJson> = {}) {
    Object.assign(this, groupJson);
    while (this.color === '#ffffff') {
      this.color = Group.generateColor();
    }
  }

  getTextColor(): string {
    const red = parseInt(this.color.substr(1, 2), 16);
    const green = parseInt(this.color.substr(3, 2), 16);
    const blue = parseInt(this.color.substr(5, 2), 16);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186
      ? '#000000'
      : '#ffffff';
  }

  getDeepCopy(): Group {
    return new Group(deepCopy(this));
  }

  private static generateColor(): string {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
  }
}
