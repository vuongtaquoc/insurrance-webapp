import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';

import { Declaration, DocumentList } from '@app/core/models';
import {
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService,
  SalaryAreaService,
  PlanService,
  DocumentListService,
  AuthenticationService,
  DepartmentService,
  EmployeeService,
  CategoryService,
  RelationshipService,
  VillageService,
} from '@app/core/services';
import { DATE_FORMAT, DECLARATIONS, DOCUMENTBYPLANCODE } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/increase-labor';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: [ './increase-labor.component.less' ]
})
export class IncreaseLaborComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<string> = new Subject<string>();
  validateSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];
  familiesList: any[] = [];
  informationList: any[] = [];
  declaration: any;
  declarationGeneral: any;
  isHiddenSidebar = false;
  declarationCode: string = '600';
  employeeSubject: Subject<any> = new Subject<any>();
  handler: any;
  isTableValid = false;
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  totalNumberInsurance: any;
  totalCardInsurance: any;

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private districtService: DistrictService,
    private declarationService: DeclarationService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private planService: PlanService,
    private departmentService: DepartmentService,
    private documentListService: DocumentListService,
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private modalService: NzModalService,
    private relationshipService: RelationshipService,
    private villageService: VillageService,
  ) {
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getPlanByParent = this.getPlanByParent.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRelationshipDistrictsByCityCode = this.getRelationshipDistrictsByCityCode.bind(this);
    this.getRelationshipWardsByDistrictCode = this.getRelationshipWardsByDistrictCode.bind(this);
    this.getRecipientsVillageCodeByWarssCode = this.getRecipientsVillageCodeByWarssCode.bind(this);
    this.getDistrictsByCityCode = this.getDistrictsByCityCode.bind(this);
    this.getWardsByDistrictCode = this.getWardsByDistrictCode.bind(this);
    this.getRelationShips = this.getRelationShips.bind(this);
  }

  ngOnInit() {
    const date = new Date();
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      number: [ '1' ],
      month: [ date.getMonth() + 1 ],
      year: [ date.getFullYear() ]
    });

    this.documentForm = this.formBuilder.group({
      userAction: [this.currentCredentials.companyInfo.delegate],
      mobile:[this.currentCredentials.companyInfo.mobile],
      usedocumentDT01:[true],
    });

    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });

    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.planService.getPlans(this.declarationCode),
      this.departmentService.getDepartments(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships()
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, plans, departments, relationshipDocumentTypies, relationShips ]) => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumns, 'nationalityCode', nationalities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'registerCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(this.tableHeaderColumns, 'planCode', plans);
      this.updateSourceToColumn(this.tableHeaderColumns, 'departmentId', departments);

      //families table
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'cityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipDocumentType', relationshipDocumentTypies);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', relationShips);

      // get filter columns
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'planCode', this.getPlanByParent);
      //families filter columns

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipDistrictCode', this.getRelationshipDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipWardsCode', this.getRelationshipWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipVillageCode', this.getRecipientsVillageCodeByWarssCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'districtCode', this.getDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'wardsCode', this.getWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', this.getRelationShips);

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations.documentDetail);
          this.declarations = declarations.documentDetail;
          this.informationList = declarations.informations;

          this.declarationGeneral = {
            totalNumberInsurance: declarations.totalNumberInsurance,
            totalCardInsurance: declarations.totalCardInsurance
          };

        });

        this.isTableValid = true;
      } else {
        this.declarationService.getDeclarationInitials('600', this.tableHeaderColumns).subscribe(declarations => {
          this.declarations = declarations;
        });

        this.declarationGeneral = {
          totalNumberInsurance: '',
          totalCardInsurance: ''
        };
      }
    });

    this.handler = eventEmitter.on('labor-table-editor:validate', ({ name, isValid }) => {
      if (name === 'increaseLabor') {
        this.isTableValid = isValid;
      }
    });
  }

  ngOnDestroy() {
    this.handler();
  }

  handleAddEmployee(type) {
    if (!this.employeeSelected.length) {
      return this.modalService.warning({
        nzTitle: 'Chưa có nhân viên nào được chọn',
      });
    }

    const declarations = [ ...this.declarations ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => (e.origin.employeeId || e.origin.id) === employee.id) === -1;

        // replace
        employee.gender = !employee.gender;
        employee.workAddress = this.currentCredentials.companyInfo.address;
        //
        if (accepted) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize data
            declarations.splice(childLastIndex, 1);

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
          }
        }
      });

      // update orders
      this.updateOrders(declarations);

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
      });

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    }

    this.employeeSubject.next({
      type: 'clean'
    });
    this.employeeSelected.length = 0;
    this.eventsSubject.next('validate');
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
  }

  emitEventToChild(type) {
    this.eventsSubject.next(type);
  }

  handleSubmit(event) {
    const { number, month, year } = this.form.value;

    this.onSubmit.emit({
      type: event.type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentNo: number,
      createDate: `01/0${ month }/${ year }`,
      documentStatus: 0,
      totalNumberInsurance: this.totalNumberInsurance,
      totalCardInsurance: this.totalCardInsurance,
      documentDetail: event.data,
      informations: this.reformatInformationList(),
      families: this.reformatFamilies(),
    });
  }

  handleChangeDataFamilies({ instance, cell, c, r, records }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumnsFamilies[c];
      if (column.key === 'isMaster') {
        const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);

        if(employeeIsMaster === true) {

          this.employeeService.getEmployeeById(records[r].options.employeeId).subscribe(emp => {
            this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
            this.updateNextColumns(instance, r, emp.relationshipMobile, [ c + 2]);
            this.updateNextColumns(instance, r, emp.relationshipDocumentType, [ c + 3]);
            this.updateNextColumns(instance, r, emp.relationshipBookNo, [ c + 4]);
            this.updateNextColumns(instance, r, emp.recipientsCityCode, [ c + 5]);
            this.updateNextColumns(instance, r, emp.recipientsDistrictCode, [ c + 6]);
            this.updateNextColumns(instance, r, emp.recipientsWardsCode, [ c + 7]);
            this.updateNextColumns(instance, r, emp.fullName, [ c + 10]);
            this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 11]);
            this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 12]);
            this.updateNextColumns(instance, r, emp.birthday, [ c + 13]);
            this.updateNextColumns(instance, r, emp.gender, [ c + 14]);
            this.updateNextColumns(instance, r, emp.recipientsCityCode, [ c + 16]);
            this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 17]);
            this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 18]);
            this.updateNextColumns(instance, r, '00', [21]);
            this.updateNextColumns(instance, r, emp.identityCar, [c + 20]);
          });

        }else {
          this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
          c + 10, c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17]);
        }

      }
    }
  }

  handleChangeTable({ instance, cell, c, r, records }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumns[c];

      if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstRegistName = cell.innerText.split(' - ').pop();

        this.updateNextColumns(instance, r, hospitalFirstRegistName, [ c + 1 ]);
      } else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'recipientsCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 5, c + 6 ]);
      }

    }
    // update declarations
    this.declarations.forEach((declaration, index) => {
      const record = records[index];
      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
    });
    const employeesInDeclaration = this.getEmployeeInDeclaration(records);
    this.setDataToFamilies(employeesInDeclaration);
    this.setDateToInformationList(employeesInDeclaration);
    this.eventsSubject.next('validate');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {

    const declarations = [ ...this.declarations ];

    const declarationsDeleted = declarations.splice(rowNumber, numOfRows);

    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.deleteEmployeeInFamilies(declarationsDeleted);
    this.eventsSubject.next('validate');
  }

  deleteEmployeeInFamilies(declarationsDeleted: any) {
    const employeeIdDeleted = [];
    declarationsDeleted.forEach(itemDeleted => {
      const item = this.declarations.find(d => d.origin.employeeId === itemDeleted.origin.employeeId);

      if(item){
        return;
      }
      employeeIdDeleted.push(itemDeleted.origin.employeeId);
    });
    let familiesList = [...this.familiesList];
    employeeIdDeleted.forEach(id => {
      familiesList = familiesList.filter(fa => fa.employeeId !== id);
    });

    if(familiesList.length === 0) {
      familiesList.push({
        isMaster: false,
      });
    }
    this.familiesList = familiesList;
  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleFormValuesChanged(data) {
    this.totalNumberInsurance = data.totalNumberInsurance;
    this.totalCardInsurance = data.totalNumberInsurance;
  }

  checkInsurranceCode() {
    const declarations = [...this.declarations];
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

    this.declarations = declarations;

    setTimeout(() => {
      this.validateSubject.next({
        field: 'isurranceCode',
        errors
      });
    }, 20);
  }

  private updateOrders(declarations) {
    const order: { index: 0, key: string } = { index: 0, key: '' };

    declarations.forEach((declaration, index) => {
      if (declaration.hasLeaf) {
        order.index = 0;
        order.key = declaration.key;
      }

      if (declaration.isLeaf && declaration.parentKey === order.key && !declaration.isInitialize) {
        order.index += 1;

        declaration.data[0] = order.index;
      }
    });
  }

  private updateSourceToColumn(tableHeaderColumns, key, sources) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  private updateFilterToColumn(tableHeaderColumns,key, filterCb) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.filter = filterCb;
    }
  }

  private getRegisterDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns,'registerDistrictCode', districts);

      return districts;
    });
  }

  private getRecipientsWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns,'recipientsWardsCode', districts);

      return districts;
    });
  }

  private getRelationshipDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'relationshipDistrictCode', districts);

      return districts;
    });
  }

  private getRegisterWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumns,'registerWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', districts);

      return districts;
    });
  }

  private getDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'districtCode', districts);

      return districts;
    });
  }

  private getWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'wardsCode', wards);
      return wards;
    });
  }

  private getRelationshipWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'relationshipWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsVillageCodeByWarssCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.villageService.getVillage(value).toPromise().then(village => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipVillageCode', village);

      return village;
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
    return source.filter(s => s.type === row.options.planType);
  }

  private getRelationShips(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    
    if (row[1]) {
      return source;
    }

    return source.filter(s => s.id !== '00');;
  }

  private updateNextColumns(instance, r, value, nextColumns = []) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);

      instance.jexcel.setValue(columnName, value);
    });
  }

  get usedocumentDT01() {
    return this.documentForm.get('usedocumentDT01').value;
  }

  handleChangeDataDocumentList({ records, columns }) {
    const informationList = [];
    records.forEach(record => {
      informationList.push(this.arrayToProps(record, columns));
    });
    this.informationList = informationList;
  }

  handleDeleteProcessDataDocumentList({ rowNumber, numOfRows }) {

  }

  private arrayToProps(array, columns) {
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'numberic') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );
    return object;
  }

  private arrayEmployeeToProps(array, columns) {
    if(!array.options.isLeaf) {
      return null;
    }
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'numeric') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );

    if (array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }
    return object;
  }

  reformatInformationList() {
    const informationList = [];
    let informationcopy = [ ...this.informationList ];
    informationcopy.forEach(information => {
        if(information.fullName) {
          information.dateRelease = information.dateRelease ? moment(information.dateRelease).format(DATE_FORMAT.FULL) : '';
          information.dateEffective = information.dateEffective ? moment(information.dateEffective).format(DATE_FORMAT.FULL) : '';
          informationList.push(information);
        }
    });

    return informationList;
  }

  reformatFamilies() {
    const familiesList = [];
    let familiesListcopy = [ ...this.familiesList ];
    familiesListcopy.forEach(family => {
        if(family.fullName) {
          familiesList.push(family);
        }
    });

    return familiesList;
  }


  private setDataToFamilies(employeesInDeclaration: any)
  {
    const familiesList = [];
    const employees = [];
    const employeesId = [];
    employeesInDeclaration.forEach(emp => {

      const employeeId = employeesId.find(c => c === emp.employeeId);
      if(employeeId) {
        return;
      }

      employeesId.push(emp.employeeId);

      const currentEmpl = this.familiesList.find(c => c.employeeId === emp.employeeId);
        //Nếu đã tồn tại nhân viên trong bảng gia đình thì bỏ qua
        if (!currentEmpl) {
          employees.push(emp);
        }else {

          const currentFamilies = this.familiesList.filter(fm => fm.employeeId === emp.employeeId);
          if(currentFamilies){
            currentFamilies.forEach(oldEmp => {
              familiesList.push(oldEmp);
            });
          }

        }
    });


    forkJoin(
      employees.map(emp => {
        return this.employeeService.getEmployeeById(emp.employeeId)
      })
    ).subscribe(emps => {

      emps.forEach(ep => {

        let master = this.getMaster(ep.families);
        master.isMaster = ep.isMaster;
        master.employeeName = ep.fullName;
        master.employeeId = ep.employeeId;
        master.relationshipFullName = ep.relationshipFullName;
        master.relationshipBookNo = ep.relationshipBookNo;
        master.relationshipDocumentType =  ep.relationshipDocumentType;
        master.relationshipCityCode = ep.relationshipCityCode;
        master.relationshipDistrictCode = ep.relationshipDistrictCode;
        master.relationshipWardsCode = ep.relationshipWardsCode;
        master.relationshipVillageCode = ep.relationshipVillageCode;
        master.relationshipCode = '00';
        familiesList.push(master);

        if(ep.families.length > 0) {
          ep.families.forEach(fa => {
            if(fa.relationshipCode === '00') {
              return;
            }

            fa.isMaster = false;
            fa.employeeId = ep.employeeId;
            familiesList.push(fa);
          });
        }else {
          // nếu chưa có thông tin của gia đình thì add dòng trống
          familiesList.push({
              isMaster:false,
              employeeId: ep.employeeId,
          });
          familiesList.push({
            isMaster:false,
            employeeId: ep.employeeId,
        });
        }

      });
      this.familiesList = familiesList;
    });
  }

  private setDateToInformationList(employeesInDeclaration: any)
  {
    const informationList = [];
    employeesInDeclaration.forEach(emp => {
      const documentlist = this.getDocumentByPlancode(emp.planCode);

      if(!documentlist) {
        return;
      }

      documentlist.forEach(element => {
        let item = {
          fullName: emp.fullName,
          isurranceNo: emp.isurranceNo,
          documentNo: '',
          dateRelease: '',
          isurranceCode: emp.isurranceCode,
          documentType: element.documentName,
          companyRelease: this.currentCredentials.companyInfo.name,
          documentNote: element.documentNote,
          documentAppraisal: ('Truy tăng ' + emp.fullName + ' từ' + emp.fromDate)
        };
        if(element.isContract) {
          item.documentNo = emp.contractNo;
          item.dateRelease =  emp.dateSign;
        }else {
          item.documentNo = emp.fromDate;
        }
        informationList.push(item);
      });
    });
    this.informationList = informationList;
  }

  private getEmployeeInDeclaration(records: any) {
    const employeesInDeclaration = [];
    records.forEach(record => {
      const employee = this.arrayEmployeeToProps(record, this.tableHeaderColumns);
      if(employee && employee.employeeId) {
        employeesInDeclaration.push(employee);
      }
    });
    return employeesInDeclaration;
  }


  handleToggleSidebar() {
    this.isHiddenSidebar = !this.isHiddenSidebar;
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
  }

  getDocumentByPlancode(planCode: string) {
    if(!planCode) {
      return null;
    }
    const document = _.find(DOCUMENTBYPLANCODE, {
      key: planCode,
    });

    if(document) {
      return document.value;
    }else {
      return null;
    }
  }


  getMaster(families: any) {
    const master = _.find(families, {
      relationshipCode: '00',
    });
    if(master) {
      return master;
    }
    return {};
  }

}
