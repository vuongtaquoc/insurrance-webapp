import { Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';

import { CategoryService, EmployeeService, BankService } from '@app/core/services';
import { DATE_FORMAT } from '@app/shared/constant';

import { eventEmitter } from '@app/shared/utils/event-emitter';

import {
  DeclarationService
} from '@app/core/services';
import { HolidayConfig } from '@app/shared/constant-valid';

export class RegimeApprovalBaseComponent {
  @Input() data: any;
  @Input() hasForm = false;
  @Input() declarationId: string;
  @Input() pageName: string;
  @Input() pageCode: string;
  @Input() form: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onHiddenSidebar: EventEmitter<any> = new EventEmitter();
  panel: any = {
    part1: { active: true },
    part2: { active: false }
  };
  headers: any = {
    part1: {
      nested: [],
      columns: []
    },
    part2: {
      nested: [],
      columns: []
    }
  };
  declarations: any = {
    part1: {
      origin: [],
      table: []
    },
    part2: {
      origin: [],
      table: []
    }
  };
  employeeSelected: any[] = [];
  employeeSubject: Subject<any> = new Subject<any>();
  tableSubject: Subject<any> = new Subject<any>();
  isHiddenSidebar = false;
  isBlinking = false;
  tableName: any = {};
  handlers: any = [];
  timer: any;

  constructor(
    protected declarationService: DeclarationService,
    protected modalService: NzModalService,
    protected categoryService: CategoryService,
    protected employeeService: EmployeeService,
    protected bankService: BankService,
  ) {}

  initializeTableColumns(part, nested, columns) {
    this.headers[part].nested = nested;
    this.headers[part].columns = columns;
  }

  handleAddEmployee(part, type) {
    if (!this.employeeSelected.length) {
      return this.modalService.warning({
        nzTitle: 'Chưa có nhân viên nào được chọn',
      });
    }

    const declarations = [ ...this.declarations[part].table ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const declarationParent = declarations.find(c => c.key === type);
    const genderCanAdd = (declarationParent.genderAdd || '').split(',');
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);
    
    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);
      let showCanAddEmployee = false;
      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;
        // replace     
        if(typeof(employee.gender) !== 'boolean') {
          employee.gender = employee.gender === '1';
        }
        employee.bankCode = '';
        employee.subsidizeReceipt = '0';
        employee.conditionPrenatal = '0';
        employee.bankName = '';
        employee.accountHolder = '';
        employee.bankAccount = '';        
        let gender = '1';
        if(employee.gender) {
          gender = '0';
        }
        this.setValueDefault(part, type,  employee);
        const isCanAdd =  genderCanAdd.indexOf(gender) > -1;
        if (accepted && isCanAdd) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize declarations
            declarations.splice(childLastIndex, 1);

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[part].columns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[part].columns));
          }
        } else {
          showCanAddEmployee = true;
        }
      });

      if(showCanAddEmployee) {
        this.modalService.warning({
          nzTitle: 'Tiêu chí không phù hợp với giớ tính đối tượng kê khai',
        });
      }
      // update orders
      this.updateOrders(declarations);

      this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[part].columns));
      });

      this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);
    }

    // active collapse
    if (part === 'part1') {
      this.panel.part1.active = true;
      this.panel.part2.active = false;
    } else if (part === 'part2') {
      this.panel.part1.active = false;
      this.panel.part2.active = true;
    }

    // update origin data
    const records = this.toTableRecords(declarations);

    this.declarations[part].origin = Object.values(this.updateOrigin(records, part));

    this.onChange.emit({
      part,
      data: this.declarations[part].origin
    });

    // clean employee
    this.employeeSubject.next({
      type: 'clean'
    });
    this.employeeSelected.length = 0;
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      type: 'readonly',
      part,
      data: this.declarations[part].table
    });    
    eventEmitter.emit('unsaved-changed');
  }

  setValueDefault(part, type, employee) {

    if (this.tableName['sicknessesPart1'] === part) {
      
      if (type === 'III') 
      {
        employee.childrenNumberSick = 1;
      }

    } else if(this.tableName['maternityPart1'] === part) {
      if (type === 'III_1' || type === 'III_2' || type === 'III_3'|| type === 'IV' || type === 'V_1' || type === 'V_2' || type === 'VI_1' || type === 'VI_2' || type === 'VII' || type === 'VIII')
      {
        employee.childrenNumber = 1;
      } else  if(type === 'IX') {
        if(employee.gender) {
          employee.planCode = 'TT1';
        } else {
          employee.planCode = 'TT2';
        }
      }
    }
  }

  handleSort({ direction, source, dist }, part) {
    const declarations = [ ...this.declarations[part].table ];
    const current = declarations[source];

    // remove element
    declarations.splice(source, 1);

    // add element to new position
    declarations.splice(dist, 0, current);

    // update orders
    this.updateOrders(declarations);

    this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      type: 'readonly',
      part,
      data: this.declarations[part].table
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleUserAdded({ tableName, y, employee }) {
    if (!this.tableName[tableName]) return;
    const part = tableName.toLowerCase().indexOf('part1') > -1 ? 'part1' : 'part2';
    const declarations = [ ...this.declarations[part].table ];
    const row = declarations[y];

    row.origin = {
      ...row.origin,
      ...employee
    };
    row.isInitialize = false;

    this.headers[part].columns.forEach((column, index) => {
      if (employee[column.key] !== null && typeof employee[column.key] !== 'undefined') {
        row.data[index] = employee[column.key];
      }
    });

    // update orders
    this.updateOrders(declarations);

    this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      type: 'readonly',
      part,
      data: this.declarations[part].table
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleUserDeleteTables(user) {
    this.handleUserDeleted(user, 'part1');
    this.handleUserDeleted(user, 'part2');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserDeleted(user, part) {
    this.tableSubject.next({
      type: 'deleteUser',
      user,
      part,
      deletedIndexes: []
    });
  }

  handleUserUpdateTables(user) {
    this.handleUserUpdated(user, 'part1');
    this.handleUserUpdated(user, 'part2');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserUpdated(user, part) {
    const declarations = [ ...this.declarations[part].table ];
    const declarationUsers = declarations.filter(d => {
      return d.isLeaf && d.origin && (d.origin.employeeId || d.origin.id) === user.id;
    });
    declarationUsers.forEach(declaration => {
      declaration.origin = {
        ...declaration.origin,
        ...user
      };

      this.headers[part].columns.forEach((column, index) => {
        if (user[column.key] !== null && typeof user[column.key] !== 'undefined') {
          declaration.data[index] = user[column.key];
        }
      });
    });

    // update orders
    this.updateOrders(declarations);

    this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      type: 'readonly',
      part,
      data: this.declarations[part].table
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
    if (!this.employeeSelected.length) return;

    this.isBlinking = true;
  }

  handleChangeTable({ instance, cell, c, r, records }, part) {
    // console.log(records[r], 'records');    
    const parentKey = records[r].options.parentKey;
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column =  this.headers[part].columns[c];
      if (column.key === 'diagnosticCode') {
        // const diagnosticName = cell.innerText.split(' - ').pop();
        // this.updateNextColumns(instance, r, diagnosticName, [ c + 1 ]);        
        this.categoryService.getCategoryByTypeAndCode('diagnosticCode', cell.innerText).subscribe(data => {
           this.updateNextColumns(instance, r, data.name, [ c + 1 ]);
        });
      } else if (column.key === 'bankName') {
        if (cell.innerText !== '') {
          const indexColunmBakCode = this.headers[part].columns.findIndex(d => d.key === 'bankCode');
          this.bankService.getDetailByName(cell.innerText).subscribe(data => {
            this.updateNextColumns(instance, r, data.id, [ indexColunmBakCode]);
          });  
        }
      } else if(column.key === 'childrenBirthday') {
        const indexDateStartWork = this.headers[part].columns.findIndex(d => d.key === 'dateStartWork');
        const dateStartWorkValue = instance.jexcel.getValueFromCoords(indexDateStartWork, r);
        const indexChildrenBirthday = this.headers[part].columns.findIndex(d => d.key === 'childrenBirthday');
        const childrenBirthdayValue = instance.jexcel.getValueFromCoords(indexChildrenBirthday, r);
        if(this.tableName['maternityPart1'] === part && !dateStartWorkValue && childrenBirthdayValue && (parentKey === 'V_1' || parentKey === 'V_2'))
        {
          const childrenBirthdayMoment =  moment(childrenBirthdayValue, DATE_FORMAT.FULL).add('months', 2);
          this.updateNextColumns(instance, r, childrenBirthdayMoment.format(DATE_FORMAT.FULL), [ indexDateStartWork ]);
        }
         
      } else if (column.key === 'regimeFromDate' || column.key === 'regimeToDate') {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          let regimeFromDateValue;
          let regimeToDateValue;
          let totalColumn;

          if (column.key === 'regimeFromDate') {
            const indexColunmRegimeRequestDate = this.headers[part].columns.findIndex(d => d.key === 'regimeRequestDate');
            regimeFromDateValue = instance.jexcel.getValueFromCoords(c, r);
            regimeToDateValue = instance.jexcel.getValueFromCoords(c + 1, r);
            this.updateNextColumns(instance, r, regimeFromDateValue, [ indexColunmRegimeRequestDate]);
            totalColumn = c + 2;
          } else {
            regimeFromDateValue = instance.jexcel.getValueFromCoords(c - 1, r);
            regimeToDateValue = instance.jexcel.getValueFromCoords(c, r);
            totalColumn = c + 1;
          }
          if (regimeFromDateValue && regimeToDateValue) {            
            const totalValue = this.caculatorDateDiff(regimeFromDateValue,  regimeToDateValue, part, parentKey); //this.getDayWorker(this.parseDate(regimeFromDateValue), this.parseDate(regimeToDateValue));
            instance.jexcel.setValueFromCoords(totalColumn, r, totalValue);
          }
        }, 100);
      }else if(column.key ==='subsidizeReceipt') {
       
        const subsidizeReceipt = records[r][c];
        if(subsidizeReceipt === 'ATM') {
          this.updateBankAccountOfEmployee(instance, records, r, c, part);
        }else {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
              this.updateNextColumns(instance, r, '', [ c + 1 ]);
              this.updateNextColumns(instance, r, '', [ c + 2 ]);
              this.updateNextColumns(instance, r, '', [ c + 3 ]);
          }, 10);
        }
        
      }
    }

    // update declarations
    this.declarations[part].table.forEach((declaration, index) => {
      const record = records[index];

      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });

      // declaration.data.options.isInitialize = false;
      // declaration.isInitialize = false;
    });

    const rowChange: any = this.declarations[part].table[r];

    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;

    // update origin data
    this.declarations[part].origin = Object.values(this.updateOrigin(records, part));

    this.onChange.emit({
      part,
      data: this.declarations[part].origin
    });
    this.tableSubject.next({
      type: 'validate'
    });
    eventEmitter.emit('unsaved-changed');
  }

  private updateNextColumns(instance, r, value, nextColumns = [], force = false) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
      instance.jexcel.setValue(columnName, value, force);
    });
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }, part) {
    const declarations = [ ...this.declarations[part].table ];
    let row: any = {};

    const beforeRow: any = declarations[insertBefore ? rowNumber - 1 : rowNumber];
    const afterRow: any = declarations[insertBefore ? rowNumber : rowNumber + 1];

    const data: any = [];

    row.data = data;
    row.isInitialize = true;
    row.isLeaf = true;
    row.origin = origin;
    row.options = options;

    if (beforeRow.isLeaf && !afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
      row.genderAdd = beforeRow.genderAdd;  
      row.groupObject = beforeRow.groupObject;
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
      row.groupObject = afterRow.groupObject;
      row.genderAdd = beforeRow.genderAdd;  
    } else if (beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
      row.groupObject = beforeRow.groupObject;
      row.genderAdd = beforeRow.genderAdd;  
    }

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);

    this.updateOrders(declarations);

    this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);

    const records = this.toTableRecords(declarations);
    this.declarations[part].origin = Object.values(this.updateOrigin(records, part));
    this.onChange.emit({
      part,
      data: this.declarations[part].origin
    });

    this.tableSubject.next({
      type: 'validate'
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteTableData({ rowNumber, numOfRows, records }, part) {
    const declarations = [ ...this.declarations[part].table ];

    const beforeRow = records[rowNumber - 1];
    const afterRow = records[rowNumber];

    if (!((beforeRow.options && beforeRow.options.isLeaf) || (afterRow.options && afterRow.options.isLeaf))) {
      const row: any = declarations[rowNumber];
      const origin = { ...row.data.origin };
      const options = { ...row.data.options };

      origin.employeeId = 0;
      origin.id = 0;

      row.data = [];
      row.origin = origin;
      row.options = options;
      row.isInitialize = true;

      if (!(beforeRow.options && beforeRow.options.isLeaf) && !(afterRow.options && afterRow.options.isLeaf)) {
        const nextRow: any = declarations[rowNumber + 1];

        if (nextRow.isLeaf) {
          declarations.splice(rowNumber + 1, numOfRows - 1);
        }
      }
    } else {
      declarations.splice(rowNumber, numOfRows);
    }

    // declarations.splice(rowNumber, numOfRows);

    this.updateOrders(declarations);

    this.declarations[part].table = this.declarationService.updateFormula(declarations, this.headers[part].columns);

    // update origin data
    this.declarations[part].origin = Object.values(this.updateOrigin(records, part));

    this.onChange.emit({
      part,
      data: this.declarations[part].origin
    });

    this.tableSubject.next({
      type: 'validate'
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleFocus() {
    if (!this.employeeSelected.length) return;

    this.isBlinking = true;

    setTimeout(() => this.isBlinking = false, 5000);
  }

  collapseChange(isActive, part) {
    if (part === 'part1') {
      this.panel.part1.active = isActive;
      this.panel.part2.active = false;
    }

    if (part === 'part2') {
      this.panel.part1.active = false;
      this.panel.part2.active = isActive;
    }
  }

  updateOrders(declarations) {
    const order: { index: 0, key: string } = { index: 0, key: '' };

    declarations.forEach((declaration, index) => {
      if (declaration.hasLeaf) {
        order.index = 0;
        order.key = declaration.key;
      }

      if (declaration.isLeaf && declaration.parentKey === order.key) {
        order.index += 1;

        declaration.data[0] = order.index;
      }
    });
  }

  arrayToProps(array, columns, part) {
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'calendar') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );

    if (array.origin && array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }

    object.part = part === 'part1' ? 'I' : 'II';

    return object;
  }

  handleToggleSidebar() {
    this.isHiddenSidebar = !this.isHiddenSidebar;

    this.onHiddenSidebar.emit(this.isHiddenSidebar);
  }

  updateSourceToColumn(tableHeaderColumns: any, key: string, sources: any) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  updateFilterToColumn(tableHeaderColumns, key, filterCb) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.filter = filterCb;
    }
  }

  private updateOrigin(records, part) {
    const declarations = {};

    records.forEach(d => {
      if (!d.options.hasLeaf && !d.options.isLeaf) {
        declarations[d.options.key] = { ...d.origin, part: part === 'part1' ? 'I' : 'II' };
      } else if (d.options.hasLeaf) {
        declarations[d.options.key] = {
          ...d.origin,
          part: part === 'part1' ? 'I' : 'II',
          declarations: []
        };
      } else if (d.options.isLeaf) {
        declarations[d.options.parentKey].declarations.push(this.arrayToProps(d, this.headers[part].columns, part));
      }
    });

    return declarations
  }

  protected toTableRecords(data) {
    const records = [];

    data.forEach((declaration, i) => {
      const record = {
        origin: declaration.origin,
        options: {
          hasLeaf: declaration.hasLeaf,
          isLeaf: declaration.isLeaf,
          parentKey: declaration.parentKey,
          key: declaration.key,
          planType: declaration.planType,
          groupObject: declaration.groupObject,
          genderAdd: declaration.genderAdd
        }
      };

      declaration.data.forEach((d, j) => record[j] = d);

      records.push(record);
    });

    return records;
  }

  protected updateOriginByPart(part) {
    const records = this.toTableRecords([ ...this.declarations[part].table ]);

    this.declarations[part].origin = Object.values(this.updateOrigin(records, part));

    this.onChange.emit({
      part,
      data: this.declarations[part].origin
    });
    this.tableSubject.next({
      type: 'validate'
    });
  }

  protected updateBankAccountOfEmployee(instance: any,records: any, r: any, c: any, part: any) {
   
    const record = records[r];
    if(!record.origin || !record.origin.employeeId) {
      return;
    }
    
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.employeeService.getEmployeeById(record.origin.employeeId).subscribe(data => {
        const indexColunmBakCode = this.headers[part].columns.findIndex(d => d.key === 'bankCode');
        this.updateNextColumns(instance, r, data.bankAccount, [ c + 1 ]);
        this.updateNextColumns(instance, r, data.accountHolder, [ c + 2 ]);
        this.updateNextColumns(instance, r, data.bankName, [ c + 3 ]);
        this.updateNextColumns(instance, r, data.bankCode, [ indexColunmBakCode ]);
      })
    }, 10);

  }

  private caculatorDateDiff(regimeFromDateValue, regimeToDateValue, part, parentKey) {
      if (this.tableName['maternityPart1'] === part && (parentKey === 'II' || parentKey === 'IX' 
      || parentKey === 'III_2' || parentKey === 'IV' || parentKey === 'IV'
      || parentKey === 'V_1' || parentKey === 'V_2' || parentKey === 'VI_1')) {
        return this.dateDiff(regimeFromDateValue, regimeToDateValue);
      } else {
        return this.getDayWorker(this.parseDate(regimeFromDateValue), this.parseDate(regimeToDateValue));
      }
  }
  protected dateDiff(regimeFromDateValue, regimeToDateValue) {
      const regimeFromDateMoment = moment(regimeFromDateValue, DATE_FORMAT.FULL);
      const regimeToDateMoment = moment(regimeToDateValue, DATE_FORMAT.FULL);
      const totalValue = regimeToDateMoment.diff(regimeFromDateMoment, 'days');
      const totalDay = totalValue >= 0 ? totalValue + 1 : 0;
      return totalDay;
  }

  protected parseDate(input) {
    // Transform date from text to date
    const parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[2], parts[1]-1, parts[0]); // months are 0-basedƯ
  }

  private getDayWorker(fromDate, toDate) {

    const sat = [];
    const sun = [];
    const day = [];
  
    if (fromDate.getFullYear() === toDate.getFullYear()) {
      if (fromDate.getMonth() === toDate.getMonth()) {
        var startDate = fromDate.getDate();
        var endDate = toDate.getDate();
        this.getWeekend(sat, sun, day, fromDate, startDate, endDate, HolidayConfig);
      } else {
        this.getWeekendBetweenDate(sat, sun, day, fromDate, toDate, HolidayConfig);
      }
    } else {
      for (let i = fromDate.getFullYear(); i <= toDate.getFullYear(); i++) {
        let fDate = fromDate;
        let tDate = toDate;
        switch (i) {
          case fromDate.getFullYear():
            tDate = new Date(fromDate.getFullYear(), 11, 31);
            break;
  
          case toDate.getFullYear():
            fDate = new Date(toDate.getFullYear(), 0, 31);
            break;
  
          default:
            fDate = new Date(i, 0, 31);
            tDate = new Date(i, 11, 31);
            break;
        }
        this.getWeekendBetweenDate(sat, sun, day, fDate, tDate, HolidayConfig);
      }
    }
  
     return day.length;
  }

  private getWeekendBetweenDate(sat, sun, day, fromDate, toDate, holidays) {
    for (let i = fromDate.getMonth(); i <= toDate.getMonth(); i++) {
      let startDate;
      let endDate;
      let dateValue;
      switch (i) {
        case fromDate.getMonth():
          startDate = fromDate.getDate();
          endDate = this.daysInMonth(fromDate.getMonth(), fromDate.getFullYear());
          dateValue = fromDate;
          break;
        case toDate.getMonth():
          startDate = 1;
          endDate = toDate.getDate();
          dateValue = toDate;
          break;
        default:
          startDate = 1;
          endDate = this.daysInMonth(i, fromDate.getFullYear());
          dateValue = new Date(fromDate.getFullYear(), i, 1);
          break;
      }
      this.getWeekend(sat, sun, day, dateValue, startDate, endDate, holidays);
    }
  }
  
  protected getWeekend(sat, sun, day, date, startDate, endDate, holidays) {
    for (let i = startDate; i <= endDate; i++) {
        const newDate = new Date(date.getFullYear(), date.getMonth(), i);
      switch (newDate.getDay()) {
        case 0:
          sun.push(newDate);
          break;
        case 6:
          sat.push(newDate);
          break;
        default:
          let newMonth = (newDate.getMonth() + 1).toString();
          let newDay = (newDate.getDate()).toString();
          if (newMonth.length === 1) {
            newMonth = '0'+ newMonth;
          }
  
          if (newDay.length === 1) {
            newDay = '0'+ newDay;
          }
          let shortDay = newDate.getFullYear() + ''+ newMonth + '' + newDay;
          if (!holidays.includes(shortDay)) {
            day.push(newDate);
          }
          break;
      }
    }
  }

  private daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
  }  
  
}
