import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/document-editor.data';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-editor.component.html',
  styleUrls: ['./document-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheetDocument', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = TABLE_HEADER_COLUMNS;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isInitialized = false;

  constructor(
  ) {}

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
    this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
      data: [],
      columns: this.columns,
      allowInsertColumn: false,
      allowInsertRow: false,
      tableOverflow: true,
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
    this.data.forEach((d, index) => {
      const documentRow = [];
      this.columns.forEach(column => {
        documentRow.push(d[column.key]);
      });

      data.push(documentRow);
    });
    // init default data
    if (!data.length) {
      for (let i = 1; i <= 15; i++) {
        data.push([ i ]);
      }
    }
    data.forEach((d, i) => d[0] = i + 1);
    this.data = data;
    this.spreadsheet.setData(this.data);
  }

  private updateSourceToColumn(key, sources) {
    const column = this.columns.find(c => c.key === key);
    if (column) {
      column.source = sources;
    }
  }

  private updateFilterToColumn(key, filterCb) {
    const column = this.columns.find(c => c.key === key);
    if (column) {
      column.filter = filterCb;
    }
  }
}
