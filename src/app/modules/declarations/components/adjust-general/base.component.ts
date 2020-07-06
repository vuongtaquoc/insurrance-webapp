import { Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, Subscription, Observable } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import {
  DeclarationService
} from '@app/core/services';
import { ACTION } from '@app/shared/constant';
import { validationColumnsPlanCode } from '@app/shared/constant-valid';
export class GeneralBaseComponent {
  @Input() data: any;
  @Input() NzPageHeaderContentDirective: string;
  @Input() hasForm = false;
  @Input() declarationId: string;
  @Input() pageName: string;
  @Input() pageCode: string;
  @Input() form: any = {};
  @Input() declarationGeneral: any = {};
  @Input() tabEvents: Observable<any>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onHiddenSidebar: EventEmitter<any> = new EventEmitter();
  @Output() onFormChange: EventEmitter<any> = new EventEmitter();
  headers: any = {
    increaselabor: {
      nested: [],
      columns: []
    },
    reductionlabor: {
      nested: [],
      columns: []
    },
    adjustment: {
      nested: [],
      columns: []
    }
  };
  declarations: any = {
    increaselabor: {
      origin: [],
      table: []
    },
    reductionlabor: {
      origin: [],
      table: []
    },
    adjustment: {
      origin: [],
      table: []
    }
  };
  employeeSelected: any[] = [];
  employeeSubject: Subject<any> = new Subject<any>();
  tableSubject: Subject<any> = new Subject<any>();
  validateSubject: Subject<any> = new Subject<any>();
  isHiddenSidebar = false;
  currentCredentials: any = {};
  isBlinking = false;
  tabSubscription: Subscription;
  selectedTab: number;
  handlers: any = [];
  constructor(
    protected declarationService: DeclarationService,
    protected modalService: NzModalService,

  ) {}

  initializeTableColumns(nested, columns, tableName, currentCredentials) {
    this.headers[tableName].nested = nested;
    this.headers[tableName].columns = columns;
    this.currentCredentials = currentCredentials;
  }

  handleUserDeleteTables(user, tableName) {
    this.handleUserDeleted(user, tableName);
  }


handleUserDeleted(user, tableName) {
  this.tableSubject.next({
    type: 'deleteUser',
    user,
    tableName,
    deletedIndexes: []
  });
}

handleUserUpdateTables(user, tableName) {
  this.handleUserUpdated(user, tableName);
}

handleUserUpdated(user, tableName) {
  const declarations = [ ...this.declarations[tableName].table ];
  const declarationUsers = declarations.filter(d => {
    return d.isLeaf && d.origin && (d.origin.employeeId || d.origin.id) === user.id;
  });

  declarationUsers.forEach(declaration => {
    declaration.origin = {
      ...declaration.origin,
      ...user
    };

    this.headers[tableName].columns.forEach((column, index) => {
      if (user[column.key] !== null && typeof user[column.key] !== 'undefined') {
        declaration.data[index] = user[column.key];
      }
    });
  });

  // update orders
  this.updateOrders(declarations);

  this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);

 // clean employee
  this.employeeSubject.next({
    tableName,
    type: 'clean'
  });

  this.employeeSelected.length = 0;
  this.tableSubject.next({
    tableName,
    type: 'validate'
  });

