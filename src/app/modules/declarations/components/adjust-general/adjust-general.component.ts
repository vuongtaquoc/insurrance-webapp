import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';
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
} from '@app/core/services';
import { DATE_FORMAT, DECLARATIONS, DOCUMENTBYPLANCODE, ACTION } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TableEditorErrorsComponent } from '@app/shared/components';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';

import { Router } from '@angular/router';
@Component({
  selector: 'app-adjust-general',
  templateUrl: './adjust-general.component.html',
  styleUrls: [ './adjust-general.component.less' ]
})
export class AdjustGeneralComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  documentList: DocumentList[] = [];
  isHiddenSidebar = false;
  declarationCode: string = '601';  
  declarationName: string;  
  selectedTabIndex: number = 1; 
  eventValidData = 'adjust-general:validate';
  handler: any;
  isTableValid = false;
  tableErrors = {};
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
    tables: {}
  };

  families: any[] = [];
  informations: any[] = [];
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  tableSubject: Subject<any> = new Subject<any>();


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
    private villageService: VillageService
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
      mobile: ['', Validators.required],
    });
    
    this.declarationName = this.getDeclaration(this.declarationCode).value;
    //Init data families table editor
    forkJoin([
      this.cityService.getCities(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships()
    ]).subscribe(([cities, relationshipDocumentTypies, relationShips ]) => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'cityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipDocumentType', relationshipDocumentTypies);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', relationShips);

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
          this.declarations.formOrigin = {
            batch: declarations.batch,
            openAddress: declarations.openAddress,
            branch: declarations.branch,
            typeDocumentActtach: declarations.typeDocumentActtach,
            reason: declarations.reason
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
        
        this.documentForm.patchValue({
          submitter: this.currentCredentials.companyInfo.delegate,
          mobile: this.currentCredentials.companyInfo.mobile
        });

        this.declarationGeneral = {
          totalNumberInsurance: '2',
          totalCardInsurance: '2'
        };
      }

      this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
        this.documentList = documentList;
      });

      this.handler = eventEmitter.on(this.eventValidData, ({ name, isValid, leaf, initialize, errors }) => {
        this.allInitialize[name] = leaf.length === initialize.length;
        this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
        this.tableErrors[name] = errors;
      });
    });
  }

  ngOnDestroy() {
    this.handler();
  }

  handleChangeTable(data, tableName) {
    this.declarations.tables[tableName] = this.declarations[tableName] || {};
    this.declarations.tables[data.tableName]= data.data;

    if (data.action === ACTION.EDIT) {
      this.setDateToInformationList(this.declarations.tables);
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
  }

  handleHiddenSidebar(isHidden) {
    this.isHiddenSidebar = isHidden;
  }

  save(type) {

    if (type === 'rollback') {
      this.router.navigate(['/declarations/adjust-general']);
      return '';
    }
    let count = Object.keys(this.tableErrors).reduce(
      (total, key) => {
        const data = this.tableErrors[key];
        return total + data.length;
      },
      0
    );
    console.log(this.tableErrors);
    if (count > 0) {
      return this.modalService.error({
        nzTitle: 'Lỗi dữ liệu. Vui lòng sửa!',
        nzContent: TableEditorErrorsComponent,
        nzComponentParams: {
          errors: Object.keys(this.tableErrors).reduce(
            (combine, key) => {
              if (this.tableErrors[key].length) {
                return { ...combine, [key]: this.tableErrors[key] };
              }

              return { ...combine };
            },
            {}
          )
        }
      });
    }
    // if (this.declarationId) {
    //   this.update(type);
    // } else {
    //   this.create(type);
    // }

  }

  private create(type: any) {
    this.declarationService.create({
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: [],
      families: this.reformatFamilies()
    }).subscribe(data => {
      if (data.type === 'saveAndView') {
        this.viewDocument(data);
      } else if(data.type === 'save') {
        this.router.navigate(['/declarations/adjust-general']);
      }
    });
  }

  private update(type: any) {
    this.declarationService.update(this.declarationId, {
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: []
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/adjust-general']);
      }
    });
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

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
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
          this.updateNextColumns(instance, r, emp.recipientsCityCode, [ c + 5]);
          this.updateNextColumns(instance, r, emp.recipientsDistrictCode, [ c + 6]);
          this.updateNextColumns(instance, r, emp.recipientsWardsCode, [ c + 7]);
          this.updateNextColumns(instance, r, emp.fullName, [ c + 10]);
          this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 11]);
          this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 12]);
          this.updateNextColumns(instance, r, emp.birthday, [ c + 13]);
          this.updateNextColumns(instance, r, emp.gender, [ c + 14]);
          this.updateNextColumns(instance, r, emp.relationshipCityCode, [ c + 16]);
          this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 17]);
          this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 18]);
          this.updateNextColumns(instance, r, '00', [21]);
          this.updateNextColumns(instance, r, emp.identityCar, [c + 20]);
          this.updateSelectedValueDropDown(columns, instance, r);
        });

      }else {
        this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
        c + 10, c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17]);

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
        };

        declaration.conditionValid = declaration.relationshipFullName;
        employeesInDeclaration.push(declaration);
      }
    });

  });
  return employeesInDeclaration;
}

