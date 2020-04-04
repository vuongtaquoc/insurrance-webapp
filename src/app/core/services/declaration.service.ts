import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  constructor(private http: ApplicationHttpClient) {
  }

  public getDeclarationInitials(pageId, tableHeaderColumns) {
    return this.http.get(`/declarations/press-create/${ pageId }`).pipe(
      map(declarations => {
        const data = [];

        declarations.forEach((d, index) => {
          const hasFormula = d.Code.indexOf('SUM') > -1;

          data.push({
            readonly: !hasFormula,
            formula: hasFormula,
            data: [ d.codeView, d.name ]
          });

          if (d.hasChildren) {
            d.declarations.forEach(employee => {
              data.push({
                data: tableHeaderColumns.map(column => {
                  if (!column.key) return '';

                  return employee[column.key];
                })
              });
            });
          }
        });

        return this.updateFormula(data, tableHeaderColumns);
      })
    );
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
