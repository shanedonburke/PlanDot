import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swipeReveal]',
})
export class SwipeRevealDirective {
  private lastTouchX = 0;

  private onTouchStart = (event: TouchEvent) => {
    this.lastTouchX = event.touches[0].clientX;
    this.addEventListener('touchmove', this.onTouchMove);
    this.addEventListener('touchend', this.onTouchEnd);
    this.removeAllListeners!!('touchstart');
  };

  private onTouchMove = (event: TouchEvent) => {
    const elem = this.element.nativeElement;
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.lastTouchX;

    if (elem.scrollLeft - deltaX >= 0) {
      // elem.scrollBy({ left: -deltaX });
    } else {
      // elem.scrollLeft = 0;
    }
    this.lastTouchX = touch.clientX;
    if (elem.scrollLeft <= 0) {
      // elem.style.backgroundColor = 'white';
      // event.preventDefault();
    } else {
      // elem.style.backgroundColor = 'red';
    }
  };

  private onTouchEnd = (_: TouchEvent) => {
    const elem = this.element.nativeElement;
    if (elem.scrollLeft > 0) {
      if (elem.scrollLeft < 50) {
        this.scrollToBeginning();
      } else {
        this.scrollToEnd();
      }
    }
    this.removeAllListeners('touchmove');
    this.removeAllListeners('touchend');
    this.addEventListener('touchstart', this.onTouchStart);
  };

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {
    this.renderer.addClass(this.element.nativeElement, 'disable-scrollbar');
  }

  ngOnInit() {
    this.element.nativeElement.addEventListener(
      'touchstart',
      this.onTouchStart
    );
  }

  scrollToBeginning(): void {
    this.scrollTo(0);
  }

  scrollToEnd(): void {
    const elem = this.element.nativeElement;
    this.scrollTo(50);
  }

  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.scrollToBeginning();
  }

  private scrollTo(x: number): void {
    this.element.nativeElement.scrollTo({ left: x, behavior: 'smooth' });
  }

  private addEventListener<K extends keyof GlobalEventHandlersEventMap>(
    eventName: K,
    handler: (event: GlobalEventHandlersEventMap[K]) => void
  ): void {
    this.element.nativeElement.addEventListener(eventName, handler, {
      passive: true,
    });
  }

  private removeAllListeners(eventName: string): void {
    this.element.nativeElement.removeAllListeners!!(eventName);
  }
}
