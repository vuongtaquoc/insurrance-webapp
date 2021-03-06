import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, ElementRef, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';
import * as moment from 'moment';

import { HospitalService } from '@app/core/services';

import { customPicker, customAutocomplete } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { DATE_FORMAT } from '@app/shared/constant';

@Component({
  selector: 'app-table-editor-normal',
  templateUrl: './table-editor-normal.component.html',
  styleUrls: ['./table-editor-normal.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class TableEditorNormalComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
  @Input() declarationCode: string;
  @Input() declarationName: string;
  @Input() events: Observable<any>;
  @Input() validate: Observable<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onSort: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isSpinning = true;
  private eventsSubscription: Subscription;
  private validateSubscription: Subscription;
  private deleteTimer;
  private differents: any = {};
  private handlers = [];
  private timer;

  constructor(
    private element: ElementRef,
    private modalService: NzModalService,
    private hospitalService: HospitalService
  ) {
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
    this.validateSubscription = this.validate.subscribe((result) => this.handleValidate(result));
    this.handlers.push(eventEmitter.on('adjust-general:tab:change', (index) => {
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
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
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
      allowAddEmployee: true,
      allowSort: true,
      tableOverflow: true,
      tableWidth: '100%',
      tableHeight: '100%',
      columnSorting: false,
      defaultColAlign: 'left',
      ondifference: (isDifferent, value, row, field) => {
        const element = document.getElementById(`users-tree-item-${row.origin.employeeId || row.origin.id}`);

        if (!element) return;

        this.differents[field.primary] = isDifferent;

        const hasDifferent = Object.values(this.differents).indexOf(true) > -1;

        if (!hasDifferent) {
          element.classList.remove('users-tree-item-warning');
          return;
        }

        element.classList.add('users-tree-item-warning');
      },
      onfocus: () => {
        this.onFocus.emit();
      },
      onsorttop: (el, y, x) => {
        this.onSort.emit({
          direction: 'top',
          source: y,
          dist: y - 1
        });
      },
      onsortdown: (el, y, x) => {
        this.onSort.emit({
          direction: 'down',
          source: y,
          dist: y + 1
        });
      },
      onaddemployee: (y, x) => {
        eventEmitter.emit('tableEditor:addEmployee', {
          tableName: this.tableName,
          y,
          x
        });
      },
      onchange: (instance, cell, c, r, value) => {
        this.onChange.emit({
          instance, cell, c, r, value,
          records: this.spreadsheet.getJson()
        });

        const column = this.columns[c];

        if (column.key === 'typeBirthday') {
          const nextColumn = jexcel.getColumnNameFromId([Number(c) + 1, r]);

          instance.jexcel.setValue(nextColumn, '', false);
        }

        this.validationCellByOtherCell(value, column, r, instance, c);
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

        let afterRow = records[insertBefore ? rowNumber + 1 : rowNumber + 2];
        if(!afterRow || !afterRow.options) {
          afterRow = records[insertBefore ? rowNumber : rowNumber];
        }

        let beforeRow = records[insertBefore ? rowNumber - 1 : rowNumber]
        if(!beforeRow || !beforeRow.options) {
          beforeRow = records[insertBefore ? rowNumber : rowNumber];
        } 

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
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nhập excel để thực hiện.'
        });
      }
    });

    this.updateEditorToColumn('dateSign', 'date');
    this.updateEditorToColumn('birthday', 'month', true);
    this.updateEditorToColumn('fromDate', 'month');
    this.updateEditorToColumn('toDate', 'month');
    this.updateAutoCompleteToColumn('hospitalFirstRegistCode');

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
        genderAdd: d.genderAdd,
        formula: !!d.formula,
        isInitialize: d.isInitialize,
        groupObject: d.groupObject
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
          if (column.key === 'hospitalFirstRegistCode') {
            if (row[colIndex]) {
              
              this.getHospitalsByCityCode(this.spreadsheet, row[colIndex], colIndex, rowIndex).then(data => {
                this.spreadsheet.updateAutoComplete(colIndex, rowIndex, data);
              });
            }
          } else {
            this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
          }
        }
      });
    });
    
    this.handleEvent({
      type: 'validate',
      deletedIndexes: [],
      user: {}
    });
  }

  private handleDeleteUser(user) {
    clearTimeout(this.deleteTimer);

    this.deleteTimer = setTimeout(() => {
      const records = this.spreadsheet.getJson();
      const userDeleteIndex = records.findIndex(d => {
        return d.options.isLeaf && d.origin && (d.origin.employeeId || d.origin.id) === user.id;
      });

      if (userDeleteIndex > -1) {
        this.spreadsheet.deleteRow(userDeleteIndex, 1);
        this.handleEvent({
          type: 'validate',
          deletedIndexes: [],
          user: {}
        });

        this.handleDeleteUser(user);
      } else {
        clearTimeout(this.deleteTimer);
      }
    }, 30);
  }

  private handleEvent({ type, user, deletedIndexes }) {
    if (type === 'validate') {
      setTimeout(() => {
        eventEmitter.emit('adjust-general:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors())
        });
      }, 10);
      return;
    }

    if (type === 'deleteUser') {
      this.handleDeleteUser(user);

      return;
    }

    const data = this.spreadsheet.getJson();
    const eventData = [];
    const declarations = {
      category: this.declarationCode,
      categoryName: this.declarationName,
      declarations: []
    };

    data.forEach(d => {
      declarations.declarations.push(this.arrayToProps(d, this.columns));
    });
    eventData.push(declarations);
    this.onSubmit.emit({
      type,
      data: eventData//Object.values(declarations)
    });
  }

  private getColumnNameValid(errors) {
    const errorcopy = [...errors];

    errorcopy.forEach(error => {
      let fieldName = this.columns[(error.x - 1)].fieldName;
      if(!fieldName) {
        fieldName = this.columns[(error.x - 1)].title;
      }

      if (typeof fieldName === 'object') {
        error.columnName = fieldName.name;
      } else {
        error.columnName = fieldName;
      }
      error.subfix = 'Dòng';
      error.prefix = 'Cột';
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

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        user: {}
      });
    });
  }

  validationCellByOtherCell(cellValue, column, y, instance, cell) {
    if (column.key === 'fromDate') {
      const toDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (toDateValue && cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const toDateValueMoment = moment(toDateValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const isAfter = cellValueMoment.isAfter(toDateValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ tháng, năm',
            message: '<Từ tháng, năm> phải nhỏ hơn hoặc bằng <Đến tháng, năm>',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ tháng, năm';
          instance.jexcel.clearValidation(y, cell);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ tháng, năm';
        instance.jexcel.clearValidation(y, cell);
      }

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        user: {}
      });
    } else if (column.key === 'toDate') {
      const fromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[Number(cell) - 1];

      if (cellValue && fromDateValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const fromDateValueMoment = moment(fromDateValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const isAfter = fromDateValueMoment.isAfter(cellValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ tháng, năm',
            message: '<Từ tháng, năm> phải nhỏ hơn hoặc bằng <Đến tháng, năm>',
          };

          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ tháng, năm';
          instance.jexcel.clearValidation(y, Number(cell) - 1);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ tháng, năm';
        instance.jexcel.clearValidation(y, Number(cell) - 1);
      }

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        user: {}
      });
    }
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

        if (column.key === 'hospitalFirstRegistCode') {
          return { ...combine, [ column.key ]: array[current].toString().trim() };
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

  private async getHospitalsByCityCode(table, keyword, c, r) {
    const cityCode = '';
    return await this.hospitalService.searchHospital(cityCode, keyword).toPromise();
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }

  private updateAutoCompleteToColumn(key) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customAutocomplete(this.spreadsheet, this.getHospitalsByCityCode.bind(this));
  }
}
