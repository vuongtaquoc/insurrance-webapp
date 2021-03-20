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
  selector: 'app-register-allocation-editor',
  templateUrl: './table-editor.component.html',
  styleUrls: ['./table-editor.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterAllocationEditorComponent implements AfterViewInit, OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() salaryAreas: any;
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
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
  private validateTimer;
  private eventsSubscription: Subscription;
  private validateSubscription: Subscription;
  private deleteTimer;
  private differents: any = {};
  eventValid: string  = 'adjust-general:validate';
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
    this.eventsSubscription.unsubscribe();
    this.validateSubscription.unsubscribe(); 
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
    eventEmitter.destroy(this.handlers);
    clearTimeout(this.validateTimer);
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
        this.validIsurrance();
        this.validationCellByOtherCell(value, column, r, instance, c);
        const isLeaf = this.data[r].origin.isLeaf  || this.data[r].isLeaf;       
        if(isLeaf) {
          clearTimeout(this.validateTimer);
          this.validateTimer = setTimeout(() => {
            this.validRatio(this.spreadsheet.getJson()[r], r);
            this.validMoneyPlayer(this.spreadsheet.getJson()[r], r);
          }, 10);
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
          nzContent: 'Hãy chọn NLĐ ở danh sách bên trái để kê khai. Nếu thêm mới NLĐ nhấn dấu + (góc trên bên trái) hoặc sử dụng chức năng Lấy file mẫu và Nhập excel để thực hiện.'
        });
      }
    });

    this.updateEditorToColumn('dateSign', 'date');
    this.updateEditorToColumn('birthday', 'month', true);
    this.updateEditorToColumn('fromDate', 'month');
    this.updateEditorToColumn('toDate', 'month');
    this.updateAutoCompleteToColumn('hospitalFirstRegistCode');
    this.updateEditorToColumn('fromDateJoin', 'date');
    this.updateEditorToColumn('motherDayDead', 'date');

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

    this.setReadOnlyByData(data);
    this.validIsurrance();
    this.setWarningRatioWhenAddEmployee(data);
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
        const data = Object.values(this.spreadsheet.getJson());
        const leaf = data.filter((d: any) => d.options.isLeaf);
        const initialize = leaf.filter((d: any) => d.options.isInitialize);
        eventEmitter.emit(this.eventValid, {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors()),
          leaf,
          initialize
        });
      }, 10);  
    } else if (type === 'deleteUser') {
      this.handleDeleteUser(user);
    } else {   
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
    setTimeout(() => {
      if (column.key === 'fromDate') {
        const indexOftoDate =  this.columns.findIndex(c => c.key === 'toDate');
        const toDateValue = this.spreadsheet.getValueFromCoords(indexOftoDate, y);
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
            instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
          }
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ tháng, năm';
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
            instance.jexcel.validationCell(y,  Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
          }
        } else {
          validationColumn.validations = {
            required: true
          };
          validationColumn.fieldName = 'Từ tháng, năm';
          instance.jexcel.validationCell(y,  Number(cell) - 1, validationColumn.fieldName, validationColumn.validations);
        }
      } else if (column.key === 'isReductionWhenDead') {
          const columnIndex = Number(cell) + 1; 
          const motherDayDead = this.columns[columnIndex];
          if (cellValue) {
            motherDayDead.validations = { required: true };
            this.spreadsheet.setReadonly(Number(y), columnIndex, true);
          }else  {
            motherDayDead.validations = {};
            this.spreadsheet.setReadonly(Number(y), columnIndex);
          }
          motherDayDead.fieldName = 'Ngày chết';
          instance.jexcel.validationCell(y, columnIndex, motherDayDead.fieldName, motherDayDead.validations);
      } else if(column.key === 'dateSign') {
          const indexOfFromDateJoin =  this.columns.findIndex(c => c.key === 'fromDateJoin');
          const fromDateJoinValue = this.spreadsheet.getValueFromCoords(indexOfFromDateJoin, y);
          const validationColumn = this.columns[cell];

          if (fromDateJoinValue && cellValue) {
            const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
            const toDateValueMoment = moment(fromDateJoinValue, DATE_FORMAT.FULL);
            const isAfter = cellValueMoment.isAfter(toDateValueMoment);

            if (isAfter) {
              validationColumn.validations = {
                required: true,
                lessThan: true
              };
              validationColumn.fieldName = {
                name: 'Ngày biên lai',
                message: '<Ngày biên lai> phải nhỏ hơn hoặc bằng <Từ ngày tham gia>',
              };

              instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
            } else {
              validationColumn.validations = {
                required: true
              };
              validationColumn.fieldName = 'Ngày biên lai';
              instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
            }

          } else {

            validationColumn.validations = {
              required: true
            };
            validationColumn.fieldName = 'Ngày biên lai';
            instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);

          }
      } else if(column.key === 'fromDateJoin') {
        const indexOfDateSign =  this.columns.findIndex(c => c.key === 'dateSign');
        const indexOfContractNo =  this.columns.findIndex(c => c.key === 'contractNo');
        const fromdateSignValue = this.spreadsheet.getValueFromCoords(indexOfDateSign, y);
        const contractNo = this.spreadsheet.getValueFromCoords(indexOfContractNo, y);
        const validationColumn = this.columns[indexOfDateSign];
        if (cellValue && fromdateSignValue && contractNo) {
          const cellValueMoment = moment(cellValue, DATE_FORMAT.FULL);
          const fromDateValueMoment = moment(fromdateSignValue, DATE_FORMAT.FULL);
          const isAfter = fromDateValueMoment.isAfter(cellValueMoment);
          if (isAfter) {
            validationColumn.validations = {
              required: true,
              lessThan: true
            };
            validationColumn.fieldName = {
              name: 'Ngày biên lai',
              message: '<Ngày biên lai> phải nhỏ hơn hoặc bằng <Từ ngày tham gia>',
            };
  
            instance.jexcel.validationCell(y, indexOfDateSign, validationColumn.fieldName, validationColumn.validations);
          } else {
            validationColumn.validations = {
              required: true
            };
            validationColumn.fieldName = 'Ngày biên lai';
            instance.jexcel.validationCell(y, indexOfDateSign, validationColumn.fieldName, validationColumn.validations);
          }
        } else {
          if(contractNo !== '') {
            validationColumn.validations = {
              required: true
            };
          }else {
            delete validationColumn.validations.required;
          }
          validationColumn.fieldName = 'Ngày biên lai';
          instance.jexcel.validationCell(y, indexOfDateSign, validationColumn.fieldName, validationColumn.validations);
        }
      } else if (column.key ==='paymentMethodCode') {
        const indexOfNumberMonthJoin =  this.columns.findIndex(c => c.key === 'numberMonthJoin');
        const validationColumn = this.columns[indexOfNumberMonthJoin];
        delete validationColumn.validations.max;
        if (cellValue === 'VS') {
          validationColumn.validations = {
            required: true,
            min: 1,
            max: 60
          };          
        } else if(cellValue === 'TH') {
          validationColumn.validations = {
            required: true,
            min: 1,
            max: 120
          };
        } else if(cellValue === 'DB') {
          validationColumn.validations = {
            required: true,
            min: 1
          };
        }
        validationColumn.fieldName = 'Số tháng';
        instance.jexcel.validationCell(y, indexOfNumberMonthJoin, validationColumn.fieldName, validationColumn.validations);
      } else if (column.key === 'salary') { 
        const validationColumn = this.columns[Number(cell)];
        const indexOfSalary =  this.columns.findIndex(c => c.key === 'salary');
        const indexOfSumRatio =  this.columns.findIndex(c => c.key === 'sumRatio');
        const salary = this.spreadsheet.getValueFromCoords(indexOfSalary, y);
        const sumRatio = this.spreadsheet.getValueFromCoords(indexOfSumRatio, y);
        delete validationColumn.validations.min;
        if (Number(sumRatio) === 0) {
          validationColumn.validations.min = Number(this.salaryAreas.salaray);
        }
        if (Number(salary) > 0) {
          validationColumn.validations.min = Number(this.salaryAreas.salaray);
        }
        validationColumn.fieldName = 'Tiền lương';
        instance.jexcel.validationCell(y, cell, validationColumn.fieldName, validationColumn.validations);
      } else if (column.key === 'sumRatio') {
          const validationColumn = this.columns[Number(cell) -1];
          if (!validationColumn.readOnly) {
            const indexOfSumRatio =  this.columns.findIndex(c => c.key === 'sumRatio');
            const sumRatio = this.spreadsheet.getValueFromCoords(indexOfSumRatio, y);
            delete validationColumn.validations.min;
            if (Number(sumRatio) === 0) {
              validationColumn.validations.min = Number(this.salaryAreas.salaray);
            }
            validationColumn.fieldName = 'Tiền lương';
            instance.jexcel.validationCell(y, Number(cell) -1, validationColumn.fieldName, validationColumn.validations);
          } else {
            const validationColumnSumRatio = this.columns[Number(cell)];
            validationColumnSumRatio.validations.min = 1;
            validationColumnSumRatio.fieldName = 'Tổng hệ số';
            instance.jexcel.validationCell(y, cell, validationColumnSumRatio.fieldName, validationColumnSumRatio.validations);
          }           
        } else if (column.key === 'contractNo') { 
          const indexOfDateSign =  this.columns.findIndex(c => c.key === 'dateSign');
          const indexOfContractNo =  this.columns.findIndex(c => c.key === 'contractNo');
          const contractNo = this.spreadsheet.getValueFromCoords(indexOfContractNo, y);
          const validationColumn = this.columns[indexOfDateSign];
          if (contractNo !== '') {
            validationColumn.validations = {
              required: true
            };
            validationColumn.fieldName = 'Ngày biên lai';
            instance.jexcel.validationCell(y, indexOfDateSign, validationColumn.fieldName, validationColumn.validations);
          }else {
            delete validationColumn.validations.required;
            validationColumn.fieldName = 'Ngày biên lai';
            instance.jexcel.validationCell(y, indexOfDateSign, validationColumn.fieldName, validationColumn.validations);
          }
        }  

      this.handleEvent({
        type: 'validate',
        deletedIndexes: [],
        user: {}
      });
    }, 50);
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

        if (column.key === 'isReductionWhenDead') {
          return { ...combine, [ column.key ]: column.key === 'isReductionWhenDead' ? +array[current] : array[current]};
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current]};
      },
      {}
    );

    if (array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }

    return object;
  }

  private async getHospitalsByCityCode(table, keyword, c, r) {
    const indexOfCloumnRecipientsCityCode= this.columns.findIndex(c => c.key === 'recipientsCityCode');
    const cityCode = table.getValueFromCoords(indexOfCloumnRecipientsCityCode, r);

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

  private validIsurrance() {
    setTimeout(() => {
        const indexIsExitsIsurranceNo = this.columns.findIndex(c => c.key === 'isExitsIsurranceNo');
        const indexIsurranceCode = this.columns.findIndex(c => c.key === 'isurranceCode');         
        this.data.forEach((d, y) => {
          const isRequiredIsurranceNo = d.data.options.isRequiredIsurranceNo;
          const isExitsIsurranceNo =  d.data[indexIsExitsIsurranceNo];
            if(!isExitsIsurranceNo && !isRequiredIsurranceNo) {
              const column = this.columns[indexIsurranceCode];
              const validIsurranceNo = {
                ...column.validations,                               
              }
              validIsurranceNo.required = false;
              this.spreadsheet.validationCell(y, indexIsurranceCode, column.fieldName ? column.fieldName : column.title, validIsurranceNo);
            }
        });

        this.handleEvent({
          type: 'validate',
          deletedIndexes: [],
          user: {}
        });
    }, 10);
  }

  private setWarningRatioWhenAddEmployee(data: any) {
    clearTimeout(this.validateTimer);
    this.validateTimer = setTimeout(() => {
      data.forEach((row, rowIndex) => {
        const isLeaf = row.origin.isLeaf  || row.options.isLeaf;       
        if(!isLeaf) return;
        this.validRatio(row, rowIndex);
        this.validMoneyPlayer(row, rowIndex);
      });
    }, 10);

  }

  private validRatio(data: any, rowIndex) {
    const indexOfEmployeeId = this.columns.findIndex(c => c.key === 'employeeId');
    const employeeId = data[indexOfEmployeeId];
    if (Number(employeeId) === 0) return;
    const indexOfColumnSalary = this.columns.findIndex(c => c.key === 'salary');
    const indexOfColumnSumRatio = this.columns.findIndex(c => c.key === 'sumRatio');
    const salary = data[indexOfColumnSalary];   
    const sumRatio = data[indexOfColumnSumRatio];
    if (this.salaryAreas.level === 5) {
      if (sumRatio == 0) {
        if (Number(salary) < this.salaryAreas.salaray || Number(salary) > this.salaryAreas.maxSalry) {
          const fieldName = {
            name: 'Mức thu nhập lương',
            otherName:'Mức thu nhập lương'
          };      
           
          const messageError = 'Tiền lương phải nằm trong khoảng ' + this.salaryAreas.salaray + ' đến' + this.salaryAreas.maxSalry;
          this.spreadsheet.setCellError(fieldName, indexOfColumnSalary, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
        }
      }
    }
  }

  private setReadOnlyByData(data: any) {
    
    data.forEach((row, rowIndex) => {
      const isLeaf = row.origin.isLeaf  || row.options.isLeaf;     
      if(!isLeaf) return;
      const indexOfEmployeeId = this.columns.findIndex(c => c.key === 'employeeId');
      const employeeId = row[indexOfEmployeeId];
      if(employeeId === null) return;

      const indexOfTyleNSNN = this.columns.findIndex(c => c.key === 'tyleNSNN');
      const indexOfTyleTCCNHTK = this.columns.findIndex(c => c.key === 'tyleTCCNHTK');
      const tyleNSNN = row[indexOfTyleNSNN];
      const tyleTCCNHTK = row[indexOfTyleTCCNHTK];

      if(Number(tyleNSNN) > 0) {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfTyleNSNN + 1);
      }else {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfTyleNSNN + 1, true);
      }
      if(Number(tyleTCCNHTK) > 0) {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfTyleTCCNHTK + 1);
      }else {
        this.spreadsheet.setReadonly(Number(rowIndex), indexOfTyleTCCNHTK + 1, true);
      }
    });
  }

  private validMoneyPlayer(data: any, rowIndex) {    
    const indexOfEmployeeId = this.columns.findIndex(c => c.key === 'employeeId');
    const employeeId = data[indexOfEmployeeId];
    if (Number(employeeId)===0) return;

    const indexOfSoTienNSDP = this.columns.findIndex(c => c.key === 'soTienNSDP');
    const indexOfTyleNSDP = this.columns.findIndex(c => c.key === 'tyleNSDP');
    const indexOfToChuCaNhanHTKhac = this.columns.findIndex(c => c.key === 'toChuCaNhanHTKhac');
    const indexOfMoneyPayment = this.columns.findIndex(c => c.key === 'moneyPayment');
    const indexOfNumberMonthJoin = this.columns.findIndex(c => c.key === 'numberMonthJoin');
    const soTienNSDP = data[indexOfSoTienNSDP];
    const toChuCaNhanHTKhac = data[indexOfToChuCaNhanHTKhac];
    const moneyPayment = data[indexOfMoneyPayment];
    const numberMonthJoin = data[indexOfNumberMonthJoin];
    const totalSubport = Number(soTienNSDP) + Number(toChuCaNhanHTKhac);
    if(totalSubport > Number(moneyPayment) && Number(numberMonthJoin) > 0 ) {
      const fieldName = {
        name: 'Hỗ trợ thêm',
        otherName:'Hỗ trợ thêm'
      }; 

      const messageError = 'Tổng mức hỗ trợ phải nhỏ hơn hoặc bằng số tiền phải đóng';
      this.spreadsheet.setCellError(fieldName, indexOfTyleNSDP, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
      this.spreadsheet.setCellError(fieldName, indexOfToChuCaNhanHTKhac, rowIndex, { duplicateOtherField: 'otherXValue' }, { duplicateOtherField: false }, true, messageError);
    }
  }

}
