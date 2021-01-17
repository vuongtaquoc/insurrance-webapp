import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import { REGEX } from '@app/shared/constant';
import { PLANCODECOUNTBHXH, PLANCODECOUNTBHYT } from '@app/shared/constant-valid';
import { DocumentFormComponent } from '@app/shared/components';

import { Declaration, DocumentList } from '@app/core/models';
import {
  CityService,
  DistrictService,
  DeclarationService,
  WardsService,
  DocumentListService,
  AuthenticationService,
  EmployeeService,
  CategoryService,
  RelationshipService,
  VillageService,
  PeopleService,
  NationalityService,
  DeclarationConfigService,
  SalaryAreaService,
} from '@app/core/services';
import { DATE_FORMAT, DOCUMENTBYPLANCODE, ACTION } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TableEditorErrorsComponent } from '@app/shared/components';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';

import { Router } from '@angular/router';

const TAB_NAMES = {
  1: 'increase',
  2: 'reduction',
  3: 'adjustment'
};

@Component({
  selector: 'app-adjust-general',
  templateUrl: './adjust-general.component.html',
  styleUrls: [ './adjust-general.component.less' ]
})
export class AdjustGeneralComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onAddEmployee: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  files: any;
  currentCredentials: any;
  documentForm: FormGroup;
  documentList: DocumentList[] = [];
  isHiddenSidebar = false;
  declarationCode: string = '601';
  declarationName: string = '';
  autoCreateDocumentList: boolean;
  autoCreateFamilies: boolean;
  allowAttachFile: boolean;
  selectedTabIndex: number = 1;
  eventValidData = 'adjust-general:validate';
  handler: any;
  isTableValid = false;
  status = 0;
  tableErrors = {};
  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  formError: any[] = [];
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  declarationGeneral: any;
  allInitialize: any = {};
  declarations: any = {
    origin: {},
    form: {},
    formOrigin: {},
    formGenelral: {},
    tables: {}
  };
  isSpinning = false;
  salaryAreas: any;
  families: any[] = [];
  informations: any[] = [];
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  tableSubject: Subject<any> = new Subject<any>();
  tabSubject: Subject<any> = new Subject<any>();
  handlers: any = [];
  isCheckIsuranceCode: boolean = true;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
    private modalService: NzModalService,
    private employeeService: EmployeeService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private relationshipService: RelationshipService,
    private districtService:  DistrictService,
    private wardService: WardsService,
    private villageService: VillageService,
    private peopleService: PeopleService,
    private declarationConfigService: DeclarationConfigService,
    private nationalityService: NationalityService,
    private salaryAreaService: SalaryAreaService,
  ) {

    this.getRelationshipDistrictsByCityCode = this.getRelationshipDistrictsByCityCode.bind(this);
    this.getRelationshipWardsByDistrictCode = this.getRelationshipWardsByDistrictCode.bind(this);
    this.getRecipientsVillageCodeByWarssCode = this.getRecipientsVillageCodeByWarssCode.bind(this);

    this.getDistrictsByCityCode = this.getDistrictsByCityCode.bind(this);
    this.getWardsByDistrictCode = this.getWardsByDistrictCode.bind(this);

    this.getRelationShips = this.getRelationShips.bind(this);
  }

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      submitter: ['', Validators.required],
      mobile: ['',  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
    });

    this.loadDeclarationConfig();
    this.loadSalaryInfo();
    //Init data families table editor
    forkJoin([
      this.cityService.getCities(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships(),
      this.peopleService.getPeoples(),
      this.nationalityService.getNationalities()
    ]).subscribe(([cities, relationshipDocumentTypies, relationShips, peoples, nationalities ]) => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'cityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipDocumentType', relationshipDocumentTypies);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', relationShips);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'nationalityCode', nationalities);

      //families filter columns

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipDistrictCode', this.getRelationshipDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipWardsCode', this.getRelationshipWardsByDistrictCode);

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipVillageCode', this.getRecipientsVillageCodeByWarssCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'districtCode', this.getDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'wardsCode', this.getWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', this.getRelationShips);

    //End Init data families table editor
      this.currentCredentials = this.authenticationService.currentCredentials;

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentIdByGroup(this.declarationId).subscribe(declarations => {
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile
          });

          this.declarations.origin = declarations.documentDetail;
          this.declarations.files = declarations.files;
          this.informations = this.fomatInfomation(declarations.informations);
          this.families = this.fomatFamilies(declarations.families);
          this.status = declarations.status;
          this.declarations.formOrigin = {
            batch: declarations.batch,
            month: declarations.month,
            quarter: declarations.quarter,
            year: declarations.year,
          };

          this.declarationGeneral = {
            totalNumberInsurance: declarations.totalNumberInsurance,
            totalCardInsurance: declarations.totalCardInsurance
          };

        });
      } else {
        this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
          this.declarations.origin = data;
        });

        this.declarationService.getHeaderDeclaration(this.declarationCode).subscribe(data => {
          this.declarations.formOrigin = {
            batch: data.batch,
            month: data.month,
            quarter: data.quarter,
            year: data.year,
          };
        });

        this.documentForm.patchValue({
          submitter: this.currentCredentials.companyInfo.delegate,
          mobile: this.currentCredentials.companyInfo.mobile
        });

        this.declarationGeneral = {
          totalNumberInsurance: 0,
          totalCardInsurance: 0
        };
      }

      this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
        this.documentList = documentList;
      });

      this.handler = eventEmitter.on(this.eventValidData, ({ name, isValid, leaf, initialize, errors }) => {
        this.allInitialize[name] = leaf.length === initialize.length;
        this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
        this.tableErrors[name + this.declarationCode] = errors;
      });

      this.tabSubject.next({
        type: 'change',
        selected: TAB_NAMES[1]
      });

      this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
          this.handlersDeleteUseOnTree(data.employee);
      }));

      this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
        this.updateEmployeeInFamily(data.employee);
        this.updateEmployeeInInfomation(data.employee);
      }));

    });
  }

  ngOnDestroy() {
    this.handler();
  }

  private loadDeclarationConfig() {
    this.declarationConfigService.getDetailByCode(this.declarationCode).subscribe(data => {
       this.declarationName = data.declarationName;
       this.autoCreateDocumentList = data.autoCreateDocumentList;
       this.autoCreateFamilies = data.autoCreateFamilies;
       this.allowAttachFile = data.allowAttachFile;
    });
  }

  private loadSalaryInfo() {
    const companyInfo  =  this.authenticationService.currentCredentials.companyInfo;
    this.salaryAreaService.getDetailByCode(companyInfo.salaryAreaCode).subscribe((data) => {
      this.salaryAreas = data;
    });
  }

  private updateEmployeeInFamily(user) {

    const families = [ ...this.families ];
    families.forEach(d => {
      if(d.origin &&  d.origin.isMaster &&  d.origin.employeeId === user.id) {
        Object.keys(d).forEach(key => {
          if(user[key] !== undefined) {
             d[key] = user[key];
          }
        });

        d.employeeName = user.fullName;
        d.data = this.tableHeaderColumnsFamilies.map(column => {
          if (!column.key || !d[column.key]) return '';
          return d[column.key];
        });
        d.data.origin = d.origin;
      }
    });

    this.families = families;
  }


  private updateEmployeeInInfomation(user) {

    const informations = [ ...this.informations ];
    informations.forEach(d => {
      if(d.origin && d.origin.employeeId === user.id) {
        Object.keys(d).forEach(key => {
          if(user[key] !== undefined) {
             d[key] = user[key];
          }
        });

        d.data = this.tableHeaderColumnsDocuments.map(column => {
          if (!column.key || !d[column.key]) return '';
          return d[column.key];
        });
        d.data.origin = d.origin;
      }
    });

    this.informations = informations;
  }

  handleChangeTable(data, tableName) {
    this.declarations.tables[tableName] = this.declarations[tableName] || {};
    this.declarations.tables[data.tableName]= data.data;

    if(tableName === 'increaselabor') {
      this.isCheckIsuranceCode = false;
      this.sumCreateBHXH(data.data);
    }

    if (data.action === ACTION.EDIT) {
      this.setDateToInformationList(this.declarations.tables);
    }

    if (data.action === ACTION.DELETE) {
      this.deleteEmployeeInInfomation(data.data, data.dataChange, data.columns);
    }

    this.notificeEventValidData('documentList');

    if(tableName !== 'increaselabor') {
      return '';
    }

    if (data.action === ACTION.DELETE) {
      this.deleteEmployeeInFamilies(data.data, data.dataChange);
    }

    if (data.action === ACTION.ADD) {
      this.setDataToFamilyEditor(data.data);
    }

    if (data.action === ACTION.MUNTILEADD) {
      this.setDataToFamilyEditor(data.data);
    }

    this.notificeEventValidData('family');
  }

  handleFormValuesChanged(data) {
    this.declarations.form = data;
  }

  handleSelectTab({ index }) {
    this.selectedTabIndex = index;
    eventEmitter.emit('adjust-general:tab:change', index);
    this.tabSubject.next({
      type: 'change',
      selected: TAB_NAMES[index]
    });
  }

  handleHiddenSidebar(isHidden) {
    this.isHiddenSidebar = isHidden;
  }

  saveAndView() {
    this.tableSubmitErrors = {};
    this.tableSubmitErrorCount = 0;

    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }

    eventEmitter.emit('tableEditor:validFrom', {
      tableName: 'documentList'
    });

    if(this.formError.length > 0) {
      this.tableErrors['generalFomError'] = this.formError;
    } else {
      this.tableErrors['generalFomError'] = [];
    }

    const errorDocumentForm = this.validDocumentForm();
    if (errorDocumentForm.length > 0) {
      this.tableErrors['documentFomError'] = errorDocumentForm;
    } else {
      this.tableErrors['documentFomError'] = [];
    }

    let count = Object.keys(this.tableErrors).reduce(
      (total, key) => {
        const data = this.tableErrors[key];
        return total + data.length;
      },
      0
    );

    if (count > 0) {
      this.tableSubmitErrors = Object.keys(this.tableErrors).reduce(
        (combine, key) => {
          const data = this.tableErrors[key];

          return {...combine, [key]: data.length};
        },
        {}
      );

      this.tableSubmitErrorCount = count;

      return this.modalService.error({
        nzTitle: 'Lỗi dữ liệu. Vui lòng sửa!',
        nzContent: TableEditorErrorsComponent,
        nzComponentParams: {
          errors: this.getColumnErrror()
        },
      });
    }
    //Kiêm tra nếu tồn tại nhân viên bên tab báo tăng thì yêu cầu kiêm tra mã số BHXH
    const hastEmployeeInTabIncreaselabor = this.isHasLeaf('increaselabor');
    if (!this.isCheckIsuranceCode && hastEmployeeInTabIncreaselabor) {
      this.modalService.warning({
        nzTitle: 'Đơn vị chưa kiểm tra Mã số BHXH và trạng thái của người tham gia'
      });
      return;
    }
    eventEmitter.emit('unsaved-changed', true);
    if (this.declarationId) {
      this.update('saveAndView');
    } else {
      this.create('saveAndView');
    }
  }

  rollback() {    
    this.router.navigate(['/declarations/adjust-general']);      
  }

  private sumCreateBHXH(data) {
    let totalCardInsurance = 0;
    let totalNumberInsurance = 0;
    data.forEach(d => {
        d.declarations.forEach(e => {
          const isSumCardInsurance = PLANCODECOUNTBHXH.findIndex(p => p === e.planCode) > -1;
          const isSumNumberInsurance = PLANCODECOUNTBHYT.findIndex(p => p === e.planCode) > -1;
          if(isSumCardInsurance) {
            totalCardInsurance = totalCardInsurance + 1;
          }

          if(isSumNumberInsurance) {
            totalNumberInsurance = totalNumberInsurance + 1;
          }

        });
    });
    const declarationGeneralTemp = {...this.declarationGeneral};
    declarationGeneralTemp.totalCardInsurance = totalCardInsurance;
    declarationGeneralTemp.totalNumberInsurance = totalNumberInsurance;

    this.declarationGeneral = declarationGeneralTemp;
  }

  save() {

    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }
    eventEmitter.emit('unsaved-changed', true);
    if (this.declarationId) {
      this.update('save');
    } else {
      this.create('save');
    }

  }

  private getColumnErrror() {
    let tableErrorMessage = Object.keys(this.tableErrors).reduce(
      (combine, key) => {
        if (this.tableErrors[key].length) {
          return { ...combine, [key]: this.tableErrors[key] };
        }

        return { ...combine };
      },
      {}
    );
    return tableErrorMessage;
  }

  private create(type: any) {
    this.isSpinning = true;

    this.declarationService.create({
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(type),
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      ...this.declarations.formGenelral,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: this.reformatInformations(),
      families: this.reformatFamilies(),
      files: this.declarations.files,
    }).subscribe(data => {
      this.isSpinning = false;

      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else{
        this.router.navigate(['/declarations/adjust-general']);
      }
    });
  }

  private update(type: any) {
    this.isSpinning = true;

    this.declarationService.update(this.declarationId, {
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(type),
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      ...this.declarations.formGenelral,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: this.reformatInformations(),
      families: this.reformatFamilies(),
      files: this.declarations.files,
    }).subscribe(data => {
      this.isSpinning = false;

      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/adjust-general']);
      }
    });
  }

  private getStatus(type) {
    if(this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }

  viewDocument(declarationInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Thông tin biểu mẫu, tờ khai đã xuất',
      nzContent: DocumentFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        declarationInfo
      }
    });

    modal.afterClose.subscribe(result => {
    });
  } 

  get submitter() {
    return this.documentForm.get('submitter').value;
  }

  get mobile() {
    return this.documentForm.get('mobile').value;
  }

  private tablesToApi(tables) {
    const data = [];
    Object.keys(tables).forEach(key => {
      const table = tables[key];
      data.push(...table);
    });

    return data;
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

// families tab
handleChangeDataFamilies({ instance, cell, c, r, records, columns }) {
  if (c !== null && c !== undefined) {
    c = Number(c);
    const column = this.tableHeaderColumnsFamilies[c];
    if (column.key === 'isMaster') {
      const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);

      if(employeeIsMaster === true) {

        this.employeeService.getEmployeeById(records[r].origin.employeeId).subscribe(emp => {
            this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
            this.updateNextColumns(instance, r, emp.relationshipMobile, [ c + 2]);
            this.updateNextColumns(instance, r, emp.relationshipDocumentType, [ c + 3]);
            this.updateNextColumns(instance, r, emp.relationshipBookNo, [ c + 4]);
            this.updateNextColumns(instance, r, emp.relationshipCityCode , [ c + 5]);
            this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 6]);
            this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 7]);
            this.updateNextColumns(instance, r, emp.relationshipVillageCode, [ c + 8]);
            this.updateNextColumns(instance, r, emp.fullName, [ c + 10]);
            this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 11]);
            this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 12]);
            this.updateNextColumns(instance, r, emp.birthday, [ c + 13]);
            this.updateNextColumns(instance, r, emp.gender, [ c + 14]);
            this.updateNextColumns(instance, r, emp.nationalityCode, [ c + 15]);
            this.updateNextColumns(instance, r, emp.peopleCode, [ c + 16]);
            this.updateNextColumns(instance, r, emp.registerCityCode, [ c + 18]);
            this.updateNextColumns(instance, r, emp.registerDistrictCode, [ c + 19]);
            this.updateNextColumns(instance, r, emp.registerWardsCode, [ c + 20]);
            this.updateNextColumns(instance, r, '00', [23]);
            this.updateNextColumns(instance, r, emp.identityCar, [c + 22]);
            this.updateSelectedValueDropDown(columns, instance, r);
        });

      }else {
        this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
          c + 10, c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17,c + 18,c + 19,c + 20, c + 21, c + 22]);

        const value = instance.jexcel.getValueFromCoords(1, r);
        const numberColumn = this.tableHeaderColumnsFamilies.length;
        this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
      }

    }

    if (column.key === 'sameAddress') {
      const isSameAddress = instance.jexcel.getValueFromCoords(c, r);

      if(isSameAddress === true)
      {
        this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(7, r), [ c + 1]);
        this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(8, r), [ c + 2]);
        this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(9, r), [ c + 3]);
        this.updateSelectedValueDropDown(columns, instance, r);

      } else {
        this.updateNextColumns(instance, r, '', [ c + 1]);
        this.updateNextColumns(instance, r, '', [ c + 2]);
        this.updateNextColumns(instance, r, '', [ c + 3]);
      }
    }

    if (column.willBeValid) {
      const value = instance.jexcel.getValueFromCoords(c, r);
      const numberColumn = this.tableHeaderColumnsFamilies.length;
      this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
    }
  }

  //update families
  this.families.forEach((family: any, index) => {
    const record = records[index];
    //update data on Jexcel
    Object.keys(record).forEach(index => {
      family.data[index] = record[index];
    });
    //update data object source
    columns.map((column, index) => {
        family[column.key] = record[index];
    });

  });

  this.notificeEventValidData('family');

}

