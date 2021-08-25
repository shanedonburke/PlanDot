export function deepCopy(obj: any): any {
  let copy: any;

  if (null == obj || 'object' != typeof obj) {
    return obj;
  } else if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  } else if (obj instanceof Array) {
    copy = [];
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepCopy(obj[i]);
    }
    return copy;
  } else if (obj instanceof Object) {
    copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = deepCopy(obj[attr]);
      }
    }
    return copy;
  } else {
    throw new Error('Unable to copy object! Its type isn\'t supported.');
  }
}
