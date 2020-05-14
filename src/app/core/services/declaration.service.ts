import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';

import { PAGE_SIZE } from '@app/shared/constant';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getDeclarationInitials(pageId, tableHeaderColumns) {
    return this.http.get(`/declarations/press-create/${ pageId }`).pipe(
      map(declarations => this.updateDeclarations(declarations, tableHeaderColumns, true))
    );
  }

  public getDeclarationInitialsByGroup(pageId) {
    return this.http.get(`/declarations/press-create/${ pageId }`).pipe(
      map(declarations => groupBy(declarations, 'category'))
    );
  }

  public getDeclarations(filters = {}) {
    return this.http.getList('/declarations', {
      params: {
        ...filters
      }
    });
  }

  public getDeclarationsByDocumentId(id, tableHeaderColumns) {
    return this.http.get(`/declarations/${ id }`).pipe(
      map(detail => {
        const declaration = detail;
        const documentDetails = this.updateDeclarations(detail.documentDetail, tableHeaderColumns);

        declaration.documentDetail = documentDetails;

        return declaration;
      })
    );
  }

  public getDeclarationsByDocumentIdByGroup(id) {
    return this.http.get(`/declarations/${ id }`).pipe(
      map(detail => {
        const declaration = detail;

        declaration.documentDetail = groupBy(detail.documentDetail, 'category');

        return declaration;
      })
    );
  }

  public create(body, options = {}) {
    return this.http.post('/declarations', body, options);
  }

  public update(id, body, options = {}) {
    return this.http.post(`/declarations/${ id }`, body, options);
  }

  public delete(id) {
    return this.http.delete(`/declarations/${ id }`);
  }

  public updateDeclarations(declarations, tableHeaderColumns, hasEmployeeId = false) {
    const data = [];

    declarations.forEach((d, index) => {
      const hasFormula = d.code.indexOf('SUM') > -1 || d.code.indexOf('Sum') > -1;

      data.push({
        readonly: !hasFormula,
        formula: hasFormula,
        origin: d,
        employeeId: 12,
        planType: d.planType,
        key: d.code,
        data: [ d.codeView, d.name ],
        hasLeaf: d.hasChildren,
        isParent: true
      });

      if (d.hasChildren) {
        d.declarations.forEach(employee => data.push(this.getLeaf(d, employee, tableHeaderColumns, hasEmployeeId ? true : !employee.employeeId)));
      }
    });

    return this.updateFormula(data, tableHeaderColumns);
  }

  public updateDeclarationsGroupByPart(declarations, columns, hasEmployeeId = false) {
    const parts = {
      part1: [],
      part2: []
    };

    declarations.forEach((d, index) => {
      const hasFormula = d.code.indexOf('SUM') > -1 || d.code.indexOf('Sum') > -1;
      const data = {
        readonly: !hasFormula,
        formula: hasFormula,
        origin: d,
        planType: d.planType,
        key: d.code,
        data: [ d.codeView, d.name ],
        hasLeaf: d.hasChildren,
        isParent: true
      };

      parts.part1.push({ ...data });
      parts.part2.push({ ...data });

      if (d.hasChildren) {
        const hasPart1 = d.declarations.findIndex(e => e.part === 'I') > -1;
        const hasPart2 = d.declarations.findIndex(e => e.part === 'II') > -1;

        d.declarations.forEach(employee => {
          if (employee.part === 'I') {
            parts.part1.push(this.getLeaf(d, employee, columns.part1, hasEmployeeId ? true : !employee.employeeId));
          } else if (employee.part === 'II') {
            parts.part2.push(this.getLeaf(d, employee, columns.part2, hasEmployeeId ? true : !employee.employeeId));
          } else {
            parts.part1.push(this.getLeaf(d, employee, columns.part1, hasEmployeeId ? true : !employee.employeeId));
            parts.part2.push(this.getLeaf(d, employee, columns.part2, hasEmployeeId ? true : !employee.employeeId));
          }
        });

        if (hasPart1 && !hasPart2) {
          parts.part2.push(this.getLeaf(d, { id: 0 }, columns.part2, true));
        } else if (!hasPart1 && hasPart2) {
          parts.part1.push(this.getLeaf(d, { id: 0 }, columns.part1, true));
        }
      }
    });

    return {
      part1: this.updateFormula(parts.part1, columns.part1),
      part2: this.updateFormula(parts.part2, columns.part2),
    }
  }

  public updateFormula(declarations, tableHeaderColumns) {
    const clone = cloneDeep(declarations);
    const sumColumnIndexes = this.getSumColumnIndexes(tableHeaderColumns);

    clone.forEach((declaration, index) => {
      if (declaration.formula) {
        const lastFormulaIndex = findLastIndex(clone, (d, i) => i < index && !!d.formula);

        sumColumnIndexes.forEach(i => {
          const columnName = jexcel.getColumnName(i);

          declaration.data[i] = `=SUM(${ columnName }${ lastFormulaIndex + 2 }:${ columnName }${ index })`;
        });
      }
    });

    return clone;
  }

  public getLeaf(parent, employee, tableHeaderColumns, isInitialize = false) {
    return {
      origin: employee,
      parent,
      parentKey: parent.code || parent.key,
      isLeaf: true,
      isInitialize,
      planType: parent.planType,
      data: tableHeaderColumns.map(column => {
        if (!column.key) return '';

        return employee[column.key];
      })
    };
  }

  private getSumColumnIndexes(columns) {
    return columns.reduce(
      (combine, current, index) => {
        if (current.sum) {
          return [ ...combine, index ];
        }

        return [ ...combine ];
      },
      []
    );
  }
}
