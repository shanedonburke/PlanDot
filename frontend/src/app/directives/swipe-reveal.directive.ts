import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[swipeReveal]',
})
export class SwipeRevealDirective {
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

  @HostListener('touchend')
  onTouchEnd() {
    const elem = this.element.nativeElement;
    if (elem.scrollLeft > 0 && elem.scrollLeft < elem.scrollWidth - elem.offsetWidth) {
      this.resetScroll();
    }
  }

  resetScroll(): void {
    this.element.nativeElement.scrollTo({left: 0, behavior: 'smooth'});
  }

  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.resetScroll();
  }
}
