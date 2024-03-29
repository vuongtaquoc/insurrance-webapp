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
import { validationColumnsPlanCode } from '@app/shared/constant-valid';
import { validateLessThanEqualNowBirthdayGrid, getBirthDayGrid } from '@app/shared/utils/custom-validation';
import { ContactType } from '@app/shared/constant';
@Component({
  selector: 'app-increase-editor',
  templateUrl: './increase-editor.component.html',
  styleUrls: ['./increase-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class IncreaseEditorComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() salaryAreas: any;
  @Input() headerForm: any;
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
  private differents: any = {};
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
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
        const column = this.columns[c];

        if (column.key === 'typeBirthday') {
          const nextColumn = jexcel.getColumnNameFromId([Number(c) + 1, r]);

          instance.jexcel.setValue(nextColumn, '');
        }


        this.validationCellByOtherCell(value, column, r, instance, c);
        this.validationCellByPlanCode();
        this.validIsurrance();
        const isLeaf = this.data[r].origin.isLeaf  || this.data[r].isLeaf;
        if(isLeaf) {
          clearTimeout(this.validateTimer);
          this.validateTimer = setTimeout(() => {
            this.validChangeSalary(this.spreadsheet.getJson()[r], r);
          }, 10);
        }
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
      },
      ondoubleclickreadonly: (el) => {
        this.modalService.info({
          nzTitle: 'Hướng dẫn',
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nhập excel để thực hiện.'
        });
      }
    });

    this.updateEditorToColumn('dateSign',false);
    this.updateEditorToColumn('birthday' ,false, 'month', true);
    this.updateEditorToColumn('fromDate',true, 'month');
    this.updateEditorToColumn('toDate',true, 'month');
    this.updateEditorToColumn('motherDayDead',true, 'date');
    this.updateAutoCompleteToColumn('hospitalFirstRegistCode');
    this.updateEditorToColumn('dateCancelSign');
    this.updateEditorToColumn('careTypeToDate',false);
    this.updateEditorToColumn('careFromDate',false);
    this.updateEditorToColumn('workTypeToDate',false);
    this.updateEditorToColumn('workTypeFromDate',false);
    this.updateEditorToColumn('contractTypeFromDate',false);
    this.updateEditorToColumn('contractTypeToDate',false);

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
        planDefault: d.planDefault,
        rate: d.rate,
        isInitialize: d.isInitialize,
        groupObject: d.groupObject,
        isRequiredIsurranceNo: d.isRequiredIsurranceNo,
        genderAdd: d.genderAdd,
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
    this.validationCellByPlanCode();
    this.validIsurrance();
    this.setReadOnlyByData(data);
  }

  private setWarningSalaryWhenAddEmployee(data: any) {
    if(this.tableName !== 'adjustment') {
        return;
    }

    clearTimeout(this.validateTimer);
    this.validateTimer = setTimeout(() => {
      data.forEach((row, rowIndex) => {
        const isLeaf = row.origin.isLeaf  || row.options.isLeaf;
        if(!isLeaf) return;
        this.validChangeSalary(row, rowIndex);
      });
    }, 10);

  }

  private setReadOnlyByData(data: any) {
    
    data.forEach((row, rowIndex) => {
      const isLeaf = row.origin.isLeaf  || row.options.isLeaf;     
      if(!isLeaf) return;
      const indexOfEmployeeId = this.columns.findIndex(c => c.key === 'employeeId');
      const employeeId = row[indexOfEmployeeId];
      if(employeeId === null) return;

      // const indexOfSalary = this.columns.findIndex(c => c.key === 'salary');
      // const indexOfRatio = this.columns.findIndex(c => c.key === 'ratio');
      const indexOfContractTypeCode = this.columns.findIndex(c => c.key === 'contractTypeCode');
      // const salary = row[indexOfSalary];
      // const ratio = row[indexOfRatio];
      const contractTypeCode = row[indexOfContractTypeCode];
      if(ContactType.CT_HDKXDTH === contractTypeCode) {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfContractTypeCode + 2);
      }else {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfContractTypeCode + 2, true);
      }

      // if(salary > 0) {
      //   this.spreadsheet.setReadonly(Number(rowIndex), indexOfRatio);
      // }else {
      //   this.spreadsheet.setReadonly(Number(rowIndex), indexOfRatio, true);
      // }

      // if(ratio > 0) {
      //   this.spreadsheet.setReadonly(Number(rowIndex), indexOfSalary);
      // }else {
      //   this.spreadsheet.setReadonly(Number(rowIndex), indexOfSalary, true);
      // }

    });
  }

  private validChangeSalary(data: any, rowIndex) {
    const indexOfColumnPlan = this.columns.findIndex(c => c.key === 'planCode');
    const planCode = data[indexOfColumnPlan];
    if(planCode === 'DC') {
      const indexOfColumnSalaryNew = this.columns.findIndex(c => c.key === 'salaryNew');
      const indexOfColumnRatioNew = this.columns.findIndex(c => c.key === 'ratioNew');
      const indexOfColumnAllowanceSalaryNew = this.columns.findIndex(c => c.key === 'allowanceSalaryNew');
      const indexOfColumnAllowanceAdditionalNew = this.columns.findIndex(c => c.key === 'allowanceAdditionalNew');
      const indexOfColumnAllowanceLevelNew = this.columns.findIndex(c => c.key === 'allowanceLevelNew');
      const indexOfColumnAllowanceSeniorityNew = this.columns.findIndex(c => c.key === 'allowanceSeniorityNew');
      const indexOfColumnAllowanceSeniorityJobNew = this.columns.findIndex(c => c.key === 'allowanceSeniorityJobNew');

      const salaryNew = data[indexOfColumnSalaryNew];
      const ratioNew = data[indexOfColumnRatioNew];
      const allowanceSalaryNew = data[indexOfColumnAllowanceSalaryNew];
      const allowanceAdditionalNew = data[indexOfColumnAllowanceAdditionalNew];
      const allowanceLevelNew = data[indexOfColumnAllowanceLevelNew];
      const allowanceSeniorityNew = data[indexOfColumnAllowanceSeniorityNew];
      const allowanceSeniorityJobNew = data[indexOfColumnAllowanceSeniorityJobNew];

      const indexOfColumnSalary = this.columns.findIndex(c => c.key === 'salary');
      const indexOfColumnRatio = this.columns.findIndex(c => c.key === 'ratio');
      const indexOfColumnAllowanceSalary = this.columns.findIndex(c => c.key === 'allowanceSalary');
      const indexOfColumnAllowanceAdditional = this.columns.findIndex(c => c.key === 'allowanceAdditional');
      const indexOfColumnAllowanceLevel = this.columns.findIndex(c => c.key === 'allowanceLevel');
      const indexOfColumnAllowanceSeniority = this.columns.findIndex(c => c.key === 'allowanceSeniority');
      const indexOfColumnAllowanceSeniorityJob = this.columns.findIndex(c => c.key === 'allowanceSeniorityJob');
       

      const salary = data[indexOfColumnSalary];
      const ratio = data[indexOfColumnRatio];
      const allowanceSalary = data[indexOfColumnAllowanceSalary];
      const allowanceAdditional = data[indexOfColumnAllowanceAdditional];
      const allowanceLevel = data[indexOfColumnAllowanceLevel];
      const allowanceSeniority = data[indexOfColumnAllowanceSeniority];
      const allowanceSeniorityJob = data[indexOfColumnAllowanceSeniorityJob];
       
      // console.log(salary,salaryNew);
      // console.log(ratio,ratioNew);
      // console.log(allowanceSalary,allowanceSalaryNew);
      // console.log(allowanceAdditional,allowanceAdditionalNew);
      if ( Number(salary) === Number(salaryNew) && Number(ratio) === Number(ratioNew)
        && Number(allowanceSalary) === Number(allowanceSalaryNew) && Number(allowanceAdditional) === Number(allowanceAdditionalNew)
        && Number(allowanceLevel) === Number(allowanceLevelNew))
        //&& Number(allowanceSeniorityJob) === Number(allowanceSeniorityJobNew)  && Number(allowanceSeniority) === (allowanceSeniorityNew))

      {
        const fieldName = {
          name: 'Tiền lương mức đóng cũ',
          otherName:'Tiền lương mức đóng mới'
        };
        const messageError = 'Tiền lương mức đóng cũ, Tiền lương mức đóng mới chưa được điều chỉnh';
        this.spreadsheet.setCellError(fieldName, indexOfColumnSalary, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnRatio, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnAllowanceSalary, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnAllowanceAdditional, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnAllowanceLevel, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnAllowanceSeniority, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        this.spreadsheet.setCellError(fieldName, indexOfColumnAllowanceSeniorityJob, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
      }
    }else if(planCode === 'CD') {
      const indexOfColumnLevelWork = this.columns.findIndex(c => c.key === 'levelWork');
      const levelWork = data[indexOfColumnLevelWork];
      if (data.origin.levelWork === levelWork)
      {
        const fieldName = {
          name: 'Chức vụ cũ',
          otherName:'chức vụ mới'
        };
        const messageError = 'Chức vụ cũ, chức vụ mới chưa được điều chỉnh';
        this.spreadsheet.setCellError(fieldName, indexOfColumnLevelWork, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
      }
    }
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

  private updateEditorToColumn(key,  showCalendar = true, type = 'date', isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom, showCalendar);
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
    const indexOfCloumnRecipientsCityCode= this.columns.findIndex(c => c.key === 'recipientsCityCode');
    const cityCode = table.getValueFromCoords(indexOfCloumnRecipientsCityCode, r);
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
    // console.log(this.headerForm, 'validationCellByOtherCell');
    if (column.key === 'fromDate') {
      const dateOfDaclaration = this.getDateOfDeclaration();
      const toDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const toDateValueMoment = moment(toDateValue, DATE_FORMAT.ONLY_MONTH_YEAR);
        const dateOfDaclarationMoment = moment(dateOfDaclaration, DATE_FORMAT.ONLY_MONTH_YEAR);
        const isAfter = cellValueMoment.isAfter(toDateValueMoment);
        const isAfterDeclaration = cellValueMoment.isAfter(dateOfDaclarationMoment);
        // console.log(dateOfDaclarationMoment,cellValueMoment);
        if (isAfterDeclaration) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ tháng, năm',
            message: '<Từ tháng, năm> phải nhỏ hơn hoặc bằng tháng của tờ khai',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else if (isAfter) {
          validationColumn.validations = {
            required: true,
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ tháng, năm',
            message: '<Từ tháng, năm> phải nhỏ hơn hoặc bằng <Đến tháng, năm>',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }  else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ tháng, năm';
          // instance.jexcel.clearValidation(y, cell);
          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ tháng, năm';
        // instance.jexcel.clearValidation(y, cell);
        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
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
          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: true
        };
        validationColumn.fieldName = 'Từ tháng, năm';
        instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'contractTypeFromDate') {
      const toDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (toDateValue && cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const toDateValueMoment = moment(toDateValue, DATE_FORMAT.FULL);
        const isAfter = cellValueMoment.isAfter(toDateValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'contractTypeToDate') {
      const fromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[Number(cell) - 1];

      if (cellValue && fromDateValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);        
        const fromDateValueMoment = moment(fromDateValue, DATE_FORMAT.FULL);
        const isAfter = fromDateValueMoment.isAfter(cellValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }
      } else {

        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'workTypeFromDate') {
      const toDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (toDateValue && cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const toDateValueMoment = moment(toDateValue, DATE_FORMAT.FULL);
        const isAfter = cellValueMoment.isAfter(toDateValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'workTypeToDate') {
      const fromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[Number(cell) - 1];

      if (cellValue && fromDateValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const fromDateValueMoment = moment(fromDateValue, DATE_FORMAT.FULL);
        const isAfter = fromDateValueMoment.isAfter(cellValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'careFromDate') {
      const toDateValue = this.spreadsheet.getValueFromCoords(Number(cell) + 1, y);
      const validationColumn = this.columns[cell];

      if (toDateValue && cellValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const toDateValueMoment = moment(toDateValue, DATE_FORMAT.FULL);
        const isAfter = cellValueMoment.isAfter(toDateValueMoment);

        if (isAfter) {
          validationColumn.validations = {
           lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'careTypeToDate') {
      const fromDateValue = this.spreadsheet.getValueFromCoords(Number(cell) - 1, y);
      const validationColumn = this.columns[Number(cell) - 1];

      if (cellValue && fromDateValue) {
        const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
        const fromDateValueMoment = moment(fromDateValue, DATE_FORMAT.FULL);
        const isAfter = fromDateValueMoment.isAfter(cellValueMoment);

        if (isAfter) {
          validationColumn.validations = {
            lessThan: true
          };
          validationColumn.fieldName = {
            name: 'Từ ngày',
            message: '<Từ ngày> phải nhỏ hơn hoặc bằng <Đến ngày làm việc>',
          };

          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        } else {
          validationColumn.validations = {
            required: false
          };
          validationColumn.fieldName = 'Từ ngày';
          // instance.jexcel.clearValidation(y, Number(cell) - 1);
          instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }
      } else {
        validationColumn.validations = {
          required: false
        };
        validationColumn.fieldName = 'Từ ngày';
        // instance.jexcel.clearValidation(y, Number(cell) - 1);
        instance.jexcel.validationCell(y, Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
      }
    } else if (column.key === 'salary') { 
      const indexOfSalary =  this.columns.findIndex(c => c.key === 'salary');
      const salary = this.spreadsheet.getValueFromCoords(indexOfSalary, y);
      const validationColumn = this.columns[Number(cell)];
      delete validationColumn.validations.min;
      if (Number(salary) > 0) {
        // const maxSalary = Number(this.salaryAreas.salaray) * 20;
        validationColumn.validations = {
          min: Number(this.salaryAreas.salaray),
          // max: maxSalary,
         };         
      }
      validationColumn.fieldName = 'Tiền lương';
      instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
    }  
    this.handleEvent({
      type: 'validate',
      part: '',
      parentKey: '',
      user: {}
    });
  }

  private validIsurrance() {
    setTimeout(() => {
        const indexIsExitsIsurranceNo = this.columns.findIndex(c => c.key === 'isExitsIsurranceNo');
        const indexisurranceCode = this.columns.findIndex(c => c.key === 'isurranceCode');
         
        this.data.forEach((d, y) => {
          const isRequiredIsurranceNo = d.data.options.isRequiredIsurranceNo;
          const isExitsIsurranceNo =  d.data[indexIsExitsIsurranceNo];
            if(!isExitsIsurranceNo && !isRequiredIsurranceNo) {
              const column = this.columns[indexisurranceCode];
              const validIsurranceNo = {
                ...column.validations                
              }
              validIsurranceNo.required = false;
              this.spreadsheet.validationCell(y, indexisurranceCode, column.fieldName ? column.fieldName : column.title, validIsurranceNo);
            }
        });

        this.handleEvent({
          type: 'validate',
          parentKey: '',
          part: '',
          user: {}
        });
    }, 10);
  }

  private validationCellByPlanCode() {

    setTimeout(() => {
      const indexPlanCode = this.columns.findIndex(c => c.key === 'planCode');
      this.data.forEach((d, y) => {
        //lấy Mã phướng án
          const planCode =  d.data[indexPlanCode];
          if (planCode) {
            const columnIndexes = [];
            Object.keys(validationColumnsPlanCode[planCode] || {}).forEach(column => {
              const x = this.columns.findIndex(c => c.key === column);
                  if (x > -1) {
                    columnIndexes.push(x);
                  }
            });
            columnIndexes.forEach(x => {
              const column = this.columns[x];
              this.spreadsheet.validationCell(y, x, column.fieldName ? column.fieldName : column.title, validationColumnsPlanCode[planCode][column.key]);
            });
          }

      });

      this.handleEvent({
        type: 'validate',
        parentKey: '',
        part: '',
        user: {}
      });

    }, 10);
  }

  private getDateOfDeclaration() {
    console.log(this.headerForm);
    const date = new Date();
    let month = (date.getMonth() + 1).toString();
    if (this.headerForm.month) {
      month = this.headerForm.month;
    }

    let year =  date.getFullYear().toString();
    if (this.headerForm.year) {
      year = this.headerForm.year;
    }
    if (month.length === 1) {
      month = '0' + month;
    }
    const dateOfDeclaration = month + '/' + year;
    return dateOfDeclaration;
  }

}
