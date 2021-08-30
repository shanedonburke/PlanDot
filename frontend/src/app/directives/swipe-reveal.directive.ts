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

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.lastTouchX = event.changedTouches[0].clientX;
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    const elem = this.element.nativeElement;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - this.lastTouchX;

    if (elem.scrollLeft - deltaX >= 0) {
      elem.scrollBy({ left: -deltaX });
    } else {
      this.scrollToBeginning();
    }
    this.lastTouchX = touch.clientX;
  }

  @HostListener('touchend')
  onTouchEnd() {
    const elem = this.element.nativeElement;
    if (elem.scrollLeft > 0) {
      if (elem.scrollLeft < elem.scrollWidth - elem.offsetWidth - 10) {
        this.scrollToBeginning();
      } else {
        this.scrollToEnd();
      }
    }
  }

  scrollToBeginning(): void {
    this.scrollTo(0);
  }

  scrollToEnd(): void {
    const elem = this.element.nativeElement;
    this.scrollTo(elem.scrollWidth - elem.offsetWidth);
  }

  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.scrollToBeginning();
  }

  private scrollTo(x: number): void {
    this.element.nativeElement.scrollTo({ left: x, behavior: 'smooth' });
  }
}
