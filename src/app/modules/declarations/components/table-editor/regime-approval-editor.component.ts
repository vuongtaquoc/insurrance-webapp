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
      search: false,
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

          instance.jexcel.setValue(nextColumn, '', false);
        }
        this.updateCellValidation();
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
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nhập excel để thực hiện.'
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
    this.updateEditorToColumn('motherConclusionDate');
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
        groupObject: d.groupObject,
        genderAdd: d.genderAdd,
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
  
    // if ([this.maternityPart1, this.maternityPart2].indexOf(this.tableName) > -1) {
    if ([this.maternityPart1].indexOf(this.tableName) > -1) {
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
      const parentKeys = ['I','II', 'III_1', 'III_2', 'III_3', 'IV', 'V_1', 'V_2', 'VI_1', 'VI_2', 'VII', 'VIII', 'IX'];
      const childrenWeekOld = {
        required: true,
        number: true,
        min: 1,
      };
       
      const planCode = {
        required: true
      };
      const validationColumns: any = {
        'I' : {
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          },
          regimeSum: {
            required: true,
            min:1,
            max:2,
          }
        },
        'II': {
          childrenWeekOld,
          planCode,
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          }
        },
        'III_1': {
          planCode,
          childrenBirthday: {
            required: true,
          }
        },
        'III_2': {
          planCode,
          regimeSum: {
            required: true,
            min:1,
          },
          childrenBirthday: {
            required: true,
          }
        },
        'III_3': {
          childrenWeekOld,
          planCode,          
          childrenBirthday: {
            required: true
          }
        },
        'IV': {
          planCode,
          childrenGodchilDreceptionDate: {
            required: true,
          },
          childrenBirthday: {
            required: true
          }
        },
        'V_1': {
          planCode,
          childrenBirthday: {
            required: true,
            lessThanNow: true
          },
          childrenGodchilDreceptionDate: {
            required: true,
          }
        },
        'V_2': {
          planCode,
          childrenDayDead: {
            required: true
          },
          childrenWeekOld:{
            number: true,
          },
          childrenGodchilDreceptionDate: {
            required: true,
          }
        },
        'VI_1': {
          planCode,
          childrenWeekOld:{
            number: true,
          },
          childrenBirthday: {
            required: true,
            lessThanNow: true
          },
          childrenGodchilDreceptionDate: {
            required: true,
          }
        },
        'VI_2': {
          planCode,
          childrenDayDead: {
            required: true
          },
          childrenWeekOld:{
            number: true,
          },
          childrenBirthday: {
            required: true,
            lessThanNow: true
          }
        },
        'VII': {
          planCode,
          childrenWeekOld:{
            number: true,
          },
          regimeSum: {
            required: true,
            min: 1,
            max: 14,
          }
        },
        'IX': {
          planCode,
          childrenWeekOld:{
            number: true,
          },
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          }
        }
      };

      const readonlyColumns = {
        'I': ['childrenBirthday', 'childrenNumber', 'childrenWeekOld','maternityLeave', 'parentsOffWork', 'childrenGodchilDreceptionDate',
          'dateStartWork','childrenDayDead','surrogacy', 'motherIdentityCar','childrenIsurranceCode', 'motherIsurranceCode', 'childrenHealthNo','motherHealthNo', 'examinationCost',
          'isSurgeryOrPremature', 'motherDayDead', 'motherConclusionDate'],
        'II': ['childrenDayDead', 'childrenNumber', 'childrenWeekOld', 'conditionReproduction','maternityLeave', 'parentsOffWork', 'childrenGodchilDreceptionDate', 'dateStartWork',
          'childrenDayDead', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode', 'motherIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature', 'motherDayDead', 'motherConclusionDate' ],
        'III_1': [ 'motherDayDead', 'motherConclusionDate','regimeToDate', 'conditionPrenatal', 'childrenWeekOld', 'parentsOffWork', 'childrenGodchilDreceptionDate', 'dateStartWork', 'childrenDayDead', 'surrogacy', 'motherIdentityCar', 
                  'childrenIsurranceCode', 'motherIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'III_2': [ 'motherDayDead', 'motherConclusionDate','regimeToDate', 'conditionPrenatal', 'childrenWeekOld', 'conditionReproduction', 'parentsOffWork', 'dateStartWork', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode',
                  'motherIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'III_3': ['regimeToDate', 'regimeSum', 'regimeRequestDate', 'conditionPrenatal', 'childrenWeekOld', 'conditionReproduction', 'childrenGodchilDreceptionDate', 'dateStartWork', 'childrenIsurranceCode', 'childrenHealthNo', 
                  'motherHealthNo', 'examinationCost'],
        'IV': [ 'motherDayDead', 'motherConclusionDate','regimeToDate', 'regimeRequestDate', 'regimeSum', 'conditionPrenatal', 'childrenWeekOld', 'conditionReproduction', 'maternityLeave', 'parentsOffWork', 'childrenDayDead', 'surrogacy',
              'motherIdentityCar', 'childrenIsurranceCode', 'motherIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'V_1': ['motherDayDead', 'motherConclusionDate','regimeToDate', 'regimeToDate', 'regimeRequestDate', 'regimeSum', 'conditionPrenatal', 'childrenWeekOld', 'parentsOffWork', 'childrenDayDead', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode', 'childrenIsurranceCode',
                'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'V_2':  ['motherDayDead', 'motherConclusionDate','regimeToDate', 'regimeToDate', 'regimeRequestDate','regimeSum', 'conditionPrenatal', 'childrenWeekOld', 'parentsOffWork', 'childrenDayDead', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode', 'childrenIsurranceCode',
        'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'VI_1': ['regimeToDate', 'regimeRequestDate', 'regimeSum','conditionPrenatal', 'childrenWeekOld', 'maternityLeave', 'childrenDayDead', 'surrogacy', 'motherIdentityCar', 'examinationCost',
                'isSurgeryOrPremature'],
        'VI_2':  ['regimeToDate', 'regimeRequestDate', 'conditionPrenatal', 'childrenWeekOld', 'parentsOffWork', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode', 'childrenIsurranceCode',
        'childrenHealthNo', 'motherHealthNo', 'examinationCost', 'isSurgeryOrPremature'],
        'VII': ['motherDayDead', 'motherConclusionDate','conditionPrenatal', 'childrenWeekOld', 'conditionReproduction', 'maternityLeave', 'parentsOffWork', 'childrenGodchilDreceptionDate', 'dateStartWork', 'childrenDayDead',
                'motherIdentityCar', 'childrenIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 'examinationCost'],
        'VIII': ['motherDayDead', 'motherConclusionDate','regimeFromDate', 'regimeToDate', 'regimeRequestDate', 'conditionPrenatal', 'childrenWeekOld', 'conditionReproduction', 'maternityLeave', 'parentsOffWork', 'childrenGodchilDreceptionDate',
                'dateStartWork', 'childrenDayDead', 'examinationCost', 'isSurgeryOrPremature', 'regimeSum'],
        'IX': ['motherDayDead', 'motherConclusionDate','childrenBirthday', 'childrenNumber', 'conditionPrenatal','childrenWeekOld', 'conditionReproduction', 'maternityLeave', 'parentsOffWork', 'childrenGodchilDreceptionDate', 
              'dateStartWork', 'childrenDayDead', 'surrogacy', 'motherIdentityCar', 'childrenIsurranceCode', 'motherIsurranceCode', 'childrenHealthNo', 'motherHealthNo', 
              'examinationCost', 'isSurgeryOrPremature']
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
                this.spreadsheet.setReadonlyCellAndClear(y, x);
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
        'I': {
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          },
          regimeRequestDate: {
            required: true,
            lessThanNow: true,
          }
        },
        'III': {
          childrenBirthday: {
            required: true,
            lessThanNow: true,
          },
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          },
          regimeRequestDate: {
            required: true,
            lessThanNow: true,
          }
        },
        'II': {
          diagnosticCode: {
            required: true,
          },
          regimeFromDate: {
            required: true,
            lessThanNow: true,
          },
          regimeRequestDate: {
            required: true,
            lessThanNow: true,
          }
        },
      };

      const readonlyColumns = {
        'I': ['childrenBirthday', 'childrenHealthNo', 'childrenNumberSick'],
        'III': ['conditionWork', 'maternityLeave','diagnosticCode'],
        'II': ['conditionWork', 'certificationHospital', 'maternityLeave', 'childrenBirthday', 'childrenHealthNo', 'childrenNumberSick' ],
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

                this.spreadsheet.setReadonlyCellAndClear(y, x);
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
    const records = this.spreadsheet.getJson();
    const parentKey = records[y].options.parentKey;
    // console.log(parentKey, this.tableName);   
    setTimeout(() => {
      if (column.key === 'planCode') {
        const rules = this.validationRules[cellValue];
        const x = this.columns.findIndex(c => c.key === 'childrenNumber');
        const cellSelected = column.source.find(s => s.id === cellValue);
        const validationColumn = this.columns[x];
        this.validDataByPlanCode(column, y, instance, cell, parentKey);
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
        instance.jexcel.validationCell(Number(y), x, fieldName, rules);
      } else if (column.key === 'regimeFromDate') {        
        this.validFromDateByTable(column, y, instance, cell, parentKey);
        this.validChildrenBirthdayByTable(column, y, instance, cell, parentKey)
      } else if (column.key === 'regimeToDate') {
        this.validToDateByTable(column, y, instance, cell, parentKey);
      } else if (column.key === 'motherConclusionDate') {
        this.validMotherConclusionDate(column, y, instance, cell, parentKey);
      } else if (column.key === 'motherDayDead') {
        this.validMotherDayDead(column, y, instance, cell, parentKey);
      } else if (column.key === 'regimeRequestDate') {
        const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
        const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y); 
        this.validRegimeRequestDateByTable(regimeFromDateValue, column, y, instance, cell, parentKey);
      } else if (column.key === 'childrenBirthday') {        
        this.validFromDateByTable(column, y, instance, cell, parentKey);
        this.validChildrenBirthdayByTable(column, y, instance, cell, parentKey)
        this.validChildrenGodchilDreceptionDateByTable(column, y, instance, cell, parentKey);
        this.validChildrenDayDeadByTable(column, y, instance, cell, parentKey);
      } else if(column.key === 'childrenGodchilDreceptionDate') {
        this.validChildrenBirthdayByTable(column, y, instance, cell, parentKey)
        this.validChildrenGodchilDreceptionDateByTable(column, y, instance, cell, parentKey);
        this.validDateStartWorkByTable(column, y, instance, cell, parentKey);
      } else if(column.key === 'dateStartWork') {
        this.validDateStartWorkByTable(column, y, instance, cell, parentKey);
      } else if(column.key === 'dateStartWork') {
        this.validDateStartWorkByTable(column, y, instance, cell, parentKey);
      } else if(column.key === 'childrenDayDead') {
        this.validChildrenDayDeadByTable(column, y, instance, cell, parentKey);
      } else if(column.key === 'childrenNumber') { 
        this.validChildrenNumber(column, y, instance, cell);
      } else if (column.key === 'subsidizeReceipt' || column.key === 'bankAccount' || column.key === 'accountHolder' || column.key === 'bankName') {
         this.validSubsidizeReceipt(column, y, instance, cell, parentKey)
      }
      
      this.handleEvent({
        type: 'validate',
        part: '',
        parentKey: '',
        user: {}
      });
    }, 50);
  }

  private validSubsidizeReceipt(column, y, instance, cell, parentKey) 
  {
    const indexOfSubsidizeReceipt = this.columns.findIndex(c => c.key === 'subsidizeReceipt');    
    const indexOfBankAccount = this.columns.findIndex(c => c.key === 'bankAccount');
    const indexOfAccountHolder = this.columns.findIndex(c => c.key === 'accountHolder');
    const indexOfBankName = this.columns.findIndex(c => c.key === 'bankName');

    const bankAccountColumn = this.columns[indexOfBankAccount];
    const accountHolderColumn = this.columns[indexOfAccountHolder];
    const bankCodeColumn = this.columns[indexOfBankName];
    const subsidizeReceiptValue = this.spreadsheet.getValueFromCoords(indexOfSubsidizeReceipt, y);
    if (subsidizeReceiptValue === 'ATM') {
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

    instance.jexcel.validationCell(y, indexOfBankAccount, bankAccountColumn.fieldName, bankAccountColumn.validations);
    instance.jexcel.validationCell(y, indexOfAccountHolder, accountHolderColumn.fieldName, accountHolderColumn.validations);
    instance.jexcel.validationCell(y, indexOfBankName, bankCodeColumn.fieldName, bankCodeColumn.validations);
  }

  private validDataByPlanCode(column, y, instance, cell, parentKey) {
    this.validMotherConclusionDate(column, y, instance, cell, parentKey);
    this.validMotherDayDead(column, y, instance, cell, parentKey);
 }

  private validMotherConclusionDate(column, y, instance, cell, parentKey) {
    const indexOfPlanCode = this.columns.findIndex(c => c.key === 'planCode');
    const planCodeValue = this.spreadsheet.getValueFromCoords(indexOfPlanCode, y);

    const indexOfMotherConclusionDate = this.columns.findIndex(c => c.key === 'motherConclusionDate');
    const motherConclusionDateValue = this.spreadsheet.getValueFromCoords(indexOfMotherConclusionDate, y);
    const motherConclusionDateColumn = this.columns[indexOfMotherConclusionDate];
    if (planCodeValue && planCodeValue === 'RR2') { 
      motherConclusionDateColumn.validations = { 
        required: true,
        lessThanNow: true,
      };   
    } else {
      motherConclusionDateColumn.validations = { 
        required: false,
      };   
    }
    motherConclusionDateColumn.fieldName = 'Ngày kết luận (mẹ được kết luận không còn đủ sức khỏe chăm con)';
    instance.jexcel.validationCell(y, indexOfMotherConclusionDate, motherConclusionDateColumn.fieldName, motherConclusionDateColumn.validations);
  }

  private validMotherDayDead(column, y, instance, cell, parentKey) {
    const indexOfPlanCode = this.columns.findIndex(c => c.key === 'planCode');
    const planCodeValue = this.spreadsheet.getValueFromCoords(indexOfPlanCode, y);

    const indexOfMotherDayDead = this.columns.findIndex(c => c.key === 'motherDayDead');
    const motherDayDeadValue = this.spreadsheet.getValueFromCoords(indexOfMotherDayDead, y);
    const motherDayDeadColumn = this.columns[indexOfMotherDayDead];
    if (planCodeValue && planCodeValue === 'RR1') { 
      motherDayDeadColumn.validations = { 
        required: true,
        lessThanNow: true,
      };   
    } else {
      motherDayDeadColumn.validations = { 
        required: false,
      };   
    }
    motherDayDeadColumn.fieldName = 'Ngày mẹ chết';
    instance.jexcel.validationCell(y, indexOfMotherDayDead, motherDayDeadColumn.fieldName, motherDayDeadColumn.validations);
  }

  private validFromDateByTable(column, y, instance, cell, parentKey) {
    if (this.tableName === 'maternityPart1' &&  (parentKey === 'III_1' || parentKey === 'III_2') ) {
      this.validFromDate630BIII2(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && parentKey === 'III_3' ) {
     this.validFromDate630BIII3(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && parentKey === 'IV' ) {
      this.validFromDate630BIV(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && (parentKey === 'V_1' || parentKey === 'V_2') ) {
      this.validFromDate630BV1(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && parentKey === 'VI_1') {
       this.validFromDate630BVI1(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && parentKey === 'VI_2') {
     this.validFromDate630BVI1(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' && parentKey === 'VII') {
      this.validFromDate630BVII(column, y, instance, cell);
    }
  }

  private validToDateByTable(column, y, instance, cell, parentKey) { 
    if (this.tableName === 'sicknessesPart1' &&  (parentKey === 'I' || parentKey === 'II' || parentKey === 'III') ) {
      this.validToDate(column, y, instance, cell);
    } if (this.tableName === 'maternityPart1' &&  (parentKey === 'I' || parentKey === 'II' || parentKey === 'IX') ) {
      this.validToDate(column, y, instance, cell);
    } else if(this.tableName === 'maternityPart1' && parentKey === 'VII') {
      this.validToDateVII(column, y, instance, cell);
    }
  }

  private validChildrenGodchilDreceptionDateByTable(column, y, instance, cell, parentKey) {
    if (this.tableName === 'maternityPart1' &&  (parentKey === 'III_2') ) {
      this.validChildrenGodchilDreceptionDateIII2(column, y, instance, cell);
    } else if(this.tableName === 'maternityPart1' && (parentKey === 'IV' || parentKey ==='VI_1')) {
      this.validChildrenGodchilDreceptionDateIV(column, y, instance, cell);
    }else if(this.tableName === 'maternityPart1' && (parentKey === 'V_1' || parentKey ==='V_2')) {
      this.validChildrenGodchilDreceptionDateV12(column, y, instance, cell);
    }
  }

  private validDateStartWorkByTable(column, y, instance, cell, parentKey) {
    if (this.tableName === 'maternityPart1' &&  (parentKey === 'IV' || parentKey === 'VI_1') ) {
      this.validDateStartWorkIV(column, y, instance, cell);
    }
  }

  private validChildrenDayDeadByTable(column, y, instance, cell, parentKey) {
    if (this.tableName === 'maternityPart1' &&  (parentKey === 'III_3' || parentKey === 'VI_2') ) {
      this.validchildrenDayDeadIII3(column, y, instance, cell);
    } else if (this.tableName === 'maternityPart1' &&  parentKey === 'III_2') {
      this.validchildrenDayDeadIII2(column, y, instance, cell);
    }
  }

  private validToDate(column, y, instance, cell) {
    const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
    const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
    const indexOfRegimeToDate = this.columns.findIndex(c => c.key === 'regimeToDate');
    const regimeToDateDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeToDate, y);
    const validationColumn = this.columns[indexOfRegimeToDate];

    if (regimeToDateDateValue && regimeFromDateValue) {
      const cellValueMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
      const regimeToDateValueMoment = moment(regimeToDateDateValue, DATE_FORMAT.FULL);
      const isAfter = cellValueMoment.isAfter(regimeToDateValueMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Đến ngày',
          message: 'Ngày đầu tiên người lao động được chỉ định nghỉ chế độ < hoặc = Ngày cuối cùng người lao động được chỉ định nghỉ chế độ',
        };

        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true
        };
         
        validationColumn.fieldName = 'Đến ngày';
        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        required: true,
        lessThanNow: true
      };
      validationColumn.fieldName = 'Đến ngày';

      instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  //T12: Nam nghỉ khi vợ sinh VII
  private validToDateVII(column, y, instance, cell) {
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    
    const indexOfRegimeToDate = this.columns.findIndex(c => c.key === 'regimeToDate');
    const regimeToDateDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeToDate, y);

    const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
    const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);

    const validationColumn = this.columns[indexOfRegimeToDate];

    if (regimeToDateDateValue && childrenBirthdayValue) {      

      const regimeToDateValueMoment = moment(regimeToDateDateValue, DATE_FORMAT.FULL);
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('days',  35);
      const isAfter = regimeToDateValueMoment.isAfter(moment(childrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
     
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Đến ngày',
          message: 'Đến ngày được hưởng phải nhỏ hơn hoặc bằng ngày sinh của con cộng 35 ngày [' + childrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
        };

        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          lessThanNow: true
        };
         
        validationColumn.fieldName = 'Đến ngày';
        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else if(regimeToDateDateValue && regimeFromDateValue) {
      
      const regimeToDateValueMoment = moment(regimeToDateDateValue, DATE_FORMAT.FULL);
      const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
      const isAfterFromDate = regimeFromDateMoment.isAfter(regimeToDateValueMoment);
      
      if(isAfterFromDate) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Đến ngày',
          message: 'Đến ngày phải lớn hơn Từ ngày',
        };

        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          lessThanNow: true
        };
         
        validationColumn.fieldName = 'Đến ngày';
        instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
      }

    } else {
      validationColumn.validations = {
        lessThanNow: true
      };

      validationColumn.fieldName = 'Đến ngày';
      instance.jexcel.validationCell(y, indexOfRegimeToDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  private validChildrenNumber(column, y, instance, cell) {
      const indexOfChildrenNumber = this.columns.findIndex(c => c.key === 'childrenNumber');
      const childrenNumberValue = this.spreadsheet.getValueFromCoords(indexOfChildrenNumber, y);
      const indexOfPlanCode = this.columns.findIndex(c => c.key === 'planCode');
      const planCodeValue = this.spreadsheet.getValueFromCoords(indexOfPlanCode, y);
      const rules = this.validationRules[planCodeValue];
      const validationColumn = this.columns[indexOfChildrenNumber];
      if(rules && childrenNumberValue < 5) {
        const cellSelected = this.columns[indexOfPlanCode].source.find(s => s.id === planCodeValue);
        const fieldName = {
          name: 'Số con',
          otherField: `phương án ${ cellSelected.name }`
        };

        validationColumn.validations = rules;
        validationColumn.fieldName = fieldName;
        instance.jexcel.validationCell(Number(y), indexOfChildrenNumber, fieldName, rules);
      } else {
        validationColumn.validations = {
          min:1
        }

        if(childrenNumberValue > 5) {
          validationColumn.validations.max = 5;           
        }

        validationColumn.fieldName = 'Số con';
        instance.jexcel.validationCell(y, indexOfChildrenNumber, validationColumn.fieldName, validationColumn.validations);
      }
  }

  /// Con chết III_2 T6
  private  validFromDate630BIII2(column, y, instance, cell)
  {
      const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
      const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
      const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);

      const validationColumn = this.columns[indexOfRegimeFromDate];
      if (childrenBirthdayValue && regimeFromDateValue) {
        const cellValueMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const maxChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).subtract('days', 1);
        const minchildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).subtract('months', 2);
        const isAfterMaxchildrenBirthday = cellValueMoment.isAfter(moment(maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
        const isAfterMinchildrenBirthday = moment(minchildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL).isAfter(cellValueMoment);
        if(isAfterMaxchildrenBirthday) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            validationColumn.fieldName = {
              name: 'Từ ngày đơn vị đề nghị',
              message: 'Từ ngày đơn vị đề nghị phải nhỏ hơn một ngày, sau ngày sinh của con [' + childrenBirthdayValue + ']',
            };
            instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        } else if(isAfterMinchildrenBirthday) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };
          validationColumn.fieldName = {
            name: 'Từ ngày đơn vị đề nghị',
            message: 'Từ ngày đơn vị đề nghị phải lớn hơn thời gian sinh con trước 2 tháng',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        else {
          validationColumn.validations = {
            required: true,
            lessThanNow: true,
          };
          
          validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true,
        };
        
        validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }
  }

  //T7 trương hợp mẹ chết sau sinh
  private  validFromDate630BIII3(column, y, instance, cell)
  {
      const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
      const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
      const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);

      const validationColumn = this.columns[indexOfRegimeFromDate];
      if (childrenBirthdayValue && regimeFromDateValue) {
        const cellValueMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const minchildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).subtract('months', 2);
        const isAfterMinchildrenBirthday = moment(minchildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL).isAfter(cellValueMoment);
        if(isAfterMinchildrenBirthday) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };
          validationColumn.fieldName = {
            name: 'Từ ngày đơn vị đề nghị',
            message: 'Từ ngày đơn vị đề nghị phải lớn hơn thời gian sinh con trước 2 tháng',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        else {
          validationColumn.validations = {
            required: true,
            lessThanNow: true,
          };
          
          validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true,
        };
        
        validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }
  }

  /// Con chết III_2 T8
  private  validFromDate630BIV(column, y, instance, cell)
  {
      const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
      const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
      const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
      const indexOfchildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
      const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfchildrenGodchilDreceptionDate, y);

      const validationColumn = this.columns[indexOfRegimeFromDate];
      if (childrenBirthdayValue && regimeFromDateValue) {
        const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const childrenBirthdayMoment =  moment(childrenBirthdayValue, DATE_FORMAT.FULL);
        const maxChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months', 6);
        const isAfter = childrenBirthdayMoment.isAfter(regimeFromDateMoment);
        const isAfterMax = regimeFromDateMoment.isAfter(moment(maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
        const childrenGodchilDreceptionDateMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);
        const isAfterchildrenGodchil = childrenGodchilDreceptionDateMoment.isAfter(regimeFromDateMoment);
        if(isAfter) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            validationColumn.fieldName = {
              name: 'Từ ngày',
              message: 'Từ ngày đề nghị phải lơn hơn hoặc bằng sinh của con [' + maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
            };
            instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        } else if (isAfterchildrenGodchil) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Từ ngày đề nghị phải lớn hơn hoặc bằng ngày nhận con nuôi  [' + childrenGodchilDreceptionDateValue + ']',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        } else if(isAfterMax) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Từ ngày đề nghị phải nhỏ hơn hoặc bằng [' + maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
       }  else {
            validationColumn.validations = {
              lessThanNow: true,
            };
            
            validationColumn.fieldName = 'Từ ngày';
            instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        
      } else {
        validationColumn.validations = {
          lessThanNow: true,
        };
        
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }
  }

  /// Mang thai hộ V1, V2 10
  private  validFromDate630BV1(column, y, instance, cell)
  {
      const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
      const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
      const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);

      const validationColumn = this.columns[indexOfRegimeFromDate];
      if (childrenBirthdayValue && regimeFromDateValue) {
        const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('days', 1);
        const monthChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).subtract('months', 2);

        const isAfterMin = moment(monthChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL).isAfter(regimeFromDateMoment);
        const isAfterMax = regimeFromDateMoment.isAfter(moment(childrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
        if(isAfterMin) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            validationColumn.fieldName = {
              name: 'Từ ngày',
              message: 'Từ ngày đề nghị phài lớn hơn hoặc bằng sau 2 tháng sinh con [' + monthChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
            };
            instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        } else if(isAfterMax) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Từ ngày phải nhỏ hơn hoặc bằng ngày sinh của con cộng 1 ngày [' + childrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        else {
          validationColumn.validations = {
            required: true,
            lessThanNow: true,
          };
          
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true,
        };
        
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }
  }

  //T11: Nhờ mang thai hộ VI_1
  private  validFromDate630BVI1(column, y, instance, cell)
  {
      const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
      const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
      const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
      const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);

      const indexOfChildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
      const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfChildrenGodchilDreceptionDate, y);

      const validationColumn = this.columns[indexOfRegimeFromDate];
      if (childrenBirthdayValue && regimeFromDateValue) {
        const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
        const maxChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months', 6);
        const minchildrenBirthdayMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);
        const isAfterMin = minchildrenBirthdayMoment.isAfter(regimeFromDateMoment);
        const isAfterMax = regimeFromDateMoment.isAfter(moment(maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
        if(isAfterMin) {
          validationColumn.validations = {
            required: true,
            lessThan: true,
          };

          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: 'Từ ngày phải phải lơn hoăn hoặc bằng ngày nhận nuôi [' + childrenGodchilDreceptionDateValue + ']',
          };
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);

        } else if(isAfterMax) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            validationColumn.fieldName = {
              name: 'Từ ngày',
              message: 'Từ ngày đề nghị phải nhỏ hơn hoặc bằng ngày sinh của con cộng 6 tháng [' + maxChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
            };
            instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            lessThanNow: true,
          };
          
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
        }
        
      } else {
        validationColumn.validations = {
          lessThanNow: true,
        };
        
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }
  }

 //T12: Nam nghỉ khi vợ sinh VII
 private  validFromDate630BVII(column, y, instance, cell)
 {
     const indexOfRegimeFromDate = this.columns.findIndex(c => c.key === 'regimeFromDate');
     const regimeFromDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeFromDate, y);
     const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
     const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);

     const validationColumn = this.columns[indexOfRegimeFromDate];
     if (childrenBirthdayValue && regimeFromDateValue) {
      const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);
      const dayOffMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('days',  30);
      const isAfterOff = regimeFromDateMoment.isAfter(moment(dayOffMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
      const isAfter = childrenBirthdayMoment.isAfter(regimeFromDateMoment);
      if(isAfter) {
           validationColumn.validations = {
             required: true,
             lessThan: true,
           };
           validationColumn.fieldName = {
             name: 'Từ ngày',
             message: 'Từ ngày phải lơn hơn hoặc bằng ngày sing của con ' + childrenBirthdayValue,
           };
           instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
       } else if(isAfterOff) {
        validationColumn.validations = {
          required: true,
          lessThan: true,
        };
        validationColumn.fieldName = {
          name: 'Từ ngày',
          message: 'Từ ngày phải nhỏ hơn hoặc bằng ngày sinh của con + 30 ngày ' + dayOffMoment.format(DATE_FORMAT.FULL),
        };
        instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
      }   else {
         validationColumn.validations = {
           required: true,
           lessThanNow: true,
         };
         
         validationColumn.fieldName = 'Từ ngày';
         instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
       }
       
     } else {
       validationColumn.validations = {
         required: true,
         lessThanNow: true,
       };
       
       validationColumn.fieldName = 'Từ ngày';
       instance.jexcel.validationCell(y, indexOfRegimeFromDate, validationColumn.fieldName, validationColumn.validations);
     }
 }


  private validChildrenBirthdayByTable(column, y, instance, cell, parentKey) {
    if(this.tableName === 'maternityPart1') {
      this.validChildrenBirthday(column, y, instance, cell);
    }
  }

  private validRegimeRequestDateByTable(toDate, column, y, instance, cell, parentKey) {
    if((this.tableName === 'sicknessesPart1' || this.tableName === 'sicknessesPart2') && (parentKey === 'I' || parentKey === 'II' || parentKey === 'II')) {
      this.validRegimeRequestDate(toDate, column, y, instance, cell);
    }
  }
  

  private validChildrenBirthday(column, y, instance, cell) {
    const indexOfTypeBirthday = this.columns.findIndex(c => c.key === 'typeBirthday');
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const indexOfBirthday = this.columns.findIndex(c => c.key === 'birthday');
    const typeBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfTypeBirthday, y);
    const birthdayValue = this.spreadsheet.getValueFromCoords(indexOfBirthday, y);
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const validationColumn = this.columns[indexOfChildrenBirthday];
    if (birthdayValue && childrenBirthdayValue) {
      const dateFomat = this.getDateTimeFomatByTypeBirthday(typeBirthdayValue);
      const birthdayMoment = moment(birthdayValue, dateFomat);
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);
      const isAfter = birthdayMoment.isAfter(childrenBirthdayMoment);
      if (isAfter) {

        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày sinh của con',
          message: 'Ngày sinh của con phải lơn hơn ngày sinh của mẹ ' + birthdayValue,
        };

        instance.jexcel.validationCell(y, indexOfChildrenBirthday, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations.lessThanNow = true;
        validationColumn.fieldName = 'Ngày sinh của con';
        instance.jexcel.validationCell(y, indexOfChildrenBirthday, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        required: true,
        lessThanNow: true
      };
      validationColumn.fieldName = 'Ngày sinh của con';
      instance.jexcel.validationCell(y, indexOfChildrenBirthday, validationColumn.fieldName, validationColumn.validations);
    }
  }


  private validRegimeRequestDate(fromDate ,column, y, instance, cell ) {
      const indexOfRegimeRequestDate = this.columns.findIndex(c => c.key === 'regimeRequestDate');
      const regimeRequestDateValue = this.spreadsheet.getValueFromCoords(indexOfRegimeRequestDate, y);
      const validationColumn = this.columns[indexOfRegimeRequestDate];
      
      if (regimeRequestDateValue && fromDate) {
        const fromDateMoment = moment(fromDate, DATE_FORMAT.FULL);
        const regimeRequestDateMoment = moment(regimeRequestDateValue, DATE_FORMAT.FULL);
        const isAfter = fromDateMoment.isAfter(regimeRequestDateMoment);
        if (isAfter) {
            validationColumn.validations = {
              required: true,
              lessThan: true,
            };
            validationColumn.fieldName = {
              name: 'Từ ngày đơn vị đề nghị',
              message: 'Từ ngày đơn vị đề nghị phải lờn hơn hoặc bằng từ ngày hưởng chế độ',
            };
            instance.jexcel.validationCell(y, indexOfRegimeRequestDate, validationColumn.fieldName, validationColumn.validations);
          } else {
            validationColumn.validations = {
              required: true,
              lessThanNow: true,
            };
            
            validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
            instance.jexcel.validationCell(y, indexOfRegimeRequestDate, validationColumn.fieldName, validationColumn.validations);
          }
    } else {
      validationColumn.validations = {
        required: true,
        lessThanNow: true,
      };
      
      validationColumn.fieldName = 'Từ ngày đơn vị đề nghị';
      instance.jexcel.validationCell(y, indexOfRegimeRequestDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  //T6: Con chết sau khi sinh III_2
  private validChildrenGodchilDreceptionDateIII2(column, y, instance, cell) {
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const indexOfChildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
    const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfChildrenGodchilDreceptionDate, y);
    const validationColumn = this.columns[indexOfChildrenGodchilDreceptionDate];

    if (childrenBirthdayValue && childrenGodchilDreceptionDateValue) {
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);
      const childrenGodchilDreceptionDateMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);

      const monChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months',  6);
      const isAfterMon = childrenGodchilDreceptionDateMoment.isAfter(moment(monChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));

      const isAfter = childrenBirthdayMoment.isAfter(childrenGodchilDreceptionDateMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi con phải lơn hơn hoặc bằng ngày sinh của con [' + childrenBirthdayValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else if(isAfterMon) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi con phải nhỏn hơn hoặc bằng ngày sinh của con + 6 tháng [' + monChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
        };
         
        validationColumn.fieldName = 'Ngày nhận nuôi';
        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
      };
      validationColumn.fieldName = 'Ngày nhận nuôi';

      instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  //T8: Nuôi con nuôi IV, VI_1
  private validChildrenGodchilDreceptionDateIV(column, y, instance, cell) {
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const indexOfChildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
    const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfChildrenGodchilDreceptionDate, y);
    const validationColumn = this.columns[indexOfChildrenGodchilDreceptionDate];

    if (childrenBirthdayValue && childrenGodchilDreceptionDateValue) {
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);
      const childrenGodchilDreceptionDateMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);

      const monChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months',  6);
      const isAfterMon = childrenGodchilDreceptionDateMoment.isAfter(moment(monChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));

      const isAfter = childrenBirthdayMoment.isAfter(childrenGodchilDreceptionDateMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi con phải lơn hơn hoặc bằng ngày sinh của con [' + childrenBirthdayValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else if(isAfterMon) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi con phải nhỏn hơn hoặc bằng ngày sinh của con + 6 tháng [' + monChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true,
        };
         
        validationColumn.fieldName = 'Ngày nhận nuôi';
        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        required: true,
        lessThanNow: true,
      };
      validationColumn.fieldName = 'Ngày nhận nuôi';

      instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

   //T10: Mang thai hộ V_1, V_2
   private validChildrenGodchilDreceptionDateV12(column, y, instance, cell) {
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const indexOfChildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
    const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfChildrenGodchilDreceptionDate, y);
    const validationColumn = this.columns[indexOfChildrenGodchilDreceptionDate];

    if (childrenBirthdayValue && childrenGodchilDreceptionDateValue) {
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('days', 1);
      const childrenGodchilDreceptionDateMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);

      const monChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months', 6);
      const isAfterMon = childrenGodchilDreceptionDateMoment.isAfter(moment(monChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));

      const isAfter = moment(childrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL).isAfter(childrenGodchilDreceptionDateMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi phải lớn hơn ngày sinh của con [' + childrenBirthdayValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else if(isAfterMon) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày nhận nuôi',
          message: 'Ngày nhận nuôi phải nhỏn hơn hoặc bằng ngày sinh của con + 6 tháng [' + monChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          required: true,
          lessThanNow: true,
        };
         
        validationColumn.fieldName = 'Ngày nhận nuôi';
        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        required: true,
        lessThanNow: true,
      };
      validationColumn.fieldName = 'Ngày nhận nuôi';

      instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  //T8: Nuôi con nuôi IV
  private validDateStartWorkIV(column, y, instance, cell) {
    const indexOfDateStartWork = this.columns.findIndex(c => c.key === 'dateStartWork');
    const dateStartWorkValue = this.spreadsheet.getValueFromCoords(indexOfDateStartWork, y);
    const indexOfChildrenGodchilDreceptionDate = this.columns.findIndex(c => c.key === 'childrenGodchilDreceptionDate');
    const childrenGodchilDreceptionDateValue = this.spreadsheet.getValueFromCoords(indexOfChildrenGodchilDreceptionDate, y);
    const validationColumn = this.columns[indexOfChildrenGodchilDreceptionDate];

    if (dateStartWorkValue && childrenGodchilDreceptionDateValue) {
      const dateStartWorkMoment = moment(dateStartWorkValue, DATE_FORMAT.FULL);
      const childrenGodchilDreceptionDateMoment = moment(childrenGodchilDreceptionDateValue, DATE_FORMAT.FULL);
      const isAfter = childrenGodchilDreceptionDateMoment.isAfter(dateStartWorkMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày đi làm thực tế',
          message: 'Ngày đi làm thực tế phải lớn hơn hoặc bẳng ngày nhân luôn [' + childrenGodchilDreceptionDateValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      }  else {
        validationColumn.validations = {
          lessThanNow: true,
        };
         
        validationColumn.fieldName = 'Ngày đi làm thực tế';
        instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        lessThanNow: true,
      };
      validationColumn.fieldName = 'Ngày đi làm thực tế';

      instance.jexcel.validationCell(y, indexOfChildrenGodchilDreceptionDate, validationColumn.fieldName, validationColumn.validations);
    }
  }

  //T7: Mẹ chết sau khi sinh III_3
  private validchildrenDayDeadIII3(column, y, instance, cell) {
    const indexOfChildrenDayDead = this.columns.findIndex(c => c.key === 'childrenDayDead');
    const childrenDayDeadValue = this.spreadsheet.getValueFromCoords(indexOfChildrenDayDead, y);
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const validationColumn = this.columns[indexOfChildrenDayDead];

    if (childrenDayDeadValue && childrenBirthdayValue) {
      const childrenDayDeadMoment = moment(childrenDayDeadValue, DATE_FORMAT.FULL);
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);
      const isAfter = childrenBirthdayMoment.isAfter(childrenDayDeadMoment);
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày con chết',
          message: 'Ngày con chết phải lớn hơn ngày sinh con [' + childrenDayDeadValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
      }  else {
        validationColumn.validations = {
          lessThanNow: true,
        };
         
        validationColumn.fieldName = 'Ngày con chết';
        instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        lessThanNow: true,
      };
      validationColumn.fieldName = 'Ngày con chết';

      instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
    }
  }
  //T6: Con chết sau khi sinh III_2
  private validchildrenDayDeadIII2(column, y, instance, cell) {
    const indexOfChildrenDayDead = this.columns.findIndex(c => c.key === 'childrenDayDead');
    const childrenDayDeadValue = this.spreadsheet.getValueFromCoords(indexOfChildrenDayDead, y);
    const indexOfChildrenBirthday = this.columns.findIndex(c => c.key === 'childrenBirthday');
    const childrenBirthdayValue = this.spreadsheet.getValueFromCoords(indexOfChildrenBirthday, y);
    const validationColumn = this.columns[indexOfChildrenDayDead];

    if (childrenDayDeadValue && childrenBirthdayValue) {
      const childrenDayDeadMoment = moment(childrenDayDeadValue, DATE_FORMAT.FULL);
      const childrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL);      
      const monChildrenBirthdayMoment = moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months',  6);
      const isAfter = childrenBirthdayMoment.isAfter(childrenDayDeadMoment);
      const isAfterMax = childrenDayDeadMoment.isAfter(moment(monChildrenBirthdayMoment.format(DATE_FORMAT.FULL), DATE_FORMAT.FULL));
      if (isAfter) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày con chết',
          message: 'Ngày con chết phải lớn hơn ngày sinh con [' + childrenBirthdayValue + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
      } else if (isAfterMax) {
        validationColumn.validations = {
          required: true,
          lessThan: true
        };
        validationColumn.fieldName = {
          name: 'Ngày con chết',
          message: 'Ngày con chết phải nhỏ hơn hoặc bằng ngày sinh con cộng 6 tháng [' + monChildrenBirthdayMoment.format(DATE_FORMAT.FULL) + ']',
        };

        instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
      } else {
        validationColumn.validations = {
          required: true,
        };
         
        validationColumn.fieldName = 'Ngày con chết';
        instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
      }
    } else {
      validationColumn.validations = {
        required: true,
      };
      validationColumn.fieldName = 'Ngày con chết';

      instance.jexcel.validationCell(y, indexOfChildrenDayDead, validationColumn.fieldName, validationColumn.validations);
    }
  }

  private getDateTimeFomatByTypeBirthday(typeBirthday) {
    
    if (typeBirthday === 0) {
      return DATE_FORMAT.FULL;
    }

    if (typeBirthday === 1) {
      return DATE_FORMAT.ONLY_MONTH_YEAR;
    }

    if (typeBirthday === 2) {
      return DATE_FORMAT.ONLY_YEAR;
    }

    return DATE_FORMAT.FULL;

  }

}
