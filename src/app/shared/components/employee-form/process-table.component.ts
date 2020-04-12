import { Component, Input, Output, OnInit, OnDestroy, OnChanges, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from './process-table.data';

@Component({
  selector: 'app-employee-process-table',
  templateUrl: './process-table.component.html',
  styleUrls: ['./process-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeProcessTableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = TABLE_HEADER_COLUMNS;
  @Input() nestedHeaders: any[] = TABLE_NESTED_HEADERS;
  @Input() events: Observable<void>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isInitialized = false;
  private eventsSubscription: Subscription;

  constructor(private element: ElementRef) {
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    // window.removeEventListener('resize', this.updateTableSize);
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
    }
  }

  handleEvent(type) {
    if (type === 'ready' && !this.isInitialized) {
      this.isInitialized = true;
      // const containerSize = this.getContainerSize();
      const data = this.data;

      // init default data
      if (!data.length) {
        for (let i = 1; i <= 15; i++) {
          data.push([ i ]);
        }
      }

      this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
        data,
        nestedHeaders: this.nestedHeaders,
        columns: this.columns,
        allowInsertColumn: false,
        allowInsertRow: false,
        tableOverflow: true,
        tableWidth: '100%',
        tableHeight: '100%',
        columnSorting: false,
        freezeColumns: 4,
        defaultColAlign: 'left',
        onchange: (instance, cell, c, r, value) => {
          this.onChange.emit({
            instance, cell, c, r, value,
            records: this.spreadsheet.getJson()
          });
        },
        ondeleterow: (el, rowNumber, numOfRows) => {
          this.onDelete.emit({
            rowNumber,
            numOfRows,
            records: this.spreadsheet.getJson()
          });
        }
      });

      this.spreadsheet.hideIndex();
    }
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
