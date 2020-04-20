import { Component, OnInit, Input } from '@angular/core'

import {
  DeclarationService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/sicknesses.data';

@Component({
  selector: 'app-sicknesses',
  templateUrl: './sicknesses.component.html',
  styleUrls: ['./sicknesses.component.less']
})
export class SicknessesComponent implements OnInit {
  @Input() editorHeight: number;

  panel: any = {
    part1: { active: true },
    part2: { active: true }
  };
  sickessesHeaders: any = {
    part1: {
      nested: TABLE_NESTED_HEADERS_PART_1,
      columns: TABLE_HEADER_COLUMNS_PART_1
    },
    part2: {
      nested: TABLE_NESTED_HEADERS_PART_2,
      columns: TABLE_HEADER_COLUMNS_PART_2
    }
  };
  sickesses: any = {
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
    this.declarationService.getDeclarationInitials('630b', this.sickessesHeaders.part1.columns).subscribe(sicknesses => {
      this.sickesses.part1.table = sicknesses;
      this.sickesses.part2.table = sicknesses;
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
