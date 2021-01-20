import { Component, OnInit, OnChanges, OnDestroy,Input, ViewEncapsulation } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, CategoryService, BankService,
  CityService,DistrictService,HospitalService,NationalityService,PeopleService,WardsService,
  SalaryAreaService,DepartmentService,EmployeeService,AuthenticationService,DocumentListService,
  RelationshipService,VillageService,ExternalService } from '@app/core/services';

import { GeneralNormalBaseComponent } from '@app/modules/declarations/components/reissue-health-insurance-card/base.component';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from '@app/modules/declarations/data/reissue-health-insurance-card.data';
import { Subject, forkJoin, Subscription } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-reissue-health-insurance',
  templateUrl: './reissue-health-insurance.component.html',
  styleUrls: ['./reissue-health-insurance.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ReissueHealthInsuranceComponent extends GeneralNormalBaseComponent implements OnInit, OnChanges, OnDestroy {
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
    protected hospitalService: HospitalService,

    private cityService: CityService,
    private districtService: DistrictService,
   
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private departmentService: DepartmentService,
    private documentListService: DocumentListService,
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
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
  }

  ngOnInit() {
    const currentCredentials = this.authenticationService.currentCredentials;
    // initialize table columns
    this.initializeTableColumns(TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS, 'reissuehealthinsurancecard',currentCredentials);
    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.departmentService.getDepartments(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships(),
      this.categoryService.getCategories('livesAreaCode')
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, departments, relationshipDocumentTypies, relationShips, livesAreas ]) => {
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'peopleCode', peoples);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'nationalityCode', nationalities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'registerCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'recipientsCityCode', cities);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'departmentCode', departments);
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS, 'livesAreaCode', livesAreas);

      // // get filter columns
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(TABLE_HEADER_COLUMNS, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
    });

    this.tabSubscription = this.tabEvents.subscribe((data) => this.handleTabChanged(data));
    this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
      this.handleUserDeleteTables(data.employee,'reissuehealthinsurancecard');
    }));
    this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
      this.handleUserUpdateTables(data.employee, 'reissuehealthinsurancecard');
    }));
  }

  ngOnChanges(changes) {
     if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
      const data = this.declarationService.updateDeclarations(changes.data.currentValue, TABLE_HEADER_COLUMNS, !this.declarationId);
      this.declarations.reissuehealthinsurancecard.table = data;
      this.updateOrders(this.declarations.reissuehealthinsurancecard.table);
      this.updateOriginByTableName('reissuehealthinsurancecard');
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
      this.updateSourceToColumn(TABLE_HEADER_COLUMNS,'registerDistrictCode', districts);

      return districts;
    });
  }

  checkInsurranceCode() {

    const declarations = [...this.declarations.reissuehealthinsurancecard.table];
    const INSURRANCE_FULLNAME_INDEX = 1;
    const INSURRANCE_CODE_INDEX = 2;
    const INSURRANCE_STATUS_INDEX = 3;
    const errors = {};
    const leafs = declarations.filter(d => d.isLeaf && d.data[INSURRANCE_CODE_INDEX]);

    //Kiểm tra nếu có dữ liệu cần check thì show loadding
    if(leafs.length > 0) {
      eventEmitter.emit('action:loadding', {
        isShow: true,
      });

      this.onCheckIsuranceNo.emit('1');
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

      this.declarations.reissuehealthinsurancecard.table = declarations;
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
