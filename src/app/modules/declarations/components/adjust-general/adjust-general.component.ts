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

    this.handler = eventEmitter.on('adjust-general:validate', ({ name, isValid, leaf, initialize, errors }) => {
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
    this.declarations.tables[tableName] = this.declarations[tableName] || {};
    this.declarations.tables[data.tableName]= data.data;
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
    console.log(this.tablesToApi(this.declarations.tables));
    let count = Object.keys(this.tableErrors).reduce(
      (total, key) => {
        const data = this.tableErrors[key];
        return total + data.length;
      },
      0
    );

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
    console.log('OK');
    if (this.declarationId) {
      this.update(type);
    } else {
      this.create(type);
    }
    
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
      informations: []
    }).subscribe(data => {
      if (data.type === 'saveAndView') {
        //this.viewDocument(data);
      } else if(data.type === 'save') {
        this.router.navigate(['/declarations/adjust-general']);
      }
    });
  }

  private update(type: any) {
    this.declarationService.update(this.declarationId, {
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: []
    }).subscribe(data => {
      if (type === 'saveAndView') {
        //this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/adjust-general']);
      }
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
}