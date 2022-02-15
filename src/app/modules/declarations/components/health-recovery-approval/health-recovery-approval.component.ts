import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeclarationService, AuthenticationService, DocumentListService, DeclarationConfigService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';

import { DocumentFormComponent, DeclarationErrorComponent } from '@app/shared/components';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { DocumentList } from '@app/core/models';
import { DATE_FORMAT } from '@app/shared/constant';

import { TableEditorErrorsComponent } from '@app/shared/components';
import { REGEX } from '@app/shared/constant';

@Component({
  selector: 'app-health-recovery-approval',
  templateUrl: './health-recovery-approval.component.html',
  styleUrls: ['./health-recovery-approval.component.less']
})
export class HealthRecoveryApprovalComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  regimeApproval: any = {
    origin: {},
    form: {},
    formOrigin: {},
    tables: {}
  };

  declarationCode: string = '630c';
  declarationName: string = '';
  autoCreateDocumentList: boolean;
  autoCreateFamilies: boolean;
  isHiddenSidebar: boolean;
  selectedTabIndex: number = 1;
  documentList: DocumentList[] = [];
  documentForm: FormGroup;
  handler: any;
  isTableValid = false;
  formError: any[] = [];
  tableErrors = {};
  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  isValid: any = {};
  allInitialize: any = {};
  dataIsValid = true;
  status = 0;
  isSpinning = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
    private declarationConfigService: DeclarationConfigService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.loadDeclarationConfig();
    this.documentForm = this.formBuilder.group({
      submitter: ['', Validators.required],
      mobile: ['',  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
    });

    if (this.declarationId) {
      this.declarationService.getDeclarationsByDocumentIdByGroup(this.declarationId).subscribe(declarations => {
        this.documentForm.patchValue({
          submitter: declarations.submitter,
          mobile: declarations.mobile
        });
        this.regimeApproval.origin = declarations.documentDetail;
        this.status = declarations.status;
        this.regimeApproval.formOrigin = {
          batch: declarations.batch,
          month: declarations.month,
          year: declarations.year,
          openAddress: declarations.openAddress,
          branch: declarations.branch,
          typeDocumentActtach: declarations.typeDocumentActtach,
          reason: declarations.reason,
        };
      });
    } else {
      this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
        this.regimeApproval.origin = data;
      });

      this.declarationService.getHeaderDeclaration(this.declarationCode).subscribe(data => {
        this.regimeApproval.formOrigin = {
          batch: data.batch,
          month: data.month,
          quarter: data.quarter,
          year: data.year,
          openAddress: '',
          branch: '',
          typeDocumentActtach: '',
          reason: '',
        };
      });

      const currentCredentials = this.authenticationService.currentCredentials;
      this.documentForm.patchValue({
        submitter: currentCredentials.companyInfo.delegate,
        mobile: currentCredentials.companyInfo.mobile
      });
    }

    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });

    this.handler = eventEmitter.on('regime-approval:validate', ({ name, isValid, leaf, initialize, errors }) => {
      this.allInitialize[name] = leaf.length === initialize.length;
      this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
      this.tableErrors[name] = errors;
    });
  }

  ngOnDestroy() {
    this.handler();
  }

  rollback() {
    this.router.navigate(['/declarations/health-recovery-approval']);
  }

  private loadDeclarationConfig() {
    this.declarationConfigService.getDetailByCode(this.declarationCode).subscribe(data => {
       this.declarationName = data.declarationName;
       this.autoCreateDocumentList = data.autoCreateDocumentList;
       this.autoCreateFamilies = data.autoCreateFamilies;
    });
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

    this.dataIsValid = this.invalidData();
    if (this.dataIsValid) {

      this.tableSubmitErrors = Object.keys(this.tableErrors).reduce(
        (combine, key) => {
          const data = this.tableErrors[key];

          return {...combine, [key]: data.length};
        },
        {}
      );

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

    eventEmitter.emit('unsaved-changed', true);
    if (this.declarationId) {
      this.update('saveAndView');
    } else {
      this.create('saveAndView');
    }
  }

  invalidData() { 

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

    this.tableSubmitErrorCount = count;
    return count > 0;
  }

  save() {

    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }

    eventEmitter.emit('unsaved-changed', true);
    this.dataIsValid = this.invalidData();
    if (this.declarationId) {
      this.update('save');
    } else {
      this.create('save');
    }
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
      ...this.regimeApproval.form,
      documentDetail: this.tablesToApi(this.regimeApproval.tables),
      informations: []
    }).subscribe(data => {
      this.isSpinning = false;
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/health-recovery-approval']);
      }
    });
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
      ...this.regimeApproval.form,
      documentDetail: this.tablesToApi(this.regimeApproval.tables),
      informations: []
    }).subscribe(data => {
      this.isSpinning = false;
      if (data.type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/health-recovery-approval']);
      }
    });
  }

  private getStatus(type) {
    if (this.dataIsValid) {
      return 0;
    }

    if (this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }
  
  handleSelectTab({ index }) {
    this.selectedTabIndex = index;
    eventEmitter.emit('regime-approval:tab:change', index);
  }
   
  handleTableChange(data, type) {
    this.regimeApproval.tables[type] = this.regimeApproval.tables[type] || {};
    this.regimeApproval.tables[type][data.part] = data.data;
  }

  handleFormValuesChanged(data) {
    this.regimeApproval.form = data;
  }

  handleHiddenSidebar(isHidden) {
    this.isHiddenSidebar = isHidden;
  }

  private tablesToApi(tables) {
    const data = [];

    Object.keys(tables).forEach(key => {
      const table = tables[key];

      Object.keys(table).forEach(partKey => {
        const part = table[partKey];

        data.push(...part);
      });
    });

    return data;
  }

  get submitter() {
    return this.documentForm.get('submitter').value;
  }

  get mobile() {
    return this.documentForm.get('mobile').value;
  }

  viewDocument(declarationInfo: any) {
    if (declarationInfo.isError) {
      this.showDialogDeclarationErrror(declarationInfo);
    } else {
      this.showDialogDeclarationResult(declarationInfo);
    }
  }

  private showDialogDeclarationResult(declarationInfo: any) {
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

  private showDialogDeclarationErrror(declarationInfo: any) {

    const resultError = declarationInfo.resultError;

    const modal = this.modalService.create({
      nzWidth: 980,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Lỗi dữ liệu tờ khai',
      nzContent: DeclarationErrorComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        resultError
      }
    });

    modal.afterClose.subscribe(result => {
    });
  }

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

  handleValidForm(data) {
    this.formError = data.errorMessage;
  }

  handleTrimValue(key) {
    const value = this.documentForm.value[key] || '';

    this.documentForm.patchValue({
      [key]: value.trim()
    });
  }

}
