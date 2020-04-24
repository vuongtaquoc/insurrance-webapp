import { Component, OnInit } from '@angular/core';

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
    tables: []
  };
  isHiddenSidebar: boolean;
  selectedTabIndex: number = 1;

  constructor(
    private declarationService: DeclarationService
  ) {
  }

  ngOnInit() {
    this.declarationService.getDeclarationInitialsByGroup('630').subscribe(data => {
      this.regimeApproval.origin = data;
    });
  }

  handleSelectTab({ index }) {
    this.selectedTabIndex = index;
    eventEmitter.emit('regime-approval:tab:change', index);
  }

  handleTableChange(data, type) {
    console.log(data, type)
  }

  handleFormValuesChanged(data) {
    this.regimeApproval.form = data;
  }

  handleHiddenSidebar(isHidden) {
    this.isHiddenSidebar = isHidden;
  }
}
