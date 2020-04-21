// import { Input, Output, EventEmitter } from '@angular/core';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';

import {
  DeclarationService
} from '@app/core/services';

export class RegimeApprovalBaseComponent {
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

  constructor(protected declarationService: DeclarationService) {}

  initializeTableColumns(part, nested, columns) {
    this.headers[part].nested = nested;
    this.headers[part].columns = columns;
  }

  handleAddEmployee(part, type) {
    if (!this.employeeSelected.length) {
      return;
    }

    const declarations = [ ...this.declarations[part].table ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => e.origin.id === employee.id) === -1;

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
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
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

      if (declaration.isLeaf && declaration.parentKey === order.key && !declaration.isInitialize) {
        order.index += 1;

        declaration.data[0] = order.index;
      }
    });
  }
}
