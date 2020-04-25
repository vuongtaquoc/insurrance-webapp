import { Component, OnInit, OnChanges } from '@angular/core';

import { DeclarationService, CategoryService, BankService, PlanService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2 } from '@app/modules/declarations/data/maternity.data';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-maternity',
  templateUrl: './maternity.component.html',
  styleUrls: ['./maternity.component.less']
})
export class MaternityComponent extends RegimeApprovalBaseComponent implements OnInit, OnChanges {
  declarationCode: string = '630b';
  constructor(
    protected declarationService: DeclarationService,
    protected categoryService: CategoryService,
    protected bankService: BankService,
    protected planService: PlanService
  ) {
    super(declarationService);
  }

  ngOnInit() {
    // initialize table columns
    this.initializeTableColumns('part1', TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1);
    this.initializeTableColumns('part2', TABLE_NESTED_HEADERS_PART_2, TABLE_HEADER_COLUMNS_PART_2);

    forkJoin([
      
      this.getSourceDropDownByKey('holidayWeekly'),
      this.getSourceDropDownByKey('conditionPrenatal'),
      this.getSourceDropDownByKey('conditionReproduction'),
      this.getSourceDropDownByKey('recruitmentNumber'),
      this.getSourceDropDownByKey('subsidizeReceipt'),
      this.bankService.getBanks(),
      this.planService.getPlans(this.declarationCode),
    ]).subscribe(([holidayWeeklies, conditionPrenatals, conditionReproductions, recruitmentNumbers, subsidizeReceipts, banks, plans]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'holidayWeekly', holidayWeeklies);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'conditionPrenatal', conditionPrenatals);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'conditionReproduction', conditionReproductions);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'recruitmentNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'recordSolvedNumber', recruitmentNumbers);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'bankId', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'planCode', plans);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'bankId', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'recordSolvedNumber', recruitmentNumbers);
    });
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      this.declarations.part1.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part1.columns);
      this.declarations.part2.table = this.declarationService.updateDeclarations(changes.data.currentValue, this.headers.part2.columns);
    }
  }

  private getSourceDropDownByKey(key: string) 
  {
    return this.categoryService.getCategories(key);
  }

  private updateSourceToColumn(tableHeaderColumns: any, key: string, sources: any) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }
}
