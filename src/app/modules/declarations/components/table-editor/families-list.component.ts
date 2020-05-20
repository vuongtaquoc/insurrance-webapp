import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import { customPicker } from '@app/shared/utils/custom-editor';
import 'jsuites/dist/jsuites.js';

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
      }
    });
    this.updateEditorToColumn('birthday', 'month', true);

    this.spreadsheet.hideIndex();

    this.updateTable();
  }

  private updateTable() {
    const data = [];
    this.data.forEach((d, index) => {
      const family: any = [];
      this.columns.forEach((column, colIndex) => {
        family.push(d[column.key]);
      });

      family.options = {
        employeeId: d.employeeId,
      }
      data.push(family);
    });

    //update order
    let i = 1;
    let numberOfMember = 1;
    data.forEach(d => {
      if(d[2] === true) {
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
        if (d[2] !== true && colIndex < 11) {
          this.spreadsheet.setReadonlyCellAndClear(index, colIndex);
        }

        if(d[21] === '00') {
          this.spreadsheet.setReadonly(index, 21);
        }else {
          this.spreadsheet.setReadonlyCellAndClear(index, 17);
        }

        if (d[2] === true) {
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
