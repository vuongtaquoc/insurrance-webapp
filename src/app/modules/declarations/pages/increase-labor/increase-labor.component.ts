import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Declaration } from '@app/core/models';
import { DeclarationService } from '@app/core/services';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/increase-labor';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: ['./increase-labor.component.scss']
})
export class IncreaseLaborComponent implements OnInit {
  form: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;

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

    this.declarationService.getDeclarationInitials('600').subscribe(declarations => {
      const data = [];

      declarations.forEach(d => {
        if (!d.hasChildren) {
          data.push({
            readonly: true,
            data: [ d.codeView, d.groupName ]
          });
        } else {
          data.push({
            readonly: true,
            data: [ d.codeView, d.groupName ]
          });

          d.declarations.forEach(employee => {
            data.push({
              data: this.tableHeaderColumns.map(column => {
                if (!column.key) return '';

                return employee[column.key];
              })
            });
          });
        }
      });

      this.declarations = data;
    });
  }

  handleSelectEmployees(employees) {
    console.log(employees)
  }
}
