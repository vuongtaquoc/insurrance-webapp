import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeclarationService, AuthenticationService, DocumentListService } from '@app/core/services';

import { eventEmitter } from '@app/shared/utils/event-emitter';
import { DocumentList } from '@app/core/models';
@Component({
  selector: 'app-regime-approval',
  templateUrl: './regime-approval.component.html',
  styleUrls: ['./regime-approval.component.less']
})
export class RegimeApprovalComponent implements OnInit {
  @Input() declarationId: string;
  regimeApproval: any = {
    origin: {},
    form: {},
    tables: {}
  };
  declarationCode: string = '630';
  isHiddenSidebar: boolean;
  selectedTabIndex: number = 1;
  documentList: DocumentList[] = [];
  documentForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
  ) {
  }

  ngOnInit() {
    if (this.declarationId) {
      this.declarationService.getDeclarationsByDocumentIdByGroup(this.declarationId).subscribe(declarations => {
        this.documentForm = this.formBuilder.group({
          submitter: declarations.submitter,
          mobile:declarations.mobile,
        });
        this.regimeApproval.origin = declarations.documentDetail;
      });
    } else {
      this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
        this.regimeApproval.origin = data;
      });
      const currentCredentials = this.authenticationService.currentCredentials;
      this.documentForm = this.formBuilder.group({
        submitter: [currentCredentials.companyInfo.delegate],
        mobile:[currentCredentials.companyInfo.mobile],
      });
    }

    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });   

  }

  save(type) {
    if (this.declarationId) {
      this.declarationService.update(this.declarationId, {
        type: type,
        documentType: this.declarationCode,
        documentStatus: 0,
        submitter: this.submitter,
        mobile: this.mobile,
        ...this.regimeApproval.form,
        documentDetail: this.tablesToApi(this.regimeApproval.tables),
        informations: []
      }).subscribe(data => {
        this.router.navigate(['/declarations/regime-approval']);
      });
    } else {
      this.declarationService.create({
        type: type,
        documentType: this.declarationCode,
        documentStatus: 0,
        ...this.regimeApproval.form,
        documentDetail: this.tablesToApi(this.regimeApproval.tables),
        informations: []
      }).subscribe(data => {
        this.router.navigate(['/declarations/regime-approval']);
      });
    }
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
}