  this.tableSubject.next({
    tableName,
    type: 'readonly',
    data: this.declarations.table
  });
}


  handleAddEmployee(type, tableName) {
    if (!this.employeeSelected.length) {
      return this.modalService.warning({
        nzTitle: 'Chưa có nhân viên nào được chọn',
      });
    }
    const declarations = [ ...this.declarations[tableName].table];

    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;

        // replace
        employee.gender = employee.gender === '1';
        employee.workAddress = this.currentCredentials.companyInfo.address;
        employee.planCode = declarations[parentIndex].planDefault;
        if(employee.planCode) {
          const planConfigInfo = validationColumnsPlanCode[employee.planCode] || {note:{argsColumn: [], message: ''}};
          const argsColumn = planConfigInfo.note.argsColumn || [] ;
          const argsMessgae = [];
          argsColumn.forEach(column => { 
            argsMessgae.push(employee[column]);
          });
          employee.note = this.formatNote(planConfigInfo.note.message, argsMessgae);
        }

        //copy salary
        if(tableName === 'adjustment') {
          employee.allowanceAdditionalNew = employee.allowanceAdditional;
          employee.allowanceLevelNew = employee.allowanceLevel;
          employee.allowanceOtherNew = employee.allowanceOther;
          employee.allowanceSalaryNew = employee.allowanceSalary;
          employee.allowanceSeniorityNew = employee.allowanceSeniority;
          employee.allowanceSeniorityJobNew = employee.allowanceSeniorityJob;
          employee.salaryNew = employee.salary;
          employee.ratioNew = employee.ratio;
        }

        if (accepted) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize data
            declarations.splice(childLastIndex, 1);

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[tableName].columns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[tableName].columns));
          }
        }

      });

      // update orders
      this.updateOrders(declarations);

      this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[tableName].columns));
      });

      this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);
    }
    // update origin data
    const records = this.toTableRecords(declarations);
    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      action: ACTION.MUNTILEADD,
      tableName,
      data: this.declarations[tableName].origin,
      dataChange : []
    });

    // clean employee
    this.employeeSubject.next({
      tableName,
      type: 'clean'
    });

    this.employeeSelected.length = 0;
    this.tableSubject.next({
      tableName,
      type: 'validate'
    });

    this.tableSubject.next({
      tableName,
      type: 'readonly',
      data: this.declarations.table
    });

  }

  handleUserAdded({ tableName, y, employee }) {
    if (!tableName) return;
    const declarations = [ ...this.declarations[tableName].table];
    const row = declarations[y];

    row.origin = {
      ...row.origin,
      ...employee
    };
    row.isInitialize = false;

    this.headers[tableName].columns.forEach((column, index) => {
      if (employee[column.key] !== null && typeof employee[column.key] !== 'undefined') {
        row.data[index] = employee[column.key];
      }
    });

    // update orders
    this.updateOrders(declarations);

    this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      tableName,
      type: 'readonly',
      data: this.declarations.table
    });
  }


  handleSort({ direction, source, dist }, tableName) {
    const declarations = [ ...this.declarations[tableName].table ];
    const current = declarations[source];

    // remove element
    declarations.splice(source, 1);

    // add element to new position
    declarations.splice(dist, 0, current);

    // update orders
    this.updateOrders(declarations);

    this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.tableSubject.next({
      type: 'validate'
    });
    this.tableSubject.next({
      type: 'readonly',
      tableName,
      data: this.declarations[tableName].table
    });
  }

  handleTabChanged({ selected }) {
    this.selectedTab = selected;
  }

  handleFocus() {

    if (!this.employeeSelected.length) return;
    this.isBlinking = true;

    setTimeout(() => this.isBlinking = false, 5000);
  }

  handleSelectEmployees(employees) {

    this.employeeSelected = employees;

    if (!this.employeeSelected.length) return;
    this.isBlinking = true;

    setTimeout(() => this.isBlinking = false, 5000);
  }

  handleChangeTable({ instance, cell, c, r, records }, tableName) {

    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.headers[tableName].columns[c];

      if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstRegistName = cell.innerText.split(' - ').pop();
        this.updateNextColumns(instance, r, hospitalFirstRegistName, [ c + 1 ]);
      }else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'recipientsCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 5, c + 6 ]);
      }

      if (column.key === 'planCode') {
        //Phuong thức lấy note theo phương án
        const planCode = records[r][c];
        const planConfigInfo = validationColumnsPlanCode[planCode] || {note:{argsColumn: [], message: ''}};
        const argsColumn = planConfigInfo.note.argsColumn || [] ;
        const argsMessgae = [];
        argsColumn.forEach(column => {
          const indexOfColumn = this.headers[tableName].columns.findIndex(c => c.key === column);
          argsMessgae.push(records[r][indexOfColumn]);
        });
        const indexColumnNote = this.headers[tableName].columns.findIndex(c => c.key === 'note');
        const notebuild = this.formatNote(planConfigInfo.note.message, argsMessgae);
        this.updateNextColumns(instance, r, notebuild, [indexColumnNote]);
      }

    }
    // update declarations
    this.declarations[tableName].table.forEach((declaration, index) => {
      const record = records[index];
      console.log(record);
      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
      console.log(declaration);
    });

    const rowChange: any = this.declarations[tableName].table[r];
    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;

    // update origin data
    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      action: ACTION.EDIT,
      tableName,
      data: this.declarations[tableName].origin,
      dataChange : [],
    });

    this.tableSubject.next({
      type: 'validate'
    });
  }

  private updateNextColumns(instance, r, value, nextColumns = []) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
      instance.jexcel.setValue(columnName, value);
    });
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }, tableName) {
    const declarations = [ ...this.declarations[tableName].table ];
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
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
    }

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);

    this.updateOrders(declarations);

    this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);

    const records = this.toTableRecords(declarations);
    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      action: ACTION.ADD,
      tableName,
      data: this.declarations[tableName].origin,
      dataChange : [],
    });

    this.tableSubject.next({
      type: 'validate'
    });
  }

  handleDeleteTableData({ rowNumber, numOfRows, records }, tableName) {
    const declarations = [ ...this.declarations[tableName].table ];
    let declarationsDeleted = [];
    const beforeRow = records[rowNumber - 1];
    const afterRow = records[rowNumber];

    if (!((beforeRow.options && beforeRow.options.isLeaf) || (afterRow.options && afterRow.options.isLeaf))) {
      const row: any = declarations[rowNumber];
      declarationsDeleted.push(row);
      const origin = { ...row.data.origin };
      const options = { ...row.data.options };

      origin.employeeId = 0;
      origin.id = 0;

      row.data = [];
      row.origin = origin;
      row.options = options;
      row.isInitialize = true;
    } else {
      declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    }

    // declarations.splice(rowNumber, numOfRows);

    this.updateOrders(declarations);

    this.declarations[tableName].table = this.declarationService.updateFormula(declarations, this.headers[tableName].columns);

    // update origin data
    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      action: ACTION.DELETE,
      tableName,
      data: this.declarations[tableName].origin,
      dataChange : declarationsDeleted,
    });

    this.tableSubject.next({
      type: 'validate'
    });
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

  arrayToProps(array, columns) {
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

  private updateOrigin(records, tableName) {
    const declarations = {};

    records.forEach(d => {
      if (!d.options.hasLeaf && !d.options.isLeaf) {
        declarations[d.options.key] = { ...d.origin};
      } else if (d.options.hasLeaf) {
        declarations[d.options.key] = {
          ...d.origin,
          declarations: []
        };
      } else if (d.options.isLeaf) {
        declarations[d.options.parentKey].declarations.push(this.arrayToProps(d, this.headers[tableName].columns));
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
        }
      };

      declaration.data.forEach((d, j) => record[j] = d);

      records.push(record);
    });

    return records;
  }

  protected updateOriginByTableName(tableName) {
    const records = this.toTableRecords([ ...this.declarations[tableName].table ]);

    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      action: ACTION.MUNTILEUPDATE,
      tableName,
      data: this.declarations[tableName].origin,
      dataChange : [],
    });
    this.tableSubject.next({
      type: 'validate'
    });
  }

  protected formatNote(str, args) {
    for (let i = 0; i < args.length; i++)
       str = str.replace("{" + i + "}", args[i]);
    return str;
  }
}
