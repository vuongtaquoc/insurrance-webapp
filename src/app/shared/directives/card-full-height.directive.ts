import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';

const CARD_OFFSET = 50;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[cardFullHeight]'
})
export class CardFullHeightDirective implements AfterViewInit, OnDestroy {
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

    element.style.height = `${ window.innerHeight - header.clientHeight - CARD_OFFSET }px`;
  }
}
