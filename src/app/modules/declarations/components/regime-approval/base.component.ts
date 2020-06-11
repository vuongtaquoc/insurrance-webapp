import { Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';

import {
  DeclarationService
} from '@app/core/services';

export class RegimeApprovalBaseComponent {
  @Input() data: any;
  @Input() hasForm = false;
  @Input() declarationId: string;
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

  constructor(
    protected declarationService: DeclarationService,
    protected modalService: NzModalService
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
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;

        // replace
        employee.gender = !employee.gender;

        if (accepted) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize declarations
            declarations.splice(childLastIndex, 1);

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[part].columns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.headers[part].columns));
          }
        }
      });

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
  }

  handleUserDeleteTables(user) {
    this.handleUserDeleted(user, 'part1');
    this.handleUserDeleted(user, 'part2');
  }

  handleUserDeleted(user, part) {
    const indexes: any = this.declarations[part].table.reduce(
      (combine, d, index) => {
        if (d.isLeaf && d.origin && (d.origin.employeeId || d.origin.id) === user.id) {
          return [...combine, index];
        }

        return [...combine];
      },
      []
    );

    this.tableSubject.next({
      type: 'deleteUser',
      user,
      part,
      deletedIndexes: indexes
    });
  }

  handleUserUpdateTables(user) {
    this.handleUserUpdated(user, 'part1');
    this.handleUserUpdated(user, 'part2');
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
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
    if (!this.employeeSelected.length) return;

    this.isBlinking = true;
  }

  handleChangeTable({ instance, cell, c, r, records }, part) {
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
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
    } else if (beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
    }

    // if (beforeRow.isInitialize) {
    //   beforeRow.isInitialize = false;
    // }

    // if (afterRow.isInitialize) {
    //   afterRow.isInitialize = false;
    // }

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
}
