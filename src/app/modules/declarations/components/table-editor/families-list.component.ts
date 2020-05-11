import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { TABLE_HEADER_COLUMNS ,TABLE_NESTED_HEADERS } from '@app/modules/declarations/data/families-editor.data';

@Component({
  selector: 'app-families-list-table',
  templateUrl: './families-list.component.html',
  styleUrls: ['./families-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FamiliesListTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheetFamiliesList', { static: true }) spreadsheetEl;
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
  
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
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
      tableWidth: '100%',
      tableHeight: '100%',
      columnSorting: false,
      defaultColAlign: 'left',
      freezeColumns: 3,
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

    this.data.forEach((d, index) => {
      const families = [];

      this.columns.forEach(column => {
        families.push(d[column.key]);
      });

      data.push(families);
    });

    // init default data
    if (data.length < 15) {
      const length = 15 - data.length;

      for (let i = 1; i <= length; i++) {
        data.push([ ]);
      }

      data.forEach((d, i) => d[0] = i + 1);
    }

    this.data = data;
    this.spreadsheet.setData(this.data);
  }

  private getContainerSize() {
    const element = this.element.nativeElement;
    const parent = element.parentNode;

    return {
      width: parent.offsetWidth,
      height: parent.offsetHeight
    };
  } 
}
