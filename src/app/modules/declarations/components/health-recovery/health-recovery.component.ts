import { Component, OnInit, OnChanges } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, BankService, CategoryService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/health-recovery.data';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-health-recovery',
  templateUrl: './health-recovery.component.html',
  styleUrls: ['./health-recovery.component.less']
})
export class HealthRecoveryComponent extends RegimeApprovalBaseComponent implements OnInit, OnChanges {
  constructor(
    protected declarationService: DeclarationService,
    private bankService: BankService,
    private categoryService: CategoryService,
    protected modalService: NzModalService
  ) {
    super(declarationService, modalService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);
    forkJoin([
      this.getSourceDropDownByKey('subsidizeReceipt'),
      this.getSourceDropDownByKey('recruitmentNumber'),
      this.bankService.getBanks(),
    ]).subscribe(([subsidizeReceipts, recruitmentNumbers, banks]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'recruitmentNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'recordSolvedNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'bankId', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'bankId', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'recordSolvedNumber', recruitmentNumbers);
    });
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      const data = this.declarationService.updateDeclarationsGroupByPart(changes.data.currentValue, {
        part1: this.headers.part1.columns,
        part2: this.headers.part2.columns
      }, !this.declarationId);

      this.declarations.part1.table = data.part1;
      this.declarations.part2.table = data.part2;

      // update origin
      this.updateOriginByPart('part1');
      this.updateOriginByPart('part2');
    }
  }

  private getSourceDropDownByKey(key: string) {
    return this.categoryService.getCategories(key);
  }
}
