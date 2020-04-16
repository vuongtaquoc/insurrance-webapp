import { AfterViewInit, Directive, ElementRef, OnDestroy, Output, EventEmitter } from '@angular/core';

const GRID_GAP = 10;
const OFFSET = 12;

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[editorAutoSize]'
})
export class EditorAutoSizeDirective implements AfterViewInit, OnDestroy {
  @Output() sizeChange = new EventEmitter();

  constructor(private elementRef: ElementRef) {
    this.updateElementSize = this.updateElementSize.bind(this);
  }

  ngAfterViewInit(): void {
    this.updateElementSize();

    window.addEventListener('resize', this.updateElementSize);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateElementSize);
  }

  updateElementSize() {
    const element = this.elementRef.nativeElement;
    const parent = element.parentNode;
    const children = parent.childNodes;
    let height = parent.clientHeight;

    for (let i = 0; i < children.length; i++) {
      if (!children[i].isEqualNode(element)) {
        height -= children[i].offsetHeight + GRID_GAP;
      }
    }

    height -= OFFSET;

    element.style.height = `${ height }px`;
  }
}
