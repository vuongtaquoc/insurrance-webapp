import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { customPicker } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-table-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TableEditorComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
  @Input() events: Observable<any>;
  @Input() validate: Observable<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isSpinning = true;
  private eventsSubscription: Subscription;
  private validateSubscription: Subscription;
  private deleteTimer;

  constructor(
    private element: ElementRef,
    private modalService: NzModalService
  ) {
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
    this.validateSubscription = this.validate.subscribe((result) => this.handleValidate(result));
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    this.eventsSubscription.unsubscribe();
    this.validateSubscription.unsubscribe();
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
      onfocus: () => {
        this.onFocus.emit();
      },
      onchange: (instance, cell, c, r, value) => {
        this.onChange.emit({
          instance, cell, c, r, value,
          records: this.spreadsheet.getJson()
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
          records: this.spreadsheet.getJson()
        });
      },
      oninsertrow: (instance, rowNumber, numOfRows, rowRecords, insertBefore) => {
        this.spreadsheet.updateFreezeColumn();

        const records = this.spreadsheet.getJson();
        const beforeRow = records[insertBefore ? rowNumber - 1 : rowNumber];
        const afterRow = records[insertBefore ? rowNumber + 1 : rowNumber + 2];

        let options;
        let origin = { id: 0 };
        const beforeRowIsLeaf = beforeRow.options && beforeRow.options.isLeaf;
        const afterRowIsLeaf = afterRow.options && afterRow.options.isLeaf;

        if (beforeRowIsLeaf && !afterRowIsLeaf) {
          options = { ...beforeRow.options };
        } else if (!beforeRowIsLeaf && afterRowIsLeaf) {
          options = { ...afterRow.options };
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
      },
      ondoubleclickreadonly: (el) => {
        this.modalService.info({
          nzTitle: 'Hướng dẫn',
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nạp dữ liệu để thực hiện.'
        });
      }
    });

    this.updateEditorToColumn('dateSign', 'date');
    this.updateEditorToColumn('birthday', 'month', true);
    this.updateEditorToColumn('fromDate', 'month');
    this.updateEditorToColumn('toDate', 'month');


    this.spreadsheet.hideIndex();

    this.updateTable();

    setTimeout(() => this.isSpinning = false, 400);
  }

  private updateTable() {
    const readonlyIndexes = [];
    const formulaIndexes = [];
    const readonlyBlankRows = [];
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

      if (d.isInitialize) {
        readonlyBlankRows.push(index);
      }

      d.data.origin = d.origin;
      d.data.options = {
        hasLeaf: d.hasLeaf,
        isLeaf: d.isLeaf,
        parentKey: d.parentKey,
        key: d.key,
        isParent: d.isParent,
        planType: d.planType,
        formula: !!d.formula,
        isInitialize: d.isInitialize
      };

      data.push(d.data);
    });
    this.spreadsheet.setData(data);
    this.spreadsheet.setReadonlyRowsTitle(readonlyIndexes, [0, 1]);
    this.spreadsheet.setReadonlyRowsFormula(formulaIndexes, formulaIgnoreIndexes);
    this.spreadsheet.setReadonlyBlankRows(readonlyBlankRows);
    // update dropdown data
    data.forEach((row, rowIndex) => {
      this.columns.forEach((column, colIndex) => {
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
        }
      });
    });
  }

  private handleDeleteUser(deletedIndexes) {
    this.deleteTimer = setTimeout(() => {
      if (!deletedIndexes.length) {
        clearTimeout(this.deleteTimer);
        return;
      }

      const index = deletedIndexes.shift();

      this.spreadsheet.deleteRow(index, 1);
      this.onDelete.emit({
        rowNumber: index,
        numOfRows: 1,
        records: this.spreadsheet.getJson()
      });

      this.handleDeleteUser(deletedIndexes);
    }, 30);
  }

  private handleEvent({ type, user, deletedIndexes }) {
    if (type === 'validate') {
      setTimeout(() => {
        eventEmitter.emit('labor-table-editor:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors())
        });
      }, 10);
      return;
    }

    if (type === 'deleteUser') {
      this.handleDeleteUser(deletedIndexes);

      return;
    }

    const data = this.spreadsheet.getJson();
    const declarations = {};

    data.forEach(d => {
      if (!d.options.hasLeaf && !d.options.isLeaf) {
        declarations[d.options.key] = { ...d.origin };
      } else if (d.options.hasLeaf) {
        declarations[d.options.key] = {
          ...d.origin,
          declarations: []
        };
      } else if (d.options.isLeaf) {
        declarations[d.options.parentKey].declarations.push(this.arrayToProps(d, this.columns));
      }
    });

    this.onSubmit.emit({
      type,
      data: Object.values(declarations)
    });
  }

  private getColumnNameValid(errors) {
    const errorcopy = [...errors];

    errorcopy.forEach(error => {
      let fieldName = this.columns[(error.x - 1)].fieldName;
      if(!fieldName) {
        fieldName = this.columns[(error.x - 1)].title;
      }
      error.columnName = fieldName;
    });

    return errorcopy;
  }

  handleValidate({ field, errors }) {
    Object.keys(errors).forEach(row => {
      const error = errors[row];

      this.spreadsheet.validationCell(row, error.col, {
        name: `Mã số ${ error.value }`
      }, {
        fieldNotFound: true
      }, !!error.valid);
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

    if (array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }

    return object;
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }
}
