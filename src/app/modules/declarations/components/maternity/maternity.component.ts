import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, CategoryService, BankService, PlanService } from '@app/core/services';

import { RegimeApprovalBaseComponent } from '@app/modules/declarations/components/regime-approval/base.component';

import { TABLE_NESTED_HEADERS_PART_1, TABLE_HEADER_COLUMNS_PART_1, TABLE_HEADER_COLUMNS_PART_2, TABLE_NESTED_HEADERS_PART_2, VALIDATION_RULES } from '@app/modules/declarations/data/maternity.data';
import { Subject, forkJoin } from 'rxjs';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-maternity',
  templateUrl: './maternity.component.html',
  styleUrls: ['./maternity.component.less']
})
export class MaternityComponent extends RegimeApprovalBaseComponent implements OnInit, OnChanges, OnDestroy {
  declarationCode: string = '630b';
  validationRules: any = VALIDATION_RULES;

  constructor(
    protected declarationService: DeclarationService,
    protected categoryService: CategoryService,
    private bankService: BankService,
    private planService: PlanService,
    protected modalService: NzModalService
  ) {
    super(declarationService, modalService, categoryService);
  }

  ngOnInit() {
    this.tableName = {
      maternityPart1: 'part1',
      maternityPart2: 'part2'
    };

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
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'bankCode', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_1, 'planCode', plans);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'bankCode', banks);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'subsidizeReceipt', subsidizeReceipts);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS_PART_2, 'recordSolvedNumber', recruitmentNumbers);

      // add filter columns
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS_PART_1, 'planCode', this.getPlanByParent);
    });

    this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
      this.handleUserDeleteTables(data.employee);
    }));
    this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
      this.handleUserUpdateTables(data.employee);
    }));
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      const data = this.declarationService.updateDeclarationsGroupByPart(changes.data.currentValue, {
        part1: this.headers.part1.columns,
        part2: this.headers.part2.columns
      }, !this.declarationId);

      this.declarations.part1.table = data.part1;
      this.declarations.part2.table = data.part2;

      this.updateOrders(this.declarations.part1.table);
      this.updateOrders(this.declarations.part2.table);

      // update origin
      this.updateOriginByPart('part1');
      this.updateOriginByPart('part2');
    }
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }

  private getSourceDropDownByKey(key: string) {
    return this.categoryService.getCategories(key);
  }

  private getPlanByParent(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    const planTypes = (row.options.planType || '').split(',');
    return source.filter(s => planTypes.indexOf(s.id) > -1);
  }
}
