import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';

import { PAGE_SIZE } from '@app/shared/constant';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getDeclarationInitials(pageId, tableHeaderColumns) {
    return this.http.get(`/declarations/press-create/${ pageId }`).pipe(
      map(declarations => {
        const data = [];

        declarations.forEach((d, index) => {
          const hasFormula = d.code.indexOf('SUM') > -1 || d.code.indexOf('Sum') > -1;

          data.push({
            readonly: !hasFormula,
            formula: hasFormula,
            origin: d,
            key: d.code,
            data: [ d.codeView, d.name ],
            hasLeaf: d.hasChildren
          });

          if (d.hasChildren) {
            d.declarations.forEach(employee => data.push(this.getLeaf(d, employee, tableHeaderColumns, true)));
          }
        });

        return this.updateFormula(data, tableHeaderColumns);
      })
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
        const documents = detail.documentDetail;

        const data = [];

        documents.forEach((d, index) => {
          const hasFormula = d.code.indexOf('SUM') > -1;

          data.push({
            readonly: !hasFormula,
            formula: hasFormula,
            origin: d,
            key: d.code,
            data: [ d.codeView, d.name ],
            hasLeaf: d.hasChildren
          });

          if (d.hasChildren) {
            d.declarations.forEach(employee => data.push(this.getLeaf(d, employee, tableHeaderColumns, !employee.employeeId)));
          }
        });

        return this.updateFormula(data, tableHeaderColumns);
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

  public updateFormula(declarations, tableHeaderColumns) {
    const sumColumnIndexes = this.getSumColumnIndexes(tableHeaderColumns);

    declarations.forEach((declaration, index) => {
      if (declaration.formula) {
        const data = declaration.data;
        const lastFormulaIndex = findLastIndex(declarations, (d, i) => i < index && !!d.formula);

        sumColumnIndexes.forEach(i => {
          const columnName = jexcel.getColumnName(i);

          data[i] = `=SUM(${ columnName }${ lastFormulaIndex + 2 }:${ columnName }${ index })`;
        });
      }
    });

    return declarations;
  }

  public getLeaf(parent, employee, tableHeaderColumns, isInitialize = false) {
    return {
      origin: employee,
      parent: parent,
      parentKey: parent.code || parent.key,
      isLeaf: true,
      isInitialize,
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
