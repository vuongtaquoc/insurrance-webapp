import { Component, Input, Output, OnInit, OnDestroy, OnChanges, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { PlanService } from '@app/core/services';

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
  @Input() columns: any[] = [];
  @Input() tableName: string;
  @Input() nestedHeaders: any[] = [];
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

    this.planService.getPlans('all').subscribe(plans => {
      this.updateSourceToColumn('planCode', plans);
    });
  }

  ngOnDestroy() {
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      this.updateTable();
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
        allowInsertRow: true,
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
    if (!this.spreadsheet) {
      return;
    }
    const data = [];
    this.data.forEach((d, index) => {
      d.data = d.data || [];
      d.data.origin  = d.origin;
      data.push(d.data);
    });

    // init default data
    data.forEach((d, i) => d[0] = i + 1);
    this.data = data;

    this.spreadsheet.setData(this.data);
    // update dropdown data
    data.forEach((row, rowIndex) => {
      this.columns.forEach((column, colIndex) => {
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
        }
      });
    });
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
