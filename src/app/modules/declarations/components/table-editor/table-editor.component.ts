import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
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
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() events: Observable<void>;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  private eventsSubscription: Subscription;

  constructor(private element: ElementRef) {
    this.updateTableSize = this.updateTableSize.bind(this);
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    window.removeEventListener('resize', this.updateTableSize);
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      this.updateTable();
    }
  }

  ngAfterViewInit() {
    const containerSize = this.getContainerSize();

    this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
      data: [],
      nestedHeaders: this.nestedHeaders,
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

    this.updateTable();

    window.addEventListener('resize', this.updateTableSize);
  }

  private updateTable() {
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
        isLeaf: d.isLeaf,
        parentKey: d.parentKey,
        key: d.key
      };

      data.push(d.data);
    });

    this.spreadsheet.setData(data);
    this.spreadsheet.setReadonlyRowsTitle(readonlyIndexes, [0, 1]);
    this.spreadsheet.setReadonlyRowsFormula(formulaIndexes, formulaIgnoreIndexes);

    this.updateTableSize();
  }

  private handleEvent(type) {
    const data = this.spreadsheet.getJson();
    const declarations = {};

    data.forEach(d => {
      if (!d.options.hasLeaf && !d.options.isLeaf) {
        declarations[d.options.key] = { ...d.origin };
      } else if (d.options.hasLeaf) {
        declarations[d.options.key] = {
          ...d.origin,
          declarations: []
        };
      } else if (d.options.isLeaf) {
        declarations[d.options.parentKey].declarations.push(this.arrayToProps(d, this.columns));
      }
    });

    this.onSubmit.emit({
      type,
      data: Object.values(declarations)
    });
  }

  private arrayToProps(array, columns) {
    return Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );
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
}
