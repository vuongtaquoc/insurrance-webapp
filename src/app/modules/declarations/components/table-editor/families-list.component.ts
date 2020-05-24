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
  @Input() nestedHeaders: any[] = [];
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
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
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
    this.data.forEach((d, index) => {
      d.data.origin  = d.origin;
      data.push(d.data);
    });

    this.data = data;
    let i = 1;
    let numberOfMember = 1;
    data.forEach(d => {
      if(d.origin.isMaster) {
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
    console.log(data);
    this.spreadsheet.setData(data);
    this.data.forEach((d, index) => {

      this.columns.forEach((column, colIndex) => {
        if (!d.origin.isMaster  && colIndex < 11) {
          this.spreadsheet.setReadonlyCellAndClear(index, colIndex);
        }

        if(d[21] === '00') {
          this.spreadsheet.setReadonly(index, 21);
        }else {
          this.spreadsheet.setReadonlyCellAndClear(index, 17);
        }

        if (d.origin.isMaster) {
          this.spreadsheet.setCellClass(index, colIndex, 'families-cell');
        }

        // update dropdown data
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, index);
        }

      });
    });
  }

  private getContainerSize() {
    const element = this.element.nativeElement;
    const parent = element.parentNode;

    return {
      width: parent.offsetWidth,
      height: parent.offsetHeight
    };
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }

  private validationCellByOtherCell(cellValue, column, y, instance, records) {
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
      
      const validationColumn = this.columns[x];

      const fieldName = {
        name: column.key === 'relationshipFullName' ? 'Chủ hộ' : 'Họ và tên',
        otherName: column.key === 'relationshipFullName' ? 'Họ và tên' : 'Chủ hộ'
      };

      validationColumn.validations = {
        duplicateOtherField: records[y][otherX]
      };
      validationColumn.fieldName = fieldName;

      instance.jexcel.validationCell(y, x, fieldName, validationColumn.validations);

    }
    
  }
}
