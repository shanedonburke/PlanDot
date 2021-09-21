import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

/**
 * This directive can be applied to configure a hidden panel
 * that is revealed when the user swipes (i.e., by touch) to the left
 * on the host element. The revealed panel is then hidden on the next click.
 */
@Directive({
  selector: '[swipeReveal]',
})
export class SwipeRevealDirective {
  /** The desired width of the panel (when revealed) in pixels */
  @Input('hiddenPanelWidth') hiddenPanelWidth = 50;

  /** The last recorded touch that occurred on the host element */
  private lastTouch!: Touch;

  constructor(
    private readonly element: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {
    // Hide horizontal scrollbar
    this.renderer.addClass(this.element.nativeElement, 'disable-scrollbar');
  }

  /**
   * When the mouse wheel is used, scroll the parent element instead, and only
   * on the vertical axis. This prevents the user from revealing the delete
   * button with the mouse wheel.
   * @param event Mouse wheel event
   */
  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    const parent = this.element.nativeElement.parentElement;
    if (parent !== null) {
      parent.scrollTop += event.deltaY;
    }
  }

  /**
   * Record the location of the touch start to determine the
   * direction/distance of subsequent swiping.
   * @param event Touch event
   */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    this.lastTouch = event.touches[0];
  }

  /**
   * Handle swiping motions. Motions that are mostly horizontal will reveal
   * the delete button, while vertical swiping will scroll the parent element.
   * @param event Touch event
   */
  @HostListener('touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    event.preventDefault();
    const elem = this.element.nativeElement;
    const touch = event.touches[0];

    // Determine dominant axis of swiping
    const deltaX = touch.clientX - this.lastTouch.clientX;
    const deltaY = touch.clientY - this.lastTouch.clientY;

    // Only scroll in the dominant axis (never diagonally)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Swipe to reveal or hide the hidden panel (based on direction)
      elem.scrollLeft -= deltaX;
    } else {
      const parent = elem.parentElement;
      if (parent !== null) {
        parent.scrollTop -= deltaY;
      }
    }
    this.lastTouch = touch;
  }

  /**
   * Hide the hidden panel if the user only swiped to reveal part of it.
   * If the user swiped to reveal the entire panel, the panel will remain
   * at {@link hiddenPanelWidth} pixels.
   * 
   * `document:touchend` is used instead of simply `touchend` because the user
   * may swipe to reveal the panel, then move their finger to another element
   * before releasing, which would not trigger `touchend`.
   */
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

  /**
   * Hide the revealed panel if the user clicks anywhere.
   */
  @HostListener('document:mousedown')
  onDocumentMouseDown() {
    this.scrollToBeginning();
  }

  /**
   * Scroll to completely hide the hidden panel.
   */
  private scrollToBeginning(): void {
    this.scrollTo(0);
  }

  /**
   * Scroll to completely reveal the hidden panel.
   */
  private scrollToEnd(): void {
    this.scrollTo(this.hiddenPanelWidth);
  }

  /**
   * Scroll to the specified X-position (from the left edge of the element).
   * @param x The destination scroll position in pixels
   */
  private scrollTo(x: number): void {
    this.element.nativeElement.scrollTo({ left: x, behavior: 'smooth' });
  }
}
