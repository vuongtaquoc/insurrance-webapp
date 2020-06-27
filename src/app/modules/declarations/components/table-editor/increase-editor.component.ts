import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';
import { HospitalService } from '@app/core/services';

import { customPicker, customAutocomplete } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import * as moment from 'moment';
import { DATE_FORMAT } from '@app/shared/constant';
import { validateLessThanEqualNowBirthdayGrid, getBirthDayGrid } from '@app/shared/utils/custom-validation';

@Component({
  selector: 'app-increase-editor',
  templateUrl: './increase-editor.component.html',
  styleUrls: ['./increase-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class IncreaseEditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() validationRules: any = {};
  @Input() tableName: string;
  @Input() validate: Observable<any>;
  @Input() events: Observable<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();
  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onSort: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isInitialized = false;
  isSpinning = true;
  private eventsSubscription: Subscription;
  private handlers = [];
  private timer;
  private validateTimer;
  private deleteTimer;
  private validateSubscription: Subscription;
  constructor(
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
    if (this.timer) clearTimeout(this.timer);
    clearTimeout(this.validateTimer);
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
      allowInsertRow: true,
      allowAddEmployee: true,
      allowSort: true,
      tableOverflow: true,
      tableWidth: '100%',
      tableHeight: '100%',
      columnSorting: false,
      freezeColumns: 1,
      defaultColAlign: 'left',
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
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
        const column = this.columns[c];

        if (column.key === 'typeBirthday') {
          const nextColumn = jexcel.getColumnNameFromId([Number(c) + 1, r]);

          instance.jexcel.setValue(nextColumn, '');
        }

        this.validationCellByOtherCell(value, column, r, instance, c);
      },
      ondeleterow: (el, rowNumber, numOfRows) => {
        this.onDelete.emit({
          rowNumber,
          numOfRows,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
      },
      oninsertrow: (instance, rowNumber, numOfRows, rowRecords, insertBefore,c, r) => {
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
        //this.validationCellByOtherCell(value, column, r, instance, records);
      },
      ondoubleclickreadonly: (el) => {
        this.modalService.info({
          nzTitle: 'Hướng dẫn',
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nạp dữ liệu để thực hiện.'
        });
      }
    });

    this.updateEditorToColumn('dateSign');
    this.updateEditorToColumn('birthday', 'month', true);
    this.updateEditorToColumn('fromDate', 'month');
    this.updateEditorToColumn('toDate', 'month');
    this.updateEditorToColumn('motherDayDead', 'date');
    this.updateAutoCompleteToColumn('hospitalFirstRegistCode');

    this.spreadsheet.hideIndex();

    this.updateTable();

    setTimeout(() => this.isSpinning = false, 200);
  }

  private updateTable() {
    const readonlyIndexes = [];
    const formulaIndexes = [];
    let formulaIgnoreIndexes = [];
    const readonlyBlankRows = [];
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
        formula: !!d.formula,
        planType: d.planType,
        isInitialize: d.isInitialize
      };

      data.push(d.data);
    });

    this.spreadsheet.setData(data);
    this.spreadsheet.setReadonlyRowsTitle(readonlyIndexes, [0, 1]);
    this.spreadsheet.setReadonlyRowsFormula(formulaIndexes, formulaIgnoreIndexes);
    this.spreadsheet.setReadonlyBlankRows(readonlyBlankRows);
    this.updateCellReadonly();
    // update dropdown data
    data.forEach((row, rowIndex) => {
      this.columns.forEach((column, colIndex) => {
        //update source dropdown when change data
        if (column.key === 'hospitalFirstRegistCode') {
          if (row[colIndex]) {
            this.getHospitalsByCityCode(this.spreadsheet, row[colIndex], colIndex, rowIndex).then(data => {
              this.spreadsheet.updateAutoComplete(colIndex, rowIndex, data);
            });
          }
        } else {
          this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
        }
      });
    });

    this.setWarningSalaryWhenAddEmployee(data);

  }

  private setWarningSalaryWhenAddEmployee(data: any) {
    if(this.tableName !== 'adjustment') {
        return;
    }

    const fieldName = {
      name: 'Tiền lương mức đóng cũ',
      otherName:'Tiền lương mức đóng mới'
    };

    clearTimeout(this.validateTimer);
    this.validateTimer = setTimeout(() => {
      data.forEach((row, rowIndex) => {
        if(!row.origin.isLeaf) return;

        this.spreadsheet.setCellError(fieldName, 30,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 31,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 32,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 33,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 34,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 35,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 36,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
        this.spreadsheet.setCellError(fieldName, 37,rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true);
      });
    }, 10);

  }


  private updateCellReadonly() {
    const readonlyColumnIndex = this.columns.findIndex(c => !!c.checkReadonly);
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

  private handleEvent({ type, parentKey, user, part }){
    if (type === 'validate') {
      setTimeout(() => {
        const data = Object.values(this.spreadsheet.getJson());
        const leaf = data.filter((d: any) => d.options.isLeaf);
        const initialize = leaf.filter((d: any) => d.options.isInitialize);
        eventEmitter.emit('adjust-general:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors()),
          leaf,
          initialize
        });
      }, 10);
    } else if (type === 'deleteUser') {
      this.handleDeleteUser(user);

      return;
    }
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
          part: '',
          parentKey: '',
          user: {}
        });

        this.handleDeleteUser(user);
      } else {
        clearTimeout(this.deleteTimer);
      }
    }, 50);
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
        user: {},
        part: '',
        parentKey: ''
      });
    });
  }

  private async getHospitalsByCityCode(table, keyword, c, r) {
    const cityCode = table.getValueFromCoords(c - 5, r);

    if (!cityCode) {
      return [];
    }

    return await this.hospitalService.searchHospital(cityCode, keyword).toPromise();
  }

  private updateAutoCompleteToColumn(key) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customAutocomplete(this.spreadsheet, this.getHospitalsByCityCode.bind(this));
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
    } else if (column.key === 'birthday') { 
      const typeBirthday = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[cell];
      const result = validateLessThanEqualNowBirthdayGrid(cellValue, typeBirthday);     
      if(result) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày, tháng, năm sinh',
          message: 'Ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại',
        };

        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
      }else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Ngày, tháng, năm sinh';
        instance.jexcel.clearValidation(y, cell);
      }
    }

    this.handleEvent({
      type: 'validate',
      part: '',
      parentKey: '',
      user: {}
    });
  }
}
