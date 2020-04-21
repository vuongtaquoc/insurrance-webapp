import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { DeclarationService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/sicknesses.data';

@Component({
  selector: 'app-sicknesses',
  templateUrl: './sicknesses.component.html',
  styleUrls: ['./sicknesses.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SicknessesComponent extends RegimeApprovalBaseComponent implements OnInit {
  constructor(protected declarationService: DeclarationService) {
    super(declarationService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);

    this.declarationService.getDeclarationInitials('630a', this.headers.part1.columns).subscribe(sicknesses => {
      this.declarations.part1.table = sicknesses;
      this.declarations.part2.table = sicknesses;
    });
  }
}