private updateSelectedValueDropDown(columns, instance, r) {

  columns.forEach((column, colIndex) => {
    if (column.defaultLoad) {
      instance.jexcel.updateDropdownValue(colIndex, r);
    }
  });
}

private updateNextColumns(instance, r, value, nextColumns = []) {
  nextColumns.forEach(columnIndex => {
    const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
    instance.jexcel.setValue(columnName, value);
  });
}

handleDeleteMember({ rowNumber, numOfRows, records }) {
  const families = [ ...this.families ];

  const familyDeleted = families.splice(rowNumber, numOfRows);
  this.families = families;
}

handleAddMember({ rowNumber, numOfRows, beforeRowIndex, afterRowIndex, options, origin, insertBefore }) {
  const families = [ ...this.families ];
  let row: any = {};

  const beforeRow: any = families[insertBefore ? beforeRowIndex - 1 : beforeRowIndex];
  const afterRow: any = families[afterRowIndex];
  const data: any = [];
  row.data = data;
  row.isMaster = false;

  row.origin = {
    employeeId: beforeRow.origin.employeeId,
    isLeaf: true,
    isMaster: false,
  };

  row.employeeId = beforeRow.employeeId;
  families.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);

  this.families = families;
  this.notificeEventValidData('family');
}


private getEmployeeInDeclarations(records: any) {
  const employeesInDeclaration = [];
  records.forEach(record => {
    const declarations = record.declarations;
    declarations.forEach(declaration => {
      if(declaration && declaration.employeeId) {

        declaration.origin = {
          employeeId: declaration.employeeId,
          isLeaf:true,
          isMaster: false,
          declarationCode: record.code,
          category: record.category,
          planCode: declaration.planCode
        };

        declaration.conditionValid = declaration.relationshipFullName;
        employeesInDeclaration.push(declaration);
      }
    });

  });
  return employeesInDeclaration;
}

