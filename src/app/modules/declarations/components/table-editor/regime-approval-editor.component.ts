import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { customPicker } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-regime-approval-editor',
  templateUrl: './regime-approval-editor.component.html',
  styleUrls: ['./regime-approval-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegimeApprovalEditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
  @Input() events: Observable<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isInitialized = false;
  isSpinning = false;
  private eventsSubscription: Subscription;
  private handlers = [];
  private timer;

  constructor(
  ) {

  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
    this.handlers.push(eventEmitter.on('regime-approval:tab:change', (index) => {
      clearTimeout(this.timer);

      this.isSpinning = true;

      this.timer = setTimeout(() => {
        this.spreadsheet.updateNestedHeaderPosition();
        this.spreadsheet.updateFreezeColumn();
        this.isSpinning = false;
      }, 300);
    }));
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    this.eventsSubscription.unsubscribe();
    if (this.timer) clearTimeout(this.timer);

    eventEmitter.destroy(this.handlers);
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      this.updateTable();
    }
  }

  ngAfterViewInit() {
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
      freezeColumns: 1,
      defaultColAlign: 'left',
      onchange: (instance, cell, c, r, value) => {
        this.onChange.emit({
          instance, cell, c, r, value,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });

        const column = this.columns[c];

        if (column.key === 'typeBirthday') {
          const nextColumn = jexcel.getColumnNameFromId([Number(c) + 1, r]);

          instance.jexcel.setValue(nextColumn, '');
        }
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

    this.updateEditorToColumn('recruitmentDate', 'month');
    this.updateEditorToColumn('recordSolvedEndDate', 'month');
    this.updateEditorToColumn('regimeFromDate');
    this.updateEditorToColumn('regimeToDate');
    this.updateEditorToColumn('regimeRequestDate');
    this.updateEditorToColumn('childrenBirthday');
    this.updateEditorToColumn('dateStartWork');
    this.updateEditorToColumn('childrenDayDead');
    this.updateEditorToColumn('childrenGodchilDreceptionDate');
    this.updateEditorToColumn('childrenDreceptionDate');
    this.updateEditorToColumn('motherDayDead');
    this.updateEditorToColumn('cotherConclusionDate');
    this.updateEditorToColumn('recordSolvedFromDate');
    this.updateEditorToColumn('dateStartWork');
    this.updateEditorToColumn('expertiseDate');

    this.spreadsheet.hideIndex();

    this.updateTable();
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
        key: d.key,
        isParent: d.isParent,
        formula: !!d.formula,
        isInitialize: d.isInitialize
      };

      data.push(d.data);
    });

    this.spreadsheet.setData(data);
    this.spreadsheet.setReadonlyRowsTitle(readonlyIndexes, [0, 1]);
    this.spreadsheet.setReadonlyRowsFormula(formulaIndexes, formulaIgnoreIndexes);

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

  private updateFilterToColumn(key, filterCb) {
    const column = this.columns.find(c => c.key === key);

    if (column) {
      column.filter = filterCb;
    }
  }

  private updateEditorToColumn(key, type = 'date', isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }

  private handleEvent({ type }) {
    if (type === 'validate') {
      setTimeout(() => {
        eventEmitter.emit('regime-approval:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid()
        });
      }, 10);
    }
  }
}
