import { AfterViewInit, Directive, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

const CARD_OFFSET = 90;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[pageSplitFullHeight]'
})
export class PageSplitFullHeightDirective implements AfterViewInit, OnDestroy {
  @Output() heightChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.updateElementHeight = this.updateElementHeight.bind(this);
  }

  ngAfterViewInit(): void {
    this.updateElementHeight();

    window.addEventListener('resize', this.updateElementHeight);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateElementHeight);
  }

  updateElementHeight() {
    const element = this.elementRef.nativeElement;
    const header = document.getElementsByClassName('layout-header')[0];

    // element.style.height = `${ window.innerHeight - header.clientHeight - CARD_OFFSET }px`;
    this.heightChange.emit(window.innerHeight - header.clientHeight - CARD_OFFSET);
  }
}
