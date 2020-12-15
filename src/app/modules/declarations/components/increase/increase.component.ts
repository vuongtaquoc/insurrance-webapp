import { Component, OnInit, OnChanges, ViewEncapsulation, Input } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, CategoryService, BankService,
  CityService,DistrictService,HospitalService,NationalityService,PeopleService,WardsService,
  SalaryAreaService,PlanService,DepartmentService,EmployeeService,AuthenticationService,
  RelationshipService,VillageService, ExternalService } from '@app/core/services';

import { GeneralBaseComponent } from '@app/modules/declarations/components/adjust-general/base.component';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from '@app/modules/declarations/data/increase-labor';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { log } from 'ng-zorro-antd';

@Component({
  selector: 'app-increase',
  templateUrl: './increase.component.html',
  styleUrls: ['./increase.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class IncreaseComponent extends GeneralBaseComponent implements OnInit, OnChanges {
  @Input() allowAttach: any; 
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
    protected hospitalService: HospitalService,
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
    private externalService: ExternalService,

  ) {
    super(declarationService, modalService, hospitalService);
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
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
      this.planService.getPlanShowCode('600'),
      this.categoryService.getCategories('livesAreaCode'),
      this.categoryService.getCategories('workType'),
      this.categoryService.getCategories('contractType'),
    ]).subscribe(([ peoples,nationalities, cities, salaryAreas,departments, plans,livesAreas, workTypes, contractType  ]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'peopleCode', peoples);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'nationalityCode', nationalities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'registerCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'recipientsCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'planCode', plans);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'departmentCode', departments);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'livesAreaCode', livesAreas);

      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'workTypeCode', workTypes);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'contractTypeCode', contractType);

      // // get filter columns
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      //this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
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
      this.updateOrders(this.declarations.increaselabor.table);
      this.updateOriginByTableName('increaselabor');
    }
  }

  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }

  checkInsurranceCode() {

    const declarations = [...this.declarations.increaselabor.table];
    const INSURRANCE_FULLNAME_INDEX = 1;
    const INSURRANCE_CODE_INDEX = 4;
    const INSURRANCE_STATUS_INDEX = 5;
    const errors = {};
    const leafs = declarations.filter(d => d.isLeaf && d.data[INSURRANCE_CODE_INDEX]);
    this.onCheckIsuranceNo.emit('1');
    //Kiểm tra nếu có dữ liệu cần check thì show loadding
    if(leafs.length > 0) {
      eventEmitter.emit('action:loadding', {
        isShow: true,
      });
     
    }

    forkJoin(
      leafs.map(item => {
        const code = item.data[INSURRANCE_CODE_INDEX];
        return this.externalService.getEmployeeByIsurranceCode(code);
      })
    ).subscribe(results => {

      declarations.forEach((declaration, rowIndex) => {
        const code = declaration.data[INSURRANCE_CODE_INDEX];
        const fullName = declaration.data[INSURRANCE_FULLNAME_INDEX];
        if (code && declaration.isLeaf) {

            const item = results.find(r => r.isurranceCodeCheck === code);
            if (item.fullName === "" || item.fullName === undefined){
                declaration.data[INSURRANCE_STATUS_INDEX] = `Không tìm thấy Mã số ${ declaration.data[INSURRANCE_CODE_INDEX] }`;
                errors[rowIndex] = {
                  col: INSURRANCE_CODE_INDEX,
                  value: code,
                  valid: false
                };
            } else if (item.fullName !==  fullName)
            {
              declaration.data[INSURRANCE_STATUS_INDEX] = `Sai họ tên. Mã số ${ declaration.data[INSURRANCE_CODE_INDEX] } của ${ item.fullName }`;
              errors[rowIndex] = {
                col: INSURRANCE_CODE_INDEX,
                value: code,
                valid: false
              };

            } else
            {
              declaration.data[INSURRANCE_STATUS_INDEX] = '';
            }
        }

      });

      this.declarations.increaselabor.table = declarations;
      eventEmitter.emit('action:loadding', {
        isShow: false,
      });
      this.modalService.success({
        nzTitle: 'Quá trình thực hiện thành công'
      });
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

    }, () => {
      eventEmitter.emit('action:loadding', {
        isShow: false,
      });     
     
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

  handleFormValuesChanged({ data }) {
    this.onFormChange.emit(data);
  }

}