handleValidForm(data) {
  this.formError = data.errorMessage;
}

private setDataToFamilyEditor(records: any)
  {
    const currentFamilis = [...this.families]
    const families = [];
    const employees = [];
    const employeesId = [];
    const employeesInDeclaration = this.getEmployeeInDeclarations(records);
    employeesInDeclaration.forEach(emp => {

      const firstEmployee = currentFamilis.find(f => f.employeeId === emp.employeeId);
      if(!firstEmployee) {
        employees.push(emp);
      } else {

        const family = families.find(p => p.employeeId === emp.employeeId);
        if(family) {
          return;
        }

        const currentFamilies = currentFamilis.filter(fm => fm.employeeId === emp.employeeId);
        if(currentFamilies){
          currentFamilies.forEach(oldEmp => {
            families.push(oldEmp);
          });
        }

      }

    });

    forkJoin(
      employees.map(emp => {
        return this.employeeService.getEmployeeById(emp.employeeId)
      })
    ).subscribe(emps => {
      const familiesNotExists = [];
      emps.forEach(ep => {
        const master = this.getMaster(ep.families);
        master.isMaster = ep.isMaster;
        master.employeeName = ep.fullName;
        master.employeeId = ep.employeeId;
        master.relationshipMobile = ep.relationshipMobile;
        master.relationshipFullName = ep.relationshipFullName;
        master.relationshipBookNo = ep.relationshipBookNo;
        master.relationshipDocumentType =  ep.relationshipDocumentType;
        master.relationshipCityCode = ep.relationshipCityCode;
        master.relationshipDistrictCode = ep.relationshipDistrictCode;
        master.relationshipWardsCode = ep.relationshipWardsCode;
        master.relationshipVillageCode = ep.relationshipVillageCode;
        master.relationshipCode = '00';
        master.peopleCode = ep.peopleCode,
        master.nationalityCode = ep.nationalityCode,
        master.conditionValid = ep.relationshipFullName ? ep.relationshipFullName : ep.fullName;
        master.origin = {
          employeeId: ep.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        familiesNotExists.push(master);

        if(ep.families.length > 1) {
          ep.families.forEach(fa => {
            if(fa.relationshipCode === '00') {
              return;
            }

            fa.isMaster = false;
            fa.employeeId = ep.employeeId;
            fa.conditionValid = ep.relationshipFullName;
            fa.origin = {
              employeeId: ep.employeeId,
              isLeaf: true,
              isMaster: false,
            }
            familiesNotExists.push(fa);
          });
        }else {
          // nếu chưa có thông tin của gia đình thì add dòng trống
          familiesNotExists.push(this.fakeEmployeeInFamilies(ep));
          familiesNotExists.push(this.fakeEmployeeInFamilies(ep));
        }

      });

      familiesNotExists.forEach(d => {
        families.push(d);
      });

      families.forEach(p => {
        p.data = this.tableHeaderColumnsFamilies.map(column => {
          if (!column.key || !p[column.key]) return '';
          return p[column.key];
        });
        p.data.origin = p.origin;
      });

      this.families = families;
    });
  }

  fakeEmployeeInFamilies(employee) {

    return {
      isMaster:false,
      conditionValid: null,
      employeeId: employee.employeeId,
      origin: {
        employeeId: employee.employeeId,
        isLeaf: true,
        isMaster: false,
      }
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

  private getRelationShips(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    if (row.origin && row.origin.isMaster) {
      return source;
    }

    return source.filter(s => s.id !== '00');;
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

  deleteEmployeeInInfomation(declarations, declarationsDeleted, columns) {
    let informations = [...this.informations];

    declarationsDeleted.forEach(d => {
        const employeeInfo = this.getDeclarationInData(d.data, columns);
        informations = informations.filter(info => {
            return info.employeeId + info.planCode !== employeeInfo.employeeId + employeeInfo.planCode;
          });
    });

    if(informations.length === 0) {
      informations.push({
        data: {
          origin: {},
        }
      });
    }
    this.informations = informations;
  }

  getDeclarationInData(record, columns) {
    let declaration: any = {};
    columns.map((column, index) => {
      declaration[column.key] = record[index];
    });
    return declaration;
  }

  deleteEmployeeInFamilies(declarations, declarationsDeleted) {
    const employees = this.getEmployeeInDeclarations(declarations);
    const employeeIdDeleted = [];
    declarationsDeleted.forEach(itemDeleted => {
      const item = employees.find(d => (d.origin && d.origin.employeeId) === (itemDeleted.origin && itemDeleted.origin.employeeId));
      if(item){
        return;
      }
      employeeIdDeleted.push(itemDeleted.origin.employeeId);
    });

    let families = [...this.families];
    employeeIdDeleted.forEach(id => {
      families = families.filter(fa => fa.employeeId !== id);
    });

    if(families.length === 0) {
      families.push({
        isMaster: false,
      });
    }
    this.families = families;
  }

  handlersDeleteUseOnTree(user) {

    let families = [...this.families];
    families = families.filter(fa => fa.employeeId !== user.employeeId);
    // Kiểm tra nếu danh sách nhân viên trông thì add  1 dòng
    if(families.length === 0) {
      families.push({
        isMaster: false,
      });
    }

    this.families = families;
  }

  private notificeEventValidData(tableName) {

    this.tableSubject.next({
      tableName: tableName,
      type: 'validate',
      tableEvent: this.eventValidData
    });

  }

  reformatFamilies() {
    const families = [];
    let familiescopy = [ ...this.families ];
    familiescopy.forEach(family => {
      const employeeName = family.fullName ? family.fullName : family.relationshipFullName;
        if(employeeName) {
          family.isMaster = family.origin.isMaster
          family.id = family.id ? family.id : 0;
          family.gender = family.gender ? 1: 0;

          families.push(family);
        }
    });
    return families;
  }

  handleFormChange(data) {
    this.declarations.formGenelral = data;
  }

// End Families tab

// Document list tab
reformatInformations() {
  const informations = [];
  let informationcopy = [ ...this.informations];
  informationcopy.forEach(information => {
      if(information.fullName) {
        informations.push(information);
      }
  });

  return informations;
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


private setDateToInformationList(records: any)
{
  const declarations = this.tablesToApi(records);
  const employeesInDeclaration = this.getEmployeeInDeclarations(declarations);
  const informations = [];

  employeesInDeclaration.forEach(emp => {
    emp.companyRelease = this.currentCredentials.companyInfo.name;
    const fromDate = this.getFromDate(emp.fromDate);
    const curentDate = new Date();
    const  numberFromDate = (fromDate.getMonth() + 1 + fromDate.getFullYear());
    const  numberCurentDate = (curentDate.getMonth() + 1 + curentDate.getFullYear());


    if(numberFromDate >= numberCurentDate)
    {
      return;
    }

    const documents = this.getDocumentByPlancode(emp.planCode);
    if(!documents) {
      return '';
    }

    documents.forEach(doc => {
      let item = this.informations.find(i => (i.planCode === emp.planCode && i.employeeId === emp.employeeId && i.documentCode === doc.documentCode));
      if (!item) {
        item = {
            documentNote: doc.documentNote,
            documentType: doc.documentType,
            isurranceNo: emp.isurranceNo,
            isurranceCode: emp.isurranceCode,
            fullName: emp.fullName,
            documentCode: doc.documentCode,
            planCode: emp.planCode,
            employeeId: emp.employeeId,
            isExitsIsurranceNo: emp.isExitsIsurranceNo,
            origin: {
              employeeId: emp.employeeId,
              isLeaf: true,
              planCode: emp.planCode,
              documentCode: doc.documentCode,
              isExitsIsurranceNo: emp.isExitsIsurranceNo,
            }
        };
      }
      item.isurranceNo = emp.isurranceNo,           
      item.isurranceCode = emp.isurranceCode,  
      item.companyRelease = item.companyRelease ? item.companyRelease : this.buildMessgaeByConfig(doc.companyRelease,emp);
      item.dateRelease = item.dateRelease ? item.dateRelease : this.buildMessgaeByConfig(doc.dateRelease,emp);
      item.documentNo = this.buildMessgaeByConfig(doc.documentNo,emp);
      item.documentAppraisal = this.buildMessgaeByConfig(doc.documentAppraisal,emp);
      item.isurranceNo = emp.isurranceNo;
      item.isurranceCode = emp.isurranceCode;
      item.fullName = emp.fullName;
      item.isExitsIsurranceNo = emp.isExitsIsurranceNo;
      item.origin.isExitsIsurranceNo = emp.isExitsIsurranceNo;
      informations.push(item);
    });

    informations.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.data.origin = p.origin;
    });

  });


  this.informations = this.fomatInfomation(informations);
  }

  fomatInfomation(infomations) {
    let infomationscopy = [ ...infomations ];
    infomationscopy.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.origin = {
        employeeId: p.employeeId,
        isExitsIsurranceNo: p.isExitsIsurranceNo,
        isLeaf: true,
      }
    });

    const itemPerPage = 10 - infomationscopy.length;
    let numberItem = 5;
    if(itemPerPage > 0) {
      numberItem = itemPerPage;
    }

    for (let index = 0; index < numberItem; index++) {
      infomationscopy.push({
        data: [index + 1],
        origin: {
          employeeId: '',
          isExitsIsurranceNo: false,
          isLeaf: true,
        }
      });
    }

    return infomationscopy;
  }

  private loadDefaultInformations() {
    const dataFake = [];
    for (let index = 0; index < 10; index++) {
      dataFake.push({
        data: [index + 1],
        origin: {
          employeeId: '',
		  isExitsIsurranceNo: true,
          isLeaf: true,
        }
      });
    }
    return dataFake;
  }

  fomatFamilies(families) {

    if(!families) {
      return [];
    }

    let familiesFomat = [];
    families.forEach(p => {
      p.conditionValid = p.relationshipFullName ? p.relationshipFullName : p.fullName;
      p.data = this.tableHeaderColumnsFamilies.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });

      p.data.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
        isMaster: p.isMaster,
      };

      p.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
        isMaster: p.isMaster,
      };

      familiesFomat.push(p);
      const containMember = families.findIndex(e => (!e.isMaster && e.employeeId  === p.employeeId)) > -1;
      if(!containMember) {
        familiesFomat.push(this.fakeEmployeeInFamilies(p));
        familiesFomat.push(this.fakeEmployeeInFamilies(p));
      }

    });

    return familiesFomat;

  }

  handleChangeInfomation({ records, columns }) {

    //update informations
    this.informations.forEach((d: any, index) => {
      const record = records[index];
      //update data on Jexcel
      Object.keys(record).forEach(index => {
        d.data[index] = record[index];
      });
      //update data object source
      columns.map((column, index) => {
        d[column.key] = record[index];
      });

    });

    this.notificeEventValidData('documentList');
  }

  private handleAddDocumentRow({ rowNumber, numOfRows, beforeRowIndex, afterRowIndex, insertBefore }) { 
    const informations = [ ...this.informations ];
    let row: any = {};
    const data: any = [];
    row.data = data;
    row.isMaster = false;
    row.isExitsIsurranceNo = false;
    row.origin = {
      isLeaf: true,
      isExitsIsurranceNo: false,
    };

    informations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.informations  = this.fomatInfomation(informations);
    this.notificeEventValidData('documentList');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteInfomation({ rowNumber, numOfRows }) {
    const infomations = [ ...this.informations ];

    const infomaionDeleted = infomations.splice(rowNumber, numOfRows);
    this.informations = this.fomatInfomation(infomations);
    this.notificeEventValidData('documentList');
    eventEmitter.emit('unsaved-changed');
  }

  handleChangedFiles(files) {
    this.declarations.files = files;
  }


  private getFromDate(dateMonthYear) {
    const fullDate = '01/' + dateMonthYear;
    if(!moment(fullDate,"DD/MM/YYYY")) {
      return new Date();
    }
    return moment(fullDate,"DD/MM/YYYY").toDate();
  }
// End Document list Tab

  validDocumentForm() {
      const formError: any[] = [];
      if(this.documentForm.controls.submitter.errors) {
        formError.push({
          y: 'Người nộp',
          columnName: 'Kiểm tra lại trường người nộp',
          prefix: '',
          subfix: 'Lỗi'
        });
      }

      if(this.documentForm.controls.mobile.errors) {
        formError.push({
          y: 'Số điện thoại',
          columnName: 'Kiểm tra lại trường số điện thoại',
          prefix: '',
          subfix: 'Lỗi'
        });
      }

      return formError;
  }

 private buildMessgaeByConfig(objConfig, employeeInfo) {
    const argsColumn = objConfig.column || [] ;
    const mesage = objConfig.mesage || '' ;
    const argsMessgae = [];
    argsColumn.forEach(column => {
      argsMessgae.push(employeeInfo[column]);
    });

    return this.formatNote(mesage, argsMessgae);;
  }

  protected formatNote(str, args) {
    for (let i = 0; i < args.length; i++)
       str = str.replace("{" + i + "}", args[i]);
    return str;
  }

  private getFileByDeclarationCode(code) {
     console.log(this.files);
  }

  handleCheckIsuranceNo(event) {
    this.isCheckIsuranceCode = true;
  }

  protected isHasLeaf(tableName) {    
    const declarations = [ ...this.declarations.tables[tableName] ];
    const declarationHasUser = [];
    declarations.forEach(d => {
        d.declarations.forEach(i => {
          declarationHasUser.push(i);
        });
    });
    const declarationUsers = declarationHasUser.filter(d => {
      return d.origin && (d.origin.employeeId || d.employeeId) > 0 && d.isExitsIsurranceNo;
    });

    return declarationUsers.length > 0;
  }

}
