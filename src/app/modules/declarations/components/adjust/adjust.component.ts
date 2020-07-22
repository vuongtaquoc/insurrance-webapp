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

import { TABLE_ADJUST_NESTED_HEADERS, TABLE_ADJUST_HEADER_COLUMNS } from '@app/modules/declarations/data/adjust';



@Component({
  selector: 'app-declaration-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: [ './adjust.component.less' ]
})
export class AdjustComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_ADJUST_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_ADJUST_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<string> = new Subject<string>();
  validateSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];
  families: any[] = [];
  informations: any[] = [];
  declaration: any;
  declarationGeneral: any;
  isHiddenSidebar = false;
  declarationCode: string = '600b';
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
      this.planService.getPlanShowCode(this.declarationCode),
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

      // get filter columns
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'hospitalFirstRegistCode', this.getHospitalsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'planCode', this.getPlanByParent);
      //families filter columns

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations.documentDetail);
          this.declarations = declarations.documentDetail;
        });

        this.isTableValid = true;
      } else {
        this.declarationService.getDeclarationInitials(this.declarationCode, this.tableHeaderColumns).subscribe(declarations => {
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
        const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;

        // replace
        employee.gender = employee.gender === '1';
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
    });
  }


  private updateSelectedValueDropDow(columns, instance, r) {

      columns.forEach((column, colIndex) => {
        if (column.defaultLoad) {
          instance.jexcel.updateDropdownValue(colIndex, r);
        }
      });
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
    this.declarations.forEach((declaration: any, index) => {
      const record = records[index];
      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
      // declaration.data.options.isInitialize = false;
      // declaration.isInitialize = false;
    });

    const rowChange: any = this.declarations[r];

    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }) {
    const declarations = [ ...this.declarations ];
    let row: any = {};

    const beforeRow: any = declarations[insertBefore ? rowNumber - 1 : rowNumber];
    const afterRow: any = declarations[insertBefore ? rowNumber : rowNumber + 1];

    const data: any = [];

    row.data = data;
    row.isInitialize = true;
    row.isLeaf = true;
    row.origin = origin;
    row.options = options;

    if (beforeRow.isLeaf && !afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
    }

    // if (beforeRow.isInitialize) {
    //   beforeRow.isInitialize = false;
    // }

    // if (afterRow.isInitialize) {
    //   afterRow.isInitialize = false;
    // }

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);

    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.eventsSubject.next('validate');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {
    const declarations = [ ...this.declarations ];

    const beforeRow = records[rowNumber - 1];
    const afterRow = records[rowNumber];
    let declarationsDeleted = [];

    if (!((beforeRow.options && beforeRow.options.isLeaf) || (afterRow.options && afterRow.options.isLeaf))) {
      const row: any = declarations[rowNumber];
      const origin = { ...row.data.origin };
      const options = { ...row.data.options };
      origin.employeeId = 0;
      origin.id = 0;
      row.data = [];
      row.origin = origin;
      row.options = options;
      row.isInitialize = true;
    } else {
      declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    }

    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    //this.deleteEmployeeInFamilies(declarationsDeleted);
    this.eventsSubject.next('validate');
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

      if (declaration.isLeaf && declaration.parentKey === order.key) {
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

    return this.wardService.getWards(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns,'recipientsWardsCode', districts);

      return districts;
    });
  }

  private getRelationshipDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }
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
  }

  private getWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }
  }

  private getRelationshipWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }
  }

  private getRecipientsVillageCodeByWarssCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }
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
    console.log(planTypes);
    console.log(source,'source');
    return source.filter(s => planTypes.indexOf(s.id) > -1);
  }

  private getRelationShips(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    if (row.origin && row.origin.isMaster) {
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

  private arrayEmployeeToProps(array, columns, isGetInDeclatation) {
    if(!array.options.isLeaf && isGetInDeclatation) {
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

    if (!array.origin) {
      return object;
    }

    object.origin = array.origin;
    if (array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }

    return object;
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

  handleSelectTab(index) {
    eventEmitter.emit('increase-labor:tab:change', index);
  }
}
