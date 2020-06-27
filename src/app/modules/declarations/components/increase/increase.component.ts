import { Component, OnInit, OnChanges, ViewEncapsulation } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, CategoryService, BankService,
  CityService,DistrictService,HospitalService,NationalityService,PeopleService,WardsService,
  SalaryAreaService,PlanService,DepartmentService,EmployeeService,AuthenticationService,
  RelationshipService,VillageService } from '@app/core/services';

import { GeneralBaseComponent } from '@app/modules/declarations/components/adjust-general/base.component';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from '@app/modules/declarations/data/increase-labor';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-increase',
  templateUrl: './increase.component.html',
  styleUrls: ['./increase.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class IncreaseComponent extends GeneralBaseComponent implements OnInit, OnChanges {

  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  constructor(
    protected declarationService: DeclarationService,
    private categoryService: CategoryService,
    private bankService: BankService,
    protected modalService: NzModalService,

    private cityService: CityService,
    private districtService: DistrictService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private planService: PlanService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private relationshipService: RelationshipService,
    private villageService: VillageService,
  ) {
    super(declarationService, modalService);
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getPlanByParent = this.getPlanByParent.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
  }

  ngOnInit() {
    // initialize table columns
    const currentCredentials = this.authenticationService.currentCredentials;
    this.initializeTableColumns(TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS, 'increaselabor', currentCredentials);

    forkJoin([
      this.peopleService.getPeoples(),
      this.nationalityService.getNationalities(),
      this.cityService.getCities(),
      this.salaryAreaService.getSalaryAreas(),
      this.departmentService.getDepartments(),
      this.planService.getPlans('600'),
    ]).subscribe(([ peoples,nationalities, cities, salaryAreas,departments, plans ]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'peopleCode', peoples);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'nationalityCode', nationalities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'registerCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'recipientsCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'planCode', plans);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'departmentId', departments);

      // // get filter columns
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'planCode', this.getPlanByParent);
    });

    this.tabSubscription = this.tabEvents.subscribe((data) => this.handleTabChanged(data));
    this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
      this.handleUserDeleteTables(data.employee,'increaselabor');
    }));
    this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
      this.handleUserUpdateTables(data.employee, 'increaselabor');
    }));
  }

  ngOnChanges(changes) {
     if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      const data = this.declarationService.updateDeclarations(changes.data.currentValue, TABLE_HEADER_COLUMNS, !this.declarationId);
      this.declarations.increaselabor.table = data;
    }
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }

  checkInsurranceCode() {
    const declarations = [...this.declarations.increaselabor.table];
    const INSURRANCE_CODE_INDEX = 4;
    const INSURRANCE_STATUS_INDEX = 5;
    // const leafs = declarations.filter(d => !!d.isLeaf);
    // const insurranceCodes = leafs.map(l => l.data[INSURRANCE_CODE_INDEX]);
    const errors = {};

    declarations.forEach((declaration, rowIndex) => {
      const code = declaration.data[INSURRANCE_CODE_INDEX];

      if (code && declaration.isLeaf) {
        declaration.data[INSURRANCE_STATUS_INDEX] = `Không tìm thấy Mã số ${ declaration.data[INSURRANCE_CODE_INDEX] }`;

        errors[rowIndex] = {
          col: INSURRANCE_CODE_INDEX,
          value: code,
          valid: false
        };
      }
    });

    this.declarations.increaselabor.table = declarations;

    setTimeout(() => {
      this.validateSubject.next({
        field: 'isurranceCode',
        errors
      });
    }, 20);

    this.tableSubject.next({
      tableName: 'increaselabor',
      type: 'validate'
    });
  }

  private getRegisterDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS,'registerDistrictCode', districts);

      return districts;
    });
  }

  private getRecipientsWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS,'recipientsWardsCode', districts);

      return districts;
    });
  }

  private getRegisterWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS,'registerWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'recipientsDistrictCode', districts);

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

  handleFormValuesChanged(data) {
    this.onFormChange.emit(data);
  }

}
