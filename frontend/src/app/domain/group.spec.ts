import { Group } from "./group";

describe('Group', () => {
  const BLACK = '#000000';
  const WHITE = '#ffffff';

  it('should create an instance', () => {
    expect(new Group()).toBeTruthy();
  });

  it('should have black text', () => {
    const group = new Group({ color: WHITE });
    expect(group.getTextColor()).toBe(BLACK);
  });

  it('should have white text', () => {
    const group = new Group({ color: BLACK });
    expect(group.getTextColor()).toBe(WHITE);
  });

  it('should get copy', () => {
    const group = new Group();
    const copy = group.getCopy();

    expect(group).withContext('should have same properties').toEqual(copy);
    expect(group).withContext('should not be same object').not.toBe(copy);
  })
})