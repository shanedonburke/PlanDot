import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swipeReveal]',
})
export class SwipeRevealDirective {
  @Input('hiddenPanelWidth') hiddenPanelWidth = 50;

  private scrollTimeout: any;
  private lastTouch!: Touch;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {
    this.renderer.addClass(this.element.nativeElement, 'disable-scrollbar');
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const parent = this.element.nativeElement.parentElement;
    if (parent !== null) {
      parent.scrollTop += event.deltaY;
    }
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.lastTouch = event.touches[0];
  }

  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    const elem = this.element.nativeElement;
    const touch = event.touches[0];

    const deltaX = touch.clientX - this.lastTouch.clientX;
    const deltaY = touch.clientY - this.lastTouch.clientY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      elem.scrollLeft -= deltaX;
    } else {
      const parent = elem.parentElement;
      if (parent !== null) {
        parent.scrollTop -= deltaY;
      }
    }
    this.lastTouch = touch;
  }

  @HostListener('document:touchend')
  onTouchEnd() {
    const elem = this.element.nativeElement;
    if (elem.scrollLeft > 0) {
      if (elem.scrollLeft < this.hiddenPanelWidth - 1) {
        this.scrollToBeginning();
      } else {
        this.scrollToEnd();
      }
    }
  }

  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.scrollToBeginning();
  }

  private scrollToBeginning(): void {
    this.scrollTo(0);
  }

  private scrollToEnd(): void {
    this.scrollTo(this.hiddenPanelWidth);
  }

  private scrollTo(x: number): void {
    this.element.nativeElement.scrollTo({ left: x, behavior: 'smooth' });
  }
}
