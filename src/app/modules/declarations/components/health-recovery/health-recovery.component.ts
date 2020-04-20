import { Component } from '@angular/core';

import {
  DeclarationService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/health-recovery.data';

@Component({
  selector: 'app-health-recovery',
  templateUrl: './health-recovery.component.html',
  styleUrls: ['./health-recovery.component.less']
})
export class HealthRecoveryComponent {
  panel: any = {
    part1: { active: true },
    part2: { active: true }
  };
  healthRecoveryHeaders: any = {
    part1: {
      nested: TABLE_NESTED_HEADERS_PART_1,
      columns: TABLE_HEADER_COLUMNS_PART_1
    },
    part2: {
      nested: TABLE_NESTED_HEADERS_PART_2,
      columns: TABLE_HEADER_COLUMNS_PART_2
    }
  };
  healthRecovery: any = {
    part1: {
      origin: [],
      table: []
    },
    part2: {
      origin: [],
      table: []
    }
  };

  constructor(private declarationService: DeclarationService) {}

  ngOnInit() {
    this.declarationService.getDeclarationInitials('630c', this.healthRecoveryHeaders.part1.columns).subscribe(sicknesses => {
      this.healthRecovery.part1.table = sicknesses;
      this.healthRecovery.part2.table = sicknesses;
    });
  }

  collapseChange(isActive, part) {
    if (part === 'part1') {
      this.panel.part1.active = isActive;
    }

    if (part === 'part2') {
      this.panel.part2.active = isActive;
    }
  }
}
