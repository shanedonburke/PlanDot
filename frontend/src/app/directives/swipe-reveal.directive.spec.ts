import { Component, DebugElement, ElementRef, Renderer2 } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SwipeRevealDirective } from './swipe-reveal.directive';

@Component({
  template: `
    <div id="parent">
      <div swipeReveal id="swipe"></div>
    </div>
  `,
})
class TestComponent {}

describe('SwipeRevealDirective', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent, SwipeRevealDirective],
    });
    fixture = TestBed.createComponent(TestComponent);
  });

  it('should handle mouse wheel', () => {
    const scrollTopSpy = spyOnParentScrollTop();
    const event = jasmine.createSpyObj('WheelEvent', ['preventDefault'], {
      deltaY: 10,
    }) as WheelEvent;

    getDirectiveElem().triggerEventHandler('mousewheel', event);
    expect(scrollTopSpy).toHaveBeenCalledWith(10);
  });

  it('should scroll parent on touch move', () => {
    const parentScrollTopSpy = spyOnParentScrollTop();
    const scrollLeftSpy = spyOnDirectiveScrollLeft(0);

    doTouchStart();
    doTouchMove(0, -10);

    expect(parentScrollTopSpy)
      .withContext('should scroll vertically on parent')
      .toHaveBeenCalledOnceWith(10);
    expect(scrollLeftSpy)
      .withContext('should *not* scroll horizontally on directive element')
      .not.toHaveBeenCalled();
  });

  it('should reveal panel on touch move', () => {
    const parentScrollTopSpy = spyOnParentScrollTop();
    const scrollLeftSpy = spyOnDirectiveScrollLeft(0);

    doTouchStart();
    doTouchMove(-10, 0);

    expect(parentScrollTopSpy)
      .withContext('should *not* scroll vertically on parent')
      .not.toHaveBeenCalled();
    expect(scrollLeftSpy)
      .withContext('should scroll horizontally on directive element')
      .toHaveBeenCalledOnceWith(10);
  });

  it('should hide panel on touch end', () => {
    spyOnDirectiveScrollLeft(10);
    const scrollToSpy = spyOnScrollTo();

    doTouchEnd();
    fixture.detectChanges();

    expect(scrollToSpy)
      .withContext('should scroll to beginning on touch end')
      .toHaveBeenCalledOnceWith({ left: 0, behavior: 'smooth' });
  });

  it('should show panel on touch end', () => {
    spyOnDirectiveScrollLeft(100);
    const scrollToSpy = spyOnScrollTo();

    doTouchEnd();
    fixture.detectChanges();

    expect(scrollToSpy)
      .withContext('should scroll to beginning on touch end')
      .toHaveBeenCalledOnceWith({
        left: getDirective().hiddenPanelWidth,
        behavior: 'smooth',
      });
  });

  it('should scroll to beginning', () => {
    const scrollToSpy = spyOnScrollTo();

    document.dispatchEvent(new Event('mousedown'));

    expect(scrollToSpy).toHaveBeenCalledOnceWith({
      left: 0,
      behavior: 'smooth',
    });
  });

  function getDirectiveElem(): DebugElement {
    return fixture.debugElement.query(By.css('#swipe'));
  }

  function getParentElem(): HTMLElement {
    return fixture.nativeElement.querySelector('#parent');
  }

  function getDirective(): SwipeRevealDirective {
    return getDirectiveElem().injector.get(SwipeRevealDirective);
  }

  function doTouchStart(): void {
    getDirectiveElem().triggerEventHandler(
      'touchstart',
      createTouchEvent(0, 0)
    );
  }

  function doTouchMove(x: number, y: number): void {
    getDirectiveElem().triggerEventHandler('touchmove', createTouchEvent(x, y));
  }

  function doTouchEnd(): void {
    document.dispatchEvent(new Event('touchend'));
  }

  function spyOnParentScrollTop(): jasmine.Spy {
    return spyOnProperty(getParentElem(), 'scrollTop', 'set');
  }

  function spyOnDirectiveScrollLeft(val: number): jasmine.Spy {
    const elem = getDirectiveElem().nativeElement;
    spyOnProperty(elem, 'scrollLeft', 'get').and.returnValue(val);
    return spyOnProperty(elem, 'scrollLeft', 'set');
  }

  function spyOnScrollTo(): jasmine.Spy {
    return spyOn(getDirectiveElem().nativeElement, 'scrollTo');
  }

  function createTouchEvent(clientX: number, clientY: number): TouchEvent {
    const touch = { clientX, clientY } as Touch;
    return {
      preventDefault: jasmine.createSpy('preventDefault'),
      touches: [touch],
    } as unknown as TouchEvent;
  }
});
