import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeclarationService, AuthenticationService, DocumentListService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as _ from 'lodash';

import { DocumentFormComponent } from '@app/shared/components';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { DocumentList } from '@app/core/models';
import { DATE_FORMAT, DECLARATIONS } from '@app/shared/constant';

import { TableEditorErrorsComponent } from '@app/shared/components';

@Component({
  selector: 'app-regime-approval',
  templateUrl: './regime-approval.component.html',
  styleUrls: ['./regime-approval.component.less']
})
export class RegimeApprovalComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  regimeApproval: any = {
    origin: {},
    form: {},
    formOrigin: {},
    tables: {}
  };
  declarationCode: string = '630';
  isHiddenSidebar: boolean;
  selectedTabIndex: number = 1;
  documentList: DocumentList[] = [];
  documentForm: FormGroup;
  handler: any;
  isTableValid = false;
  tableErrors = {};
  isValid: any = {};
  allInitialize: any = {};

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
      mobile: ['']
    });

    if (this.declarationId) {
      this.declarationService.getDeclarationsByDocumentIdByGroup(this.declarationId).subscribe(declarations => {
        this.documentForm.patchValue({
          submitter: declarations.submitter,
          mobile: declarations.mobile
        });
        this.regimeApproval.origin = declarations.documentDetail;
        this.regimeApproval.formOrigin = {
          batch: declarations.batch,
          openAddress: declarations.openAddress,
          branch: declarations.branch,
          typeDocumentActtach: declarations.typeDocumentActtach,
          reason: declarations.reason
        };
      });
    } else {
      this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
        this.regimeApproval.origin = data;
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
      // this.isValid[name] = isValid;
      this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
      this.tableErrors[name] = errors;
    });
  }

  ngOnDestroy() {
    this.handler();
  }

  save(type) {
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

    if (type === 'rollback') {
      this.router.navigate(['/declarations/regime-approval']);
    } else  {
      if (this.declarationId) {
        this.update(type);
      } else {
        this.create(type);
      }
    }
  }

  private update(type: any) {
    this.declarationService.update(this.declarationId, {
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.regimeApproval.form,
      documentDetail: this.tablesToApi(this.regimeApproval.tables),
      informations: []
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/regime-approval']);
      }
    });
  }

  private create(type: any) {
    this.declarationService.create({
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.regimeApproval.form,
      documentDetail: this.tablesToApi(this.regimeApproval.tables),
      informations: []
    }).subscribe(data => {
      if (data.type === 'saveAndView') {
        this.viewDocument(data);
      } else if(data.type === 'save') {
        this.router.navigate(['/declarations/regime-approval']);
      }
    });
  }

  handleSelectTab({ index }) {
    this.selectedTabIndex = index;
    eventEmitter.emit('regime-approval:tab:change', index);
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
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
}
