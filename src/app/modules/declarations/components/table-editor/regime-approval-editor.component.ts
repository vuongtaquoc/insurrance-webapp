import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';
import * as moment from 'moment';
import { CategoryService, BankService } from '@app/core/services';


import { customPicker, customAutocomplete, customAutocompleteDisplayName } from '@app/shared/utils/custom-editor';
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
  sicknessesPart1: string = 'sicknessesPart1';
  sicknessesPart2: string = 'sicknessesPart2';
  maternityPart1: string = 'maternityPart1';
  maternityPart2: string = 'maternityPart2';
  healthRecoveryPart1: string = 'healthRecoveryPart1';
  healthRecoveryPart2: string = 'healthRecoveryPart2';
  constructor(
    private modalService: NzModalService,
    private categoryService: CategoryService,
    private bankService: BankService,
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
    this.updateAutoCompleteToColumn('diagnosticCode');
    this.updateAutoCompleteToColumn('bankName');
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
        isInitialize: d.isInitialize,
        groupObject: d.groupObject
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
        if (column.key === 'diagnosticCode') {
          if (row[colIndex]) {
            this.getDiagnosticCode(this.spreadsheet, row[colIndex], colIndex, rowIndex).then(data => {
              this.spreadsheet.updateAutoComplete(colIndex, rowIndex, data);
            });
          }
        } else if (column.key === 'bankName') {
          if (row[colIndex]) {
            this.getBankCode(this.spreadsheet, row[colIndex], colIndex, rowIndex).then(data => {
              this.spreadsheet.updateAutoComplete(colIndex, rowIndex, data);
            });
          }
        } else {
          if (column.defaultLoad) {
            this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
          }
        }
        
      });
    });

    this.updateCellValidation();
  }

  private updateCellValidation() {
    if ([this.maternityPart1, this.maternityPart2].indexOf(this.tableName) > -1) {
      this.validMaternity();
    } else if ([this.healthRecoveryPart1].indexOf(this.tableName) > -1) {
      this.validHealthRecoveryPart1();
    } else if([this.sicknessesPart1].indexOf(this.tableName) > -1) {
      this.validSicknessesPart1();
    }
  }

  private updateAutoCompleteToColumn(key) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;
    if(key === 'bankName') {
      column.editor = customAutocompleteDisplayName(this.spreadsheet, this.getBankCode.bind(this));
    } else if(key === 'diagnosticCode') {
      column.editor = customAutocomplete(this.spreadsheet, this.getDiagnosticCode.bind(this));
    }
    
  }

  private async getDiagnosticCode(table, keyword, c, r) {
     const filter = {
      type: 'diagnosticCode',
      keyword
     };
    return await this.categoryService.filterCategories(filter).toPromise();
  }

  private async getBankCode(table, keyword, c, r) {
    const filter = {
     keyword
    };

   return await this.bankService.filterBank(filter).toPromise();
 }


  private validMaternity() {
    const parentKeys = ['II', 'III_1', 'III_2', 'III_3', 'IV', 'V_1', 'V_2', 'VI_1', 'VI_2', 'VII', 'VIII', 'IX'];

      const childrenWeekOld = {
        required: true,
        number: true,
        min: 1,
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
          planCode,
          childrenBirthday: {
            required: true,
          }
        },
        'III_2': {
          planCode,
        },
        'III_3': {
          childrenWeekOld,
          planCode,
          motherDayDead: {
            required: true
          }
        },
        'IV': {
          planCode,
        },
        'V_1': {
          planCode,
          childrenBirthday: {
            required: true,
            lessThanNow: true
          }
        },
        'V_2': {
          planCode,
          childrenDayDead: {
            required: true
          }
        },
        'VI_1': {
          planCode,
          childrenBirthday: {
            required: true,
            lessThanNow: true
          }
        },
        'VI_2': {
          planCode,
          childrenDayDead: {
            required: true
          }
        },
        'VII': {
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
            parentKey: '',
            part: '',
            user: {}
          });
        });
      }, 50);
  }

  private validHealthRecoveryPart1() {
    const parentKeys = ['I_1', 'I_2', 'I_3', 'II_1', 'II_2', 'II_3', 'II_4', 'III_1', 'III_2', 'III_3'];
      const ratioReduction = { min: 0, max: 100 };
      const validationColumns: any = {
        'I_1': {
          ratioReduction
        },
        'I_2': {
          ratioReduction
        },
        'I_3': {
          ratioReduction
        },
        'II_1': {
          ratioReduction
        },
        'II_2': {
          ratioReduction
        },
        'II_3': {
          ratioReduction
        },
        'II_4': {
          ratioReduction
        },
        'III_1': {
          ratioReduction: {
            min: 51,
            max: 100
          }
        },
        'III_2': {
          ratioReduction: {
            min: 31,
            max: 50
          }
        },
        'III_3': {
          ratioReduction: {
            min: 15,
            max: 30
          }
        }
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
            }
          });
          this.handleEvent({
            type: 'validate',
            parentKey: '',
            part: '',
            user: {}
          });
        });
      }, 50);
  }

  private validSicknessesPart1() {
    const parentKeys = ['I', 'II', 'III'];
      const validationColumns: any = {
        'II': {
          diagnosticCode: {
            required: true,
          },
          diagnosticName: {
            required: true,
          }
        },
        'III': {
          childrenBirthday: {
            required: true,
            lessThanNow: true
          },
          childrenHealthNo: {
            required: true,
          }
        },
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
            }
          });
          this.handleEvent({
            type: 'validate',
            parentKey: '',
            part: '',
            user: {}
          });
        });
    }, 50);
  }
  private updateCellReadonly() {
    const readonlyColumnIndex = this.columns.findIndex(c => !!c.checkReadonly);

    this.data.forEach((d, rowIndex) => {
      if (this.tableName === this.maternityPart1 && readonlyColumnIndex > -1) {
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

  private handleEvent({ type, parentKey, user, part }) {
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
        this.handleDeleteUser(user);
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
      error.subfix = 'Dòng';
      error.prefix = 'Cột';
    });

    return errorcopy;
  }

  private validationCellByOtherCell(cellValue, column, y, instance, cell) {
    setTimeout(() => {
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
            part: '',
            parentKey: '',
            user: {}
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
          part: '',
          parentKey: '',
          user: {}
        });
      } else if (column.key === 'regimeFromDate') {
        const regimeToDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
        const validationColumn = this.columns[cell];

        if (regimeToDateValue && cellValue) {
          const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
          const regimeToDateValueMoment = moment(regimeToDateValue, DATE_FORMAT.FULL);
          const isAfter = cellValueMoment.isAfter(regimeToDateValueMoment);

          if (isAfter) {
            validationColumn.validations = {
              required: true,
              lessThan: true
            };
            if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
              validationColumn.validations.lessThanNow = true;
            }
            validationColumn.fieldName = {
              name: 'Từ ngày',
              message: 'Ngày đầu tiên người lao động được chỉ định nghỉ chế độ < hoặc = Ngày cuối cùng người lao động được chỉ định nghỉ chế độ',
            };

            instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
          } else {
            validationColumn.validations = {
              required: true,
            };
            if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
              validationColumn.validations.lessThanNow = true;
            }
            validationColumn.fieldName = 'Từ ngày';
            instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
          }
        } else {
          validationColumn.validations = {
            required: true,
          };
          if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
            validationColumn.validations.lessThanNow = true;
          }
          validationColumn.fieldName = 'Từ ngày';

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }

        this.handleEvent({
          type: 'validate',
          part: '',
          parentKey: '',
          user: {}
        });
      } else if (column.key === 'regimeToDate') {
        const regimeFromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
        const validationColumn = this.columns[Number(cell) - 1];

        if (cellValue && regimeFromDateValue) {
          const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
          const regimeFromDateValueMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
          const isAfter = regimeFromDateValueMoment.isAfter(cellValueMoment);

          if (isAfter) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
              validationColumn.validations.lessThanNow = true;
            }
            validationColumn.fieldName = {
              name: 'Từ ngày',
              message: 'Ngày đầu tiên người lao động được chỉ định nghỉ chế độ < hoặc = Ngày cuối cùng người lao động được chỉ định nghỉ chế độ',
            };

            instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
          } else {
            validationColumn.validations = {
              required: true,
            };
            if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
              validationColumn.validations.lessThanNow = true;
            }
            validationColumn.fieldName = 'Từ ngày';
            instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
          }
        } else {
          validationColumn.validations = {
            required: true,
          };
          if ([this.sicknessesPart1, this.sicknessesPart2].indexOf(this.tableName) === -1) {
            validationColumn.validations.lessThanNow = true;
          }
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }

        this.handleEvent({
          type: 'validate',
          part: '',
          parentKey: '',
          user: {}
        });
      } else if (column.key === 'subsidizeReceipt') {
        const bankAccountColumn = this.columns[Number(cell) + 1];
        const accountHolderColumn = this.columns[Number(cell) + 2];
        const bankCodeColumn = this.columns[Number(cell) + 3];

        if (cellValue === 'ATM') {
          bankAccountColumn.validations = { required: true };
          accountHolderColumn.validations = { required: true };
          bankCodeColumn.validations = { required: true };
        } else {
          bankAccountColumn.validations = { };
          accountHolderColumn.validations = { };
          bankCodeColumn.validations = { };
        }

        bankAccountColumn.fieldName = 'Số tài khoản';
        accountHolderColumn.fieldName = 'Tên chủ tài khoản';
        bankCodeColumn.fieldName = 'Ngân hàng';

        instance.jexcel.validationCell(y, Number(cell) + 1, bankAccountColumn.fieldName, bankAccountColumn.validations);
        instance.jexcel.validationCell(y, Number(cell) + 2, accountHolderColumn.fieldName, accountHolderColumn.validations);
        instance.jexcel.validationCell(y, Number(cell) + 3, bankCodeColumn.fieldName, bankCodeColumn.validations);

        this.handleEvent({
          type: 'validate',
          part: '',
          parentKey: '',
          user: {}
        });
        
      }
    }, 50);
  }
}
