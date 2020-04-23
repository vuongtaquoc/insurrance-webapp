import { Component, OnInit, OnChanges } from '@angular/core';

import { DeclarationService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/maternity.data';

@Component({
  selector: 'app-maternity',
  templateUrl: './maternity.component.html',
  styleUrls: ['./maternity.component.less']
})
export class MaternityComponent extends RegimeApprovalBaseComponent implements OnInit, OnChanges {
  constructor(protected declarationService: DeclarationService) {
    super(declarationService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);

    // this.declarationService.getDeclarationInitials('630b', this.headers.part1.columns).subscribe(maternity => {
    //   this.declarations.part1.table = maternity;
    //   this.declarations.part2.table = maternity;
    // });
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      this.declarations.part1.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part1.columns);
      this.declarations.part2.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part2.columns);
    }
  }
}
