import { Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';

import {
  DeclarationService
} from '@app/core/services';

export class GeneralBaseComponent {
  @Input() data: any;
  @Input() hasForm = false;
  @Input() declarationId: string;
  @Input() form: any = {};
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onHiddenSidebar: EventEmitter<any> = new EventEmitter();
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
  isHiddenSidebar = false;

  constructor(
    protected declarationService: DeclarationService,
    protected modalService: NzModalService
  ) {}

  initializeTableColumns(nested, columns, tableName) {
    this.headers[tableName].nested = nested;
    this.headers[tableName].columns = columns;
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
        employee.gender = !employee.gender;
        //employee.workAddress = this.currentCredentials.companyInfo.address;
        //
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

    this.onChange.emit({    
      tableName, 
      data: this.declarations[tableName].table
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
      type: 'readonly',
      data: this.declarations.table
    });
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
  }

  handleChangeTable({ instance, cell, c, r, records }, tableName) {
    // update declarations
    this.declarations[tableName].table.forEach((declaration, index) => {
      const record = records[index];

      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
    });

    const rowChange: any = this.declarations[tableName].table[r];
    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;

    // update origin data
    this.declarations[tableName].origin = Object.values(this.updateOrigin(records, tableName));

    this.onChange.emit({
      tableName,
      data: this.declarations[tableName].origin
    });
    
    this.tableSubject.next({
      type: 'validate'
    });

    this.tableSubject.next({
      type: 'validate'
    });
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }) {
     
  }

  handleDeleteTableData({ rowNumber, numOfRows, records }) {
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

  private updateOrigin(records, part) {
    const declarations = {};

    records.forEach(d => {
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

  protected updateOriginByPart() {
    this.onChange.emit({
      data: this.declarations.origin
    });
    this.tableSubject.next({
      type: 'validate'
    });
  }
}
