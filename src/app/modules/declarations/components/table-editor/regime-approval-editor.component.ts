import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';
import * as moment from 'moment';

import { customPicker } from '@app/shared/utils/custom-editor';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { DATE_FORMAT } from '@app/shared/constant';

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
  @Input() validationRules: any = {};
  @Input() tableName: string;
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
  private deleteTimer;

  constructor(
    private modalService: NzModalService
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
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
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
        this.updateCellValidation();
      },
      ondeleterow: (el, rowNumber, numOfRows) => {
        this.onDelete.emit({
          rowNumber,
          numOfRows,
          records: this.spreadsheet.getJson(),
          columns: this.columns
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

    setTimeout(() => this.isSpinning = false, 200);
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
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
        }
      });
    });

    this.updateCellValidation();
  }

  private updateCellValidation() {
    if (['maternityPart1', 'maternityPart2'].indexOf(this.tableName) === -1) {
      return;
    }

    const parentKeys = ['II', 'III_1', 'III_2', 'III_3', 'IV', 'V_1', 'V_2', 'VI_1', 'VI_2', 'VII', 'VIII', 'IX'];

    const childrenWeekOld = {
      required: true,
      number: true,
      min: 0,
    };
    const planCode = {
      required: true
    };
    const validationColumns: any = {
      'II': {
        childrenWeekOld,
        planCode
      },
      'III_1': {
        childrenWeekOld,
        planCode,
        childrenBirthday: {
          required: true,
          lessThanNow: true
        }
      },
      'III_2': {
        childrenWeekOld,
        planCode,
        childrenDayDead: {
          required: true
        }
      },
      'III_3': {
        childrenWeekOld,
        planCode,
        motherDayDead: {
          required: true
        }
      },
      'IV': {
        childrenWeekOld,
        planCode,
      },
      'V_1': {
        childrenWeekOld,
        planCode,
        childrenBirthday: {
          required: true,
          lessThanNow: true
        }
      },
      'V_2': {
        childrenWeekOld,
        planCode,
        childrenDayDead: {
          required: true
        }
      },
      'VI_1': {
        childrenWeekOld,
        planCode,
        childrenBirthday: {
          required: true,
          lessThanNow: true
        }
      },
      'VI_2': {
        childrenWeekOld,
        planCode,
        childrenDayDead: {
          required: true
        }
      },
      'VII': {
        childrenWeekOld,
        planCode,
      },
      'VIII': {
        childrenWeekOld,
        planCode,
      },
      'IX': {
        childrenWeekOld,
        planCode,
      }
    };
    const readonlyColumns = {
      'II': ['childrenDayDead', 'surrogacy', 'motherDayDead'],
      'III_1': ['childrenDayDead', 'surrogacy', 'motherDayDead'],
      'III_2': ['surrogacy', 'motherDayDead'],
      'III_3': ['childrenDayDead', 'surrogacy'],
      'IV': ['childrenDayDead', 'surrogacy', 'motherDayDead'],
      'V_1': ['childrenDayDead', 'surrogacy', 'motherDayDead'],
      'V_2': ['surrogacy', 'motherDayDead'],
      'VI_1': ['childrenDayDead', 'surrogacy', 'motherDayDead'],
      'VI_2': ['surrogacy', 'motherDayDead'],
      'VII': ['childrenDayDead', 'motherDayDead'],
      'VIII': ['childrenDayDead', 'motherDayDead'],
      'IX': ['childrenDayDead', 'surrogacy', 'motherDayDead']
    };

    setTimeout(() => {
      parentKeys.forEach(parentKey => {
        const columnIndexes = [];

        Object.keys(validationColumns[parentKey] || {}).forEach(column => {
          const x = this.columns.findIndex(c => c.key === column);

          if (x > -1) {
            columnIndexes.push(x);
          }
        });

        this.data.forEach((d, y) => {
          if (d.parentKey === parentKey) {
            columnIndexes.forEach(x => {
              const column = this.columns[x];
              this.spreadsheet.validationCell(y, x, column.fieldName, validationColumns[parentKey][column.key]);
            });

            // set readonly column
            readonlyColumns[parentKey].forEach(column => {
              const x = this.columns.findIndex(c => c.key === column);

              this.spreadsheet.setReadonly(y, x);
            });
          }
        });
        this.handleEvent({
          type: 'validate',
          deletedIndexes: [],
          parentKey: '',
          part: ''
        });
      });
    }, 50);
  }

  private updateCellReadonly() {
    const readonlyColumnIndex = this.columns.findIndex(c => !!c.checkReadonly);

    this.data.forEach((d, rowIndex) => {
      if (this.tableName === 'maternityPart1' && readonlyColumnIndex > -1) {
        if (d.parentKey === 'III_1') {
          this.spreadsheet.setReadonly(rowIndex, readonlyColumnIndex);
        }
      }
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

  private handleDeleteUser(deletedIndexes) {
    this.deleteTimer = setTimeout(() => {
      if (!deletedIndexes.length) {
        clearTimeout(this.deleteTimer);
        return;
      };
      const index = deletedIndexes.shift();

      this.spreadsheet.deleteRow(index, 1);
      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        part: '',
        parentKey: ''
      });

      this.handleDeleteUser(deletedIndexes);
    }, 50);
  }

  private handleEvent({ type, parentKey, deletedIndexes, part }) {
    if (type === 'validate') {
      setTimeout(() => {
        const data = Object.values(this.spreadsheet.getJson());
        const leaf = data.filter((d: any) => d.options.isLeaf);
        const initialize = leaf.filter((d: any) => d.options.isInitialize);

        eventEmitter.emit('regime-approval:validate', {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors()),
          leaf,
          initialize
        });
      }, 10);
    } else if (type === 'deleteUser') {
      if (this.tableName.toLowerCase().indexOf(part) > -1) {
        this.handleDeleteUser(deletedIndexes);
      }

      return;
    }
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
    });

    return errorcopy;
  }

  private validationCellByOtherCell(cellValue, column, y, instance, cell) {
    if (column.key === 'planCode') {
      const rules = this.validationRules[cellValue];
      const x = this.columns.findIndex(c => c.key === 'childrenNumber');
      const cellSelected = column.source.find(s => s.id === cellValue);
      const validationColumn = this.columns[x];

      if (!rules) {
        validationColumn.validations = undefined;
        validationColumn.fieldName = undefined;
        instance.jexcel.clearValidation(y, x);
        this.handleEvent({
          type: 'validate',
          deletedIndexes: [],
          part: '',
          parentKey: ''
        });
        return;
      }

      const fieldName = {
        name: 'Số con',
        otherField: `phương án ${ cellSelected.name }`
      };

      validationColumn.validations = rules;
      validationColumn.fieldName = fieldName;

      instance.jexcel.validationCell(y, x, fieldName, rules);

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        part: '',
        parentKey: ''
      });
    } else if (column.key === 'regimeFromDate') {
      const regimeToDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (regimeToDateValue && cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const regimeToDateValueMoment = moment(regimeToDateValue, DATE_FORMAT.FULL);
        const isSameOrAfter = cellValueMoment.isSameOrAfter(regimeToDateValueMoment);

        if (isSameOrAfter) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Ngày đầu tiên người lao động được chỉ định nghỉ chế độ < hoặc = Ngày cuối cùng người lao động được chỉ định nghỉ chế độ',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.clearValidation(y, cell);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.clearValidation(y, cell);
      }

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        part: '',
        parentKey: ''
      });
    } else if (column.key === 'regimeToDate') {
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[Number(cell) - 1];

      if (cellValue && regimeFromDateValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const regimeFromDateValueMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const isSameOrAfter = regimeFromDateValueMoment.isSameOrAfter(cellValueMoment);

        if (isSameOrAfter) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Ngày đầu tiên người lao động được chỉ định nghỉ chế độ < hoặc = Ngày cuối cùng người lao động được chỉ định nghỉ chế độ',
          };

          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.clearValidation(y, Number(cell) - 1);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.clearValidation(y, Number(cell) - 1);
      }

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        part: '',
        parentKey: ''
      });
    }
  }
}
