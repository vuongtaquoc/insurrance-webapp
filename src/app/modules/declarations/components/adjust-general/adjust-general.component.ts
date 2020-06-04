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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
    private modalService: NzModalService,
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
    console.log(this.declarations,'ddđd');
     this.declarations[tableName] = this.declarations[tableName] || {};
     this.declarations[tableName] = data.data;
     console.log(this.declarations[tableName]);
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
}