private setDataToFamilyEditor(records: any)
  {
    const families = [];
    const employees = [];
    const employeesId = [];
    const employeesInDeclaration = this.getEmployeeInDeclarations(records);
    employeesInDeclaration.forEach(emp => {

      const empId = employeesId.find(c => c === emp.employeeId);
      if(empId) {
        return;
      }

      employeesId.push(empId);

      const family = this.families.find(p => p.employeeId === emp.employeeId);

        if (!family) {

          const isContainsEmployee = employees.find(p => p.employeeId === emp.employeeId);
          if(!isContainsEmployee)
          {
            employees.push(emp);
          }

        }else {

          const currentFamilies = this.families.filter(fm => fm.employeeId === emp.employeeId);
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
        master.conditionValid = ep.relationshipFullName ? ep.relationshipFullName : ep.fullName;
        master.origin = {
          employeeId: ep.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        families.push(master);

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
            families.push(fa);
          });
        }else {
          // nếu chưa có thông tin của gia đình thì add dòng trống
          families.push(this.fakeEmployeeInFamilies(ep));
          families.push(this.fakeEmployeeInFamilies(ep));
        }

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
      conditionValid: null, //employee.relationshipFullName,
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

  deleteEmployeeInFamilies(declarations ,declarationsDeleted) {
    const employees = this.getEmployeeInDeclarations(declarations);
    const employeeIdDeleted = [];
    declarationsDeleted.forEach(itemDeleted => {
      const item = employeeIdDeleted.find(d => (d.origin && d.origin.employeeId) === (itemDeleted.origin && itemDeleted.origin.employeeId));

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
        if(family.fullName) {
          family.isMaster = family.origin.isMaster
          family.id = family.id ? family.id : 0;
          family.gender = family.gender ? 1: 0;

          families.push(family);
        }
    });

    return families;
  }

  handleFormChange(data) {
    console.log(data,'FORM');
  }

// End Families tab

// Document list tab 

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
    
    const fromDate = this.getFromDate(emp.fromDate);
    const curentDate = new Date();
    const  numberFromDate = (fromDate.getMonth() + 1 + fromDate.getFullYear());
    const  numberCurentDate = (curentDate.getMonth() + 1 + curentDate.getFullYear());
    if(numberFromDate >= numberCurentDate) 
    {
      return;
    }

    const documents = this.getDocumentByPlancode(emp.planCode);
    console.log(documents,'ssssssss');

    if(!documents) {

      let item = {
        fullName: emp.fullName,
        isurranceNo: emp.isurranceNo,
        documentNo: '',
        dateRelease: '',
        isurranceCode: emp.isurranceCode,
        documentType: '',
        companyRelease: this.currentCredentials.companyInfo.name,
        documentNote: '',
        //documentAppraisal: ('Truy tăng ' + emp.fullName + ' từ ' + emp.fromDate),
        origin: {
          employeeId: emp.employeeId,
          isLeaf: true,
        }
      };
      informations.push(item);

    }else {

      documents.forEach(doc => {
        let item = {
          fullName: emp.fullName,
          isurranceNo: emp.isurranceNo,
          documentNo: '',
          dateRelease: '',
          isurranceCode: emp.isurranceCode,
          documentType: doc.documentName,
          companyRelease: this.currentCredentials.companyInfo.name,
          documentNote: doc.documentNote,
          documentAppraisal: ('Truy tăng ' + emp.fullName + ' từ ' + emp.fromDate),
          origin: {
            employeeId: emp.employeeId,
            isLeaf: true,
          }
        };
        if(doc.isContract) {
          item.documentNo = emp.contractNo;
          item.dateRelease =  emp.dateSign;
        }else {
          item.documentNo = emp.fromDate;
        }
        informations.push(item);
      });

    }

    informations.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.data.origin = p.origin;
    });

  });

  this.informations = informations;
  }

  handleChangeInfomation({ records, columns }) {

    //update families
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


  private getFromDate(dateOf) {
    const fullDate = '01/' + dateOf;
    if(!moment(fullDate,"DD/MM/YYYY")) {
      return new Date();
    }
    return moment(fullDate,"DD/MM/YYYY").toDate();
  }
// End Document list Tab
}
