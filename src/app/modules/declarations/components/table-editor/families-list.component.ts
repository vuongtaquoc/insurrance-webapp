import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { customPicker } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';

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
  @Input() columns: any[] = [];
  @Input() tableName: string;
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isSpinning = true;
  private eventsSubscription: Subscription;
  private handlers = [];
  private timer;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
    this.handlers.push(eventEmitter.on('increase-labor:tab:change', (index) => {
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
    this.eventsSubscription.unsubscribe();
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    this.eventsSubscription.unsubscribe();
    if (this.timer) clearTimeout(this.timer);

    eventEmitter.destroy(this.handlers);
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      this.updateTable();
    }
  }

  ngAfterViewInit() {
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
      defaultColAlign: 'left',
      freezeColumns: 2,
      onchange: (instance, cell, c, r, value) => {
        const records = this.spreadsheet.getJson();

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

        this.validationCellByOtherCell(value, column, r, instance, records);
      },
      ondeleterow: (el, rowNumber, numOfRows) => {
        this.onDelete.emit({
          rowNumber,
          numOfRows,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
      },
      onbeforeinsertrow: (el, rowNumber, numOfRows, insertBefore) => {
        const records = this.spreadsheet.getJson();
        const currentRecord = records[rowNumber];
        if(insertBefore && currentRecord.origin.isMaster) {
          return false;
        }
        return true;
      },
      oninsertrow: (instance, rowNumber, numOfRows, rowRecords, insertBefore) => {
        this.spreadsheet.updateFreezeColumn();

        const records = this.spreadsheet.getJson();
        const beforeRow = records[rowNumber - 1];
        const afterRow = records[rowNumber + 1];

        let options;
        let origin;
        if (beforeRow.origin) {
          options = { ...beforeRow.options };
          origin = { ...beforeRow.origin };
        } else if (afterRow.origin) {
          options = { ...afterRow.options };
          origin = { ...afterRow.origin };
        }

        this.onAddRow.emit({
          rowNumber,
          numOfRows,
          afterRowIndex: rowNumber,
          beforeRowIndex: rowNumber,
          insertBefore,
          options,
          origin,
          records: this.spreadsheet.getJson()
        });
      }
    });
    this.updateEditorToColumn('birthday', 'month', true);

    this.spreadsheet.hideIndex();

    this.updateTable();
  }

  private updateTable() {
    const data = [];
    console.log(this.data,'xxxx data');
    this.data.forEach((d, index) => {
      d.data = d.data || [];
      d.data.origin  = d.origin;
      data.push(d.data);
    });

    this.data = data;
    let i = 1;
    let numberOfMember = 1;
    data.forEach(d => {
      if(d.origin && d.origin.isMaster) {
        d[0] = i;
        i++;
        numberOfMember = 1;
        d[11] = numberOfMember;
        numberOfMember++;
      }else {
        d[11] = numberOfMember;
        numberOfMember++;
      }
    });

    this.data = data;
    this.spreadsheet.setData(data);
    this.data.forEach((d, index) => {

      this.columns.forEach((column, colIndex) => {
        if (!(d.origin && d.origin.isMaster) && colIndex < 11) {
          this.spreadsheet.setReadonlyCellAndClear(index, colIndex);
        }

        if(d[21] === '00') {
          this.spreadsheet.setReadonly(index, 21);
        }else {
          this.spreadsheet.setReadonlyCellAndClear(index, 17);
        }

        if (d.origin && d.origin.isMaster) {
          this.spreadsheet.setCellClass(index, colIndex, 'families-cell');
        }

        // update dropdown data
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, index);
        }

      });
    });
  }

  private handleEvent(type) {
    if (type === 'validate') {
      setTimeout(() => {
        eventEmitter.emit('labor-table-editor:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.spreadsheet.getTableErrors()
        });
      }, 10);
      return;
    }
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }

  private validationCellByOtherCell(cellValue, column, y, instance, records) {
    setTimeout(() => {
      let x;
      let otherX;
      if (column.key === 'relationshipFullName' || column.key === 'fullName') {
        if (column.key === 'relationshipFullName') {
          x = this.columns.findIndex(c => c.key === 'relationshipFullName');
          otherX = this.columns.findIndex(c => c.key === 'fullName');
        } else if (column.key === 'fullName') {
          x = this.columns.findIndex(c => c.key === 'fullName');
          otherX = this.columns.findIndex(c => c.key === 'relationshipFullName');
        }

        const fieldName = {
          name: column.key === 'relationshipFullName' ? 'Chủ hộ' : 'Họ và tên',
          otherName: column.key === 'relationshipFullName' ? 'Họ và tên' : 'Chủ hộ'
        };

        const xValue = records[y][x];
        const otherXValue = records[y][otherX];

        if (xValue !== otherXValue) {
          instance.jexcel.setCellError(fieldName, x, y, { duplicateOtherField: otherXValue }, { duplicateOtherField: false }, true);
          instance.jexcel.setCellError(fieldName, otherX, y, { duplicateOtherField: xValue }, { duplicateOtherField: false }, true);
        } else {
          instance.jexcel.setCellError(fieldName, x, y, { duplicateOtherField: otherXValue }, { duplicateOtherField: true }, false);
          instance.jexcel.setCellError(fieldName, otherX, y, { duplicateOtherField: xValue }, { duplicateOtherField: true }, false);
        }
      }
    }, 10)

  }
}
