import { Component } from '@angular/core';

import {
  DeclarationService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/maternity.data';

@Component({
  selector: 'app-maternity',
  templateUrl: './maternity.component.html',
  styleUrls: ['./maternity.component.less']
})
export class MaternityComponent {
  panel: any = {
    part1: { active: true },
    part2: { active: true }
  };
  maternityHeaders: any = {
    part1: {
      nested: TABLE_NESTED_HEADERS_PART_1,
      columns: TABLE_HEADER_COLUMNS_PART_1
    },
    part2: {
      nested: TABLE_NESTED_HEADERS_PART_2,
      columns: TABLE_HEADER_COLUMNS_PART_2
    }
  };
  maternity: any = {
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
    this.declarationService.getDeclarationInitials('630a', this.maternityHeaders.part1.columns).subscribe(sicknesses => {
      this.maternity.part1.table = sicknesses;
      this.maternity.part2.table = sicknesses;
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
