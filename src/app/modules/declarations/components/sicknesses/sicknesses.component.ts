import { Component, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';

import { DeclarationService, CategoryService, BankService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/sicknesses.data';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-sicknesses',
  templateUrl: './sicknesses.component.html',
  styleUrls: ['./sicknesses.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class SicknessesComponent extends RegimeApprovalBaseComponent implements OnInit, OnChanges {
  constructor(
    protected declarationService: DeclarationService,
    protected categoryService: CategoryService,
    protected bankService: BankService
  ) {
    super(declarationService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);

    forkJoin([
      this.getSourceDropDownByKey('conditionWork'),
      this.getSourceDropDownByKey('holidayWeekly'),
      this.getSourceDropDownByKey('certificationHospital'),
      this.getSourceDropDownByKey('recruitmentNumber'),
      this.getSourceDropDownByKey('subsidizeReceipt'),
      this.getSourceDropDownByKey('diagnosticCode'),
      this.bankService.getBanks(),
    ]).subscribe(([conditionWorks, holidayWeeklies, certificationHospitals, recruitmentNumbers,subsidizeReceipts,diagnosticCodes, banks]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'conditionWork', conditionWorks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'holidayWeekly', holidayWeeklies);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'certificationHospital', certificationHospitals);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'recruitmentNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'recordSolvedNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'diagnosticCode', diagnosticCodes);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'bankId', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'bankId', banks);
    });
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      this.declarations.part1.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part1.columns);
      this.declarations.part2.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part2.columns);
    }
  }

  private getSourceDropDownByKey(key: string) {
    return this.categoryService.getCategories(key);
  }
}
