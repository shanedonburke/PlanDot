import { v4 } from 'uuid';
import { deepCopy } from '../util/deep-copy';

export function isGroupJson(obj: any): obj is Group {
  return typeof obj === 'object' && 'itemIds' in obj;
}

/**
 * Object representing a {@link Group}.
 */
export interface GroupJson {
  id: string;
  name: string;
  color: string;
  itemIds: Array<string>;
}

/**
 * A group is an entity that contains a list of items.
 * Groups can be viewed and created in the group view.
 */
export class Group implements GroupJson {
  /** UUID */
  id = v4();

  /** Name of the group */
  name = 'New group';

  /** Hex color associated with the group */
  color = Group.generateColor();

  /** IDs of items in the group */
  itemIds: Array<string> = [];

  constructor(groupJson: Partial<GroupJson> = {}) {
    Object.assign(this, groupJson);
  }

  /**
   * @returns The appropriate text color (white or black) to use against
   *    the group's background color.
   */
  getTextColor(): string {
    // Color luminance formula
    const red = parseInt(this.color.substr(1, 2), 16);
    const green = parseInt(this.color.substr(3, 2), 16);
    const blue = parseInt(this.color.substr(5, 2), 16);
    return red * 0.299 + green * 0.587 + blue * 0.114 > 186
      ? '#000000'
      : '#ffffff';
  }

  /**
   * @returns A deep copy of the group
   */
  getCopy(): Group {
    return new Group(deepCopy(this));
  }

  /**
   * @returns A random hex color string
   */
  private static generateColor(): string {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  }
}
