import { Component } from '@angular/core';

import { DeclarationService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/health-recovery.data';

@Component({
  selector: 'app-health-recovery',
  templateUrl: './health-recovery.component.html',
  styleUrls: ['./health-recovery.component.less']
})
export class HealthRecoveryComponent extends RegimeApprovalBaseComponent {
  constructor(protected declarationService: DeclarationService) {
    super(declarationService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);

    this.declarationService.getDeclarationInitials('630c', this.headers.part1.columns).subscribe(healthRecovery => {
      this.declarations.part1.table = healthRecovery;
      this.declarations.part2.table = healthRecovery;
      console.log(this.declarations)
    });
  }
}
