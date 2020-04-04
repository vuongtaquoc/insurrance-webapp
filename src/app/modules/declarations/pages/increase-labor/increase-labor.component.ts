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

    this.declarationService.getDeclarationInitials('600a', this.tableHeaderColumns).subscribe(declarations => {
      this.declarations = declarations;
    });
  }

  handleSelectEmployees(employees) {
    console.log(employees)
  }
}
