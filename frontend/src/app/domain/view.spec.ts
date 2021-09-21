import { isView, VIEW_VALUES } from './view';

describe('View', () => {
  VIEW_VALUES.forEach((view) => {
    it(`${view} should be a view`, () => {
      expect(isView(view)).toBeTrue();
    });
  });

  it('should not be view', () => {
    expect(isView('not a view')).toBeFalse();
  });
});
