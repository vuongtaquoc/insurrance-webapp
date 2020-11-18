import { Component, OnInit, OnChanges, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, CategoryService, BankService,
  CityService,DistrictService,HospitalService,NationalityService,PeopleService,WardsService,
  SalaryAreaService,PlanService,DepartmentService,EmployeeService,AuthenticationService,DocumentListService,
  RelationshipService,VillageService } from '@app/core/services';

import { GeneralBaseComponent } from '@app/modules/declarations/components/adjust-general/base.component';

import { TABLE_ADJUST_HEADER_COLUMNS, TABLE_ADJUST_NESTED_HEADERS } from '@app/modules/declarations/data/adjust';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-adjustment',
  templateUrl: './adjustment.component.html',
  styleUrls: ['./adjustment.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class AdjustmentComponent extends GeneralBaseComponent implements OnInit, OnChanges, OnDestroy {
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  constructor(
    protected declarationService: DeclarationService,
    private categoryService: CategoryService,
    private bankService: BankService,
    protected modalService: NzModalService,
    protected hospitalService: HospitalService,

    private cityService: CityService,
    private districtService: DistrictService,
   
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private planService: PlanService,
    private departmentService: DepartmentService,
    private documentListService: DocumentListService,
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private relationshipService: RelationshipService,
    private villageService: VillageService,
  ) {
    super(declarationService, modalService, hospitalService);
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getPlanByParent = this.getPlanByParent.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
  }

  ngOnInit() {
    const currentCredentials = this.authenticationService.currentCredentials;
    // initialize table columns
    this.initializeTableColumns(TABLE_ADJUST_NESTED_HEADERS, TABLE_ADJUST_HEADER_COLUMNS, 'adjustment',currentCredentials);

    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.planService.getPlanShowCode('600b'),
      this.departmentService.getDepartments(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships(),
      this.categoryService.getCategories('livesAreaCode'),
      this.categoryService.getCategories('workType'),
      this.categoryService.getCategories('contractType')
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, plans, departments, relationshipDocumentTypies, relationShips, livesAreas, workTypes, contractType ]) => {
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'peopleCode', peoples);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'nationalityCode', nationalities);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'registerCityCode', cities);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'recipientsCityCode', cities);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'planCode', plans);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'departmentCode', departments);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'livesAreaCode', livesAreas);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'workTypeCode', workTypes);
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'contractTypeCode', contractType);

      // // get filter columns
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
      this.updateFilterToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'planCode', this.getPlanByParent);
    });

    this.tabSubscription = this.tabEvents.subscribe((data) => this.handleTabChanged(data));
    this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
      this.handleUserDeleteTables(data.employee,'adjustment');
    }));
    this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
      this.handleUserUpdateTables(data.employee, 'adjustment');
    }));
  }

  ngOnChanges(changes) {
     if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      const data = this.declarationService.updateDeclarations(changes.data.currentValue, TABLE_ADJUST_HEADER_COLUMNS, !this.declarationId);
      this.declarations.adjustment.table = data;
      this.updateOrders(this.declarations.adjustment.table);
      this.updateOriginByTableName('adjustment');
    }
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }

  private getRegisterDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS,'registerDistrictCode', districts);

      return districts;
    });
  }

  private getRecipientsWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS,'recipientsWardsCode', districts);

      return districts;
    });
  }

  private getRegisterWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS,'registerWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_ADJUST_HEADER_COLUMNS, 'recipientsDistrictCode', districts);

      return districts;
    });
  }

  private getHospitalsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 5, r);
    if (!value) {
      return [];
    }

    return this.hospitalService.getHospitals(value).toPromise();
  }

  private getPlanByParent(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    const planTypes = (row.options.planType || '').split(',');
    return source.filter(s => planTypes.indexOf(s.id) > -1);
  }

  private getSourceDropDownByKey(key: string) {
    return this.categoryService.getCategories(key);
  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleFormValuesChanged(value) {
    console.log(value);
  }
}
