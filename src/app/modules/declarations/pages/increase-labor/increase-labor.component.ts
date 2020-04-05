import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';

import { Declaration } from '@app/core/models';
import { DeclarationService } from '@app/core/services';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/increase-labor';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: ['./increase-labor.component.less']
})
export class IncreaseLaborComponent implements OnInit {
  form: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private declarationService: DeclarationService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      number: ['1'],
      month: ['03'],
      year: ['2020']
    });

    this.declarationService.getDeclarationInitials('600', this.tableHeaderColumns).subscribe(declarations => {
      this.declarations = declarations;
    });
  }

  handleAddEmployee(type) {
    if (!this.employeeSelected.length) {
      return;
    }

    const declarations = [ ...this.declarations ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => e.origin.id === employee.id) === -1;

        if (accepted) {
          declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
        }
      });

      this.declarations = declarations;
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
      });
    }

  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
  }

  emitEventToChild(type) {
    this.eventsSubject.next(type);
  }
}
