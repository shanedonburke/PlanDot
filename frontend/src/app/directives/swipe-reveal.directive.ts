import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swipeReveal]',
})
export class SwipeRevealDirective {
  private lastTouchX = 0;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {
    this.renderer.addClass(this.element.nativeElement, 'disable-scrollbar');
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.lastTouchX = event.changedTouches[0].clientX;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    const elem = this.element.nativeElement;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.lastTouchX;

    if (elem.scrollLeft - deltaX >= 0) {
      elem.scrollBy({ left: -deltaX });
    } else {
      this.resetScroll();
    }
    this.lastTouchX = touch.clientX;
  }

  @HostListener('touchend')
  onTouchEnd() {
    const elem = this.element.nativeElement;
    if (
      elem.scrollLeft > 0 &&
      elem.scrollLeft < elem.scrollWidth - elem.offsetWidth
    ) {
      this.resetScroll();
    }
  }

  resetScroll(): void {
    this.element.nativeElement.scrollTo({ left: 0, behavior: 'smooth' });
  }

  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.resetScroll();
  }
}
