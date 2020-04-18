import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { TABLE_HEADER_COLUMNS ,TABLE_NESTED_HEADERS } from '@app/modules/declarations/data/document-list-editor.data';

@Component({
  selector: 'app-document-list-table',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentListTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheetDocumentList', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() events: Observable<void>;
  @Input() nestedHeaders: any[] = TABLE_NESTED_HEADERS;
  @Input() columns: any[] = TABLE_HEADER_COLUMNS;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  private eventsSubscription: Subscription;

  constructor(private element: ElementRef) {}

  ngOnInit() {
   this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
  }
  

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      // this.updateTable();
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
      //tableWidth: `${ containerSize.width }px`,
      //tableHeight: `${ containerSize.height }px`,
      tableWidth: '100%',
      tableHeight: '100%',
      columnSorting: false,
      defaultColAlign: 'left',
      onchange: (instance, cell, c, r, value) => {
        this.onChange.emit({
          instance, cell, c, r, value,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
      },
      ondeleterow: (el, rowNumber, numOfRows) => {
        this.onDelete.emit({
          rowNumber,
          numOfRows,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
      }
    });

    this.spreadsheet.hideIndex();

    this.updateTable();
  }

  private updateTable() {
    const data = [];
    if (!data.length) {
      for (let i = 1; i <= 15; i++) {
        data.push([ i ]);
      }
    }
    this.data = data;
    this.spreadsheet.setData(this.data);
  }

  private updateSourceToColumn(key, sources) {
     
  }

  private updateFilterToColumn(key, filterCb) {
    
  }

  private getContainerSize() {
    const element = this.element.nativeElement;
    const parent = element.parentNode;

    return {
      width: parent.offsetWidth,
      height: parent.offsetHeight
    };
  }

  //Get data form execl to Object Document list
  private handleEvent(type) {
    const data = this.spreadsheet.getJson();
    const declarations = [];

    data.forEach(d => { 
      declarations.push(this.arrayToProps(data, this.columns))
    });

    // data.forEach(d => {
    //   if (!d.options.hasLeaf && !d.options.isLeaf) {
    //     declarations[d.options.key] = { ...d.origin };
    //   } else if (d.options.hasLeaf) {
    //     declarations[d.options.key] = {
    //       ...d.origin,
    //       declarations: []
    //     };
    //   } else if (d.options.isLeaf) {
    //     declarations[d.options.parentKey].declarations.push(this.arrayToProps(d, this.columns));
    //   }
    // });

    this.onSubmit.emit({
      type,
      data: declarations
    });
  }

  private arrayToProps(array, columns) {
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'numberic') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );

    // if (array.origin.id) {
    //   object.employeerId = array.origin.id;
    // }

    return object;
  }
}
