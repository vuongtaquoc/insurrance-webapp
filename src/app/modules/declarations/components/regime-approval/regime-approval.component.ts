import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DeclarationService } from '@app/core/services';

import { eventEmitter } from '@app/shared/utils/event-emitter';

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
  isHiddenSidebar: boolean;
  selectedTabIndex: number = 1;

  constructor(
    private router: Router,
    private declarationService: DeclarationService
  ) {
  }

  ngOnInit() {
    this.declarationService.getDeclarationInitialsByGroup('630').subscribe(data => {
      this.regimeApproval.origin = data;
    });
  }

  save(type) {
    this.declarationService.create({
      type: type,
      documentType: 630,
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
