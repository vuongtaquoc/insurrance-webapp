import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import findLastIndex from 'lodash/findLastIndex';
import groupBy from 'lodash/groupBy';
import cloneDeep from 'lodash/cloneDeep';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

import { ApplicationHttpClient } from '@app/core/http';
import { AuthenticationService } from '@app/core/services/authentication.service';

import { PAGE_SIZE } from '@app/shared/constant';

@Injectable({ providedIn: 'root' })
export class DeclarationService {
  constructor(
    private http: ApplicationHttpClient,
    private authService: AuthenticationService
  ) {
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

  public getHeaderDeclaration(declarationCode: string) {
    return this.http.get(`/declarations/header-declaration/${ declarationCode }`)
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

  public getDeclarationsChangeCompanyById(id) {
    return this.http.get(`/declarations/change-company/${ id }`).pipe(
      map(detail => {
        const declaration = detail;
        return declaration;
      })
    );
  }

  public getDeclarationsYear() {
    return this.http.get(`/declarations/declaration-year/`);
  }


  public getDeclarationsNormalByDocumentId(id, tableHeaderColumns) {
    return this.http.get(`/declarations/normal/${ id }`).pipe(
      map(detail => {
        const declaration = detail;
        const declarationDetail = this.updateDeclarationsNormal(detail.declarationDetail, tableHeaderColumns);

        declaration.declarationDetail = declarationDetail;

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

  public create(body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post('/declarations', body, options);
  }

  public upload(body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post('/declarations/upload', body, options).pipe(
      map(detail => {
        const declaration = detail;       
        return declaration;
      })
    );
  }


  public update(id, body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post(`/declarations/${ id }`, body, options);
  }

  public updateChangeCompany(id, body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post(`/declarations/change-company/${ id }`, body, options);
  }

  public createChangeCompany(body, options: any = {}) {
    options.displayLoading = true;

    return this.http.post('/declarations/change-company', body, options);
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
        employeeId: (d.employeeId || d.id),
        planType: d.planType,
        planDefault: d.planDefault,
        rate: d.rate,
        key: d.code,
        data: [ d.codeView, d.name ],
        hasLeaf: d.hasChildren,
        isOther: d.isOther,
        groupObject: d.groupObject,
        isRequiredIsurranceNo: d.isRequiredIsurranceNo,
        isParent: true,
        genderAdd: d.genderAdd,
      });

      if (d.hasChildren) {
        d.declarations.forEach(employee => data.push(this.getLeaf(d, employee, tableHeaderColumns, hasEmployeeId ? true : !employee.employeeId)));
      }
    });

    return this.updateFormula(data, tableHeaderColumns);
  }

  public updateDeclarationsNormal(declarations, tableHeaderColumns, hasEmployeeId = false) {
    const data = [];
    declarations.forEach((d, index) => {
      data.push(this.getLeafRow(d, tableHeaderColumns))
    });

    const itemPerPage = 10 - data.length;
    let numberItem = 5;
    if(itemPerPage > 0) {
      numberItem = itemPerPage;
    }

    for (let index = 0; index < numberItem; index++) {
      data.push({
        data: [],
        origin: {},
        isLeaf:true,
        fullName: '',
        isInitialize: false,
      });
    }
    return data;
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
        planDefault: d.planDefault,
        rate: d.rate,
        key: d.code,
        data: [ d.codeView, d.name ],
        hasLeaf: d.hasChildren,
        isParent: true,
        isOther: d.isOther,
        isRequiredIsurranceNo: d.isRequiredIsurranceNo,
        groupObject: d.groupObject, 
        genderAdd: d.genderAdd   
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
        const fromIndex = findLastIndex(clone, (d, i) => i < index && !!d.formula);
        let toIndex = index;
        for (let i = fromIndex; i <= index; i++) {
          const other = clone[i];

          if (other && (other.isOther || (other.parent && other.parent.isOther))) {
            toIndex = i;
            break;
          }
        }

        sumColumnIndexes.forEach(i => {
          const columnName = jexcel.getColumnName(i);

          declaration.data[i] = `=SUM(${ columnName }${ fromIndex + 2 }:${ columnName }${ toIndex })`;
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
      planDefault: parent.planDefault,
      rate: parent.rate,
      isRequiredIsurranceNo: parent.isRequiredIsurranceNo,
      groupObject: parent.groupObject,
      genderAdd: parent.genderAdd,
      data: tableHeaderColumns.map(column => {
        if (!column.key) return '';

        if (column.key === 'gender') {
          return employee[column.key] === true || employee[column.key] === '1';
        }

        return employee[column.key];
      })
    };
  }

  public getLeafRow(employee, tableHeaderColumns, isInitialize = false) {
    return {
      origin: employee,
      isLeaf: true,
      isInitialize,
      data: tableHeaderColumns.map(column => {
        if (!column.key) return '';

        if (column.key === 'gender') {
          return employee[column.key] === true || employee[column.key] === '1';
        }

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

  public downloadFileTemplate(declarationCode: string ) {
    return this.http.getFile(`/declarations/download-template/${ declarationCode }`, {
      headers: {
        token: this.authService.getCredentialToken()
      }
    });
  }
}
