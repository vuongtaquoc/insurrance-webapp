import { Component, Input, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

@Component({
  selector: 'app-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TableEditorComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() headers: any[] = [];
  @Input() columns: any[] = [];
  @Input() columnWidths: any[] = [];
  @Input() events: Observable<void>;

  spreadsheet: any;
  private eventsSubscription: Subscription;

  constructor(private element: ElementRef) {
    this.updateTableSize = this.updateTableSize.bind(this);
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
  }

  ngOnDestroy() {
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
    window.removeEventListener('resize', this.updateTableSize);
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      this.updateData();
    }
  }

  ngAfterViewInit() {
    const containerSize = this.getContainerSize();

    this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
      data: [],
      colHeaders: this.headers,
      colWidths: this.columnWidths,
      columns: this.columns,
      allowInsertColumn: false,
      allowInsertRow: false,
      tableOverflow: true,
      tableWidth: `${ containerSize.width }px`,
      tableHeight: `${ containerSize.height }px`,
      columnSorting: false,
      defaultColAlign: 'left'
    });

    this.spreadsheet.hideIndex();

    this.updateData();

    window.addEventListener('resize', this.updateTableSize);
  }

  private updateData() {
    const readonlyIndexes = [];
    const formulaIndexes = [];
    let formulaIgnoreIndexes = [];
    const data = [];

    this.data.forEach((d, index) => {
      if (d.readonly) {
        readonlyIndexes.push(index);
      }

      if (d.formula) {
        formulaIndexes.push(index);

        formulaIgnoreIndexes = d.data.reduce(
          (combine, current, i) => {
            if (current) {
              return [ ...combine, i ];
            }

            return [ ...combine ];
          },
          []
        );
      }

      d.data.origin = d.origin;
      d.data.options = {
        hasLeaf: d.hasLeaf,
        isLeaf: d.isLeaf
      };

      data.push(d.data);
    });

    this.spreadsheet.setData(data);
    this.spreadsheet.setReadonlyRowsTitle(readonlyIndexes, [0, 1]);
    this.spreadsheet.setReadonlyRowsFormula(formulaIndexes, formulaIgnoreIndexes);

    this.updateTableSize();
  }

  private getContainerSize() {
    const element = this.element.nativeElement;
    const parent = element.parentNode;

    return {
      width: parent.offsetWidth,
      height: parent.offsetHeight
    };
  }

  private updateTableSize() {
    const containerSize = this.getContainerSize();

    this.spreadsheet.updateTableSize(`${ containerSize.width }px`, `${ containerSize.height }px`);
  }

  private handleEvent(type) {
    if (type === 'save') {
      console.log(this.spreadsheet.getJson())
    }
  }
}
