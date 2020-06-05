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

import { TableEditorErrorsComponent } from '@app/shared/components';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';

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
  selectedTabIndex: number = 1; 
  handler: any;
  isTableValid = false;
  tableErrors = {};
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  totalNumberInsurance: any;
  totalCardInsurance: any;
  allInitialize: any = {};
  declarations: any = {
    origin: {},
    form: {},
    formOrigin: {},
    tables: {}
  };
  families: any[] = [];
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  familiesSubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
    private modalService: NzModalService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      submitter: [''],
      mobile: [''],
      usedocumentDT01:[false],
    });

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
      });
    } else {
      this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
        this.declarations.origin = data;
      });
      const currentCredentials = this.authenticationService.currentCredentials;
      this.documentForm.patchValue({
        submitter: currentCredentials.companyInfo.delegate,
        mobile: currentCredentials.companyInfo.mobile
      });
    }

    this.handler = eventEmitter.on('regime-approval:validate', ({ name, isValid, leaf, initialize, errors }) => {
      this.allInitialize[name] = leaf.length === initialize.length;
      // this.isValid[name] = isValid;
      this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
      this.tableErrors[name] = errors;
    });
  }

  ngOnDestroy() {
    this.handler();
  }

  handleChangeTable(data, tableName) {
     this.declarations[tableName] = this.declarations[tableName] || {};
     this.declarations[tableName] = data.data;
  }
   
  handleSubmit(event) {
    const { number, month, year } = this.form.value;

    this.onSubmit.emit({
      type: event.type,
      declarationCode: this.declarationCode,
      //declarationName: this.getDeclaration(this.declarationCode).value,
      documentNo: number,
      createDate: `01/0${ month }/${ year }`,
      documentStatus: 0,
      totalNumberInsurance: this.totalNumberInsurance,
      totalCardInsurance: this.totalCardInsurance,
      documentDetail: event.data,
    });
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

  //Families tab
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
  }

  handleChangeDataFamilies({ instance, cell, c, r, records, columns }) {
    // if (c !== null && c !== undefined) {
    //   c = Number(c);
    //   const column = this.tableHeaderColumnsFamilies[c];
    //   if (column.key === 'isMaster') {
    //     const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);

    //     if(employeeIsMaster === true) {

    //       this.employeeService.getEmployeeById(records[r].origin.employeeId).subscribe(emp => {
    //         this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
    //         this.updateNextColumns(instance, r, emp.relationshipMobile, [ c + 2]);
    //         this.updateNextColumns(instance, r, emp.relationshipDocumentType, [ c + 3]);
    //         this.updateNextColumns(instance, r, emp.relationshipBookNo, [ c + 4]);
    //         this.updateNextColumns(instance, r, emp.recipientsCityCode, [ c + 5]);
    //         this.updateNextColumns(instance, r, emp.recipientsDistrictCode, [ c + 6]);
    //         this.updateNextColumns(instance, r, emp.recipientsWardsCode, [ c + 7]);
    //         this.updateNextColumns(instance, r, emp.fullName, [ c + 10]);
    //         this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 11]);
    //         this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 12]);
    //         this.updateNextColumns(instance, r, emp.birthday, [ c + 13]);
    //         this.updateNextColumns(instance, r, emp.gender, [ c + 14]);
    //         this.updateNextColumns(instance, r, emp.relationshipCityCode, [ c + 16]);
    //         this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 17]);
    //         this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 18]);
    //         this.updateNextColumns(instance, r, '00', [21]);
    //         this.updateNextColumns(instance, r, emp.identityCar, [c + 20]);
    //         this.updateSelectedValueDropDown(columns, instance, r);
    //       });

    //     }else {
    //       this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
    //       c + 10, c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17]);

    //       const value = instance.jexcel.getValueFromCoords(1, r);
    //       const numberColumn = this.tableHeaderColumnsFamilies.length;
    //       this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
    //     }

    //   }

    //   if (column.key === 'sameAddress') {
    //     const isSameAddress = instance.jexcel.getValueFromCoords(c, r);

    //     if(isSameAddress === true)
    //     {
    //       this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(7, r), [ c + 1]);
    //       this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(8, r), [ c + 2]);
    //       this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(9, r), [ c + 3]);
    //       this.updateSelectedValueDropDown(columns, instance, r);

    //     } else {
    //       this.updateNextColumns(instance, r, '', [ c + 1]);
    //       this.updateNextColumns(instance, r, '', [ c + 2]);
    //       this.updateNextColumns(instance, r, '', [ c + 3]);
    //     }
    //   }

    //   if (column.willBeValid) {
    //     const value = instance.jexcel.getValueFromCoords(c, r);
    //     const numberColumn = this.tableHeaderColumnsFamilies.length;
    //     this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
    //   }
    //}
    //update families
    // this.families.forEach((family: any, index) => {
    //   const record = records[index];
    //   //update data on Jexcel
    //   Object.keys(record).forEach(index => {
    //     family.data[index] = record[index];
    //   });
    //   //update data object source
    //   columns.map((column, index) => {
    //       family[column.key] = record[index];
    //   });

    // });
  }

  private updateNextColumns(instance, r, value, nextColumns = []) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
      instance.jexcel.setValue(columnName, value);
    });
  }

  private updateSelectedValueDropDown(columns, instance, r) {

    columns.forEach((column, colIndex) => {
      if (column.defaultLoad) {
        instance.jexcel.updateDropdownValue(colIndex, r);
      }
    });
  }
  //End Families tab
}
