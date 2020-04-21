import { Component, OnInit } from '@angular/core';

import {
  DeclarationService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/maternity.data';

@Component({
  selector: 'app-maternity',
  templateUrl: './maternity.component.html',
  styleUrls: ['./maternity.component.less']
})
export class MaternityComponent implements OnInit {
  panel: any = {
    part1: { active: true },
    part2: { active: false }
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
    this.declarationService.getDeclarationInitials('630b', this.maternityHeaders.part1.columns).subscribe(maternity => {
      this.maternity.part1.table = maternity;
      this.maternity.part2.table = maternity;
    });
  }

  collapseChange(isActive, part) {
    if (part === 'part1') {
      this.panel.part1.active = isActive;
      this.panel.part2.active = false;
    }

    if (part === 'part2') {
      this.panel.part1.active = false;
      this.panel.part2.active = isActive;
    }
  }
}
