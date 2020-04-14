import { Component, Input, Output, OnInit, OnDestroy, OnChanges, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { PlanService } from '@app/core/services';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from './process-table.data';
import { customPicker } from '@app/shared/utils/custom-editor';

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

  constructor(
    private planService: PlanService
  ) {
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));

    this.planService.getPlans().subscribe(plans => {
      this.updateSourceToColumn('planCode', plans);
    });
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      // this.updateTable();
    }
  }

  handleEvent(type) {
    if (type === 'ready' && !this.isInitialized) {
      this.isInitialized = true;

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
        freezeColumns: 4,
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

      // update editor
      this.updateEditorToColumn('fromDate', 'month');
      this.updateEditorToColumn('toDate', 'month');

      this.spreadsheet.hideIndex();

      this.updateTable();
    }
  }

  private updateTable() {
    const data = [];

    this.data.forEach((d, index) => {
      const familyRow = [];

      this.columns.forEach(column => {
        familyRow.push(d[column.key]);
      });

      data.push(familyRow);
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

  private updateSourceToColumn(key, sources) {
    const column = this.columns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  private updateEditorToColumn(key, type) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type);
  }
}
