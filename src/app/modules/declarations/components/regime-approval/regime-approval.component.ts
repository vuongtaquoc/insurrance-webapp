import { Component, OnInit } from '@angular/core';
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
    this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
      this.regimeApproval.origin = data;
    });

    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });
    const currentCredentials = this.authenticationService.currentCredentials;
    this.documentForm = this.formBuilder.group({
      userAction: [currentCredentials.companyInfo.delegate],
      mobile:[currentCredentials.companyInfo.mobile],
    });

  }

  save(type) {
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
}
