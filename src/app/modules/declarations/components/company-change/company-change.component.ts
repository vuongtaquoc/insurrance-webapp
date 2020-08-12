import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, AuthenticationService } from '@app/core/services';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { log } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-company-change',
  templateUrl: './company-change.component.html',
  styleUrls: ['./company-change.component.less']
})
export class CompanyChangeComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  companyForm: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  constructor(
    protected declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {

    const date = new Date();
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      number: [ '1' ],
      month: [ date.getMonth() + 1 ],
      year: [ date.getFullYear() ]
    });

    this.companyForm = this.formBuilder.group({
      cityId: ['', Validators.required],
      isurranceDepartmentId: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreaId: ['', Validators.required],
      name: ['', Validators.required],
      addressRegister: ['', Validators.required] ,
      address: ['', Validators.required],
      taxCode: ['', Validators.required],
      delegate: ['', Validators.required],
      traders: ['', Validators.required],
      mobile: ['', Validators.required],
      emailOfContract: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      responseResults: ['1', Validators.required],
      groupCompanyCode: ['', Validators.required],
      submissionType: ['0', Validators.required],
      districtId: ['', Validators.required],
      wardsId: ['', Validators.required],
      object: ['', Validators.required]
    });

    this.documentForm = this.formBuilder.group({
      userAction: [this.currentCredentials.companyInfo.delegate],
      mobile:[this.currentCredentials.companyInfo.mobile],
      usedocumentDT01:[true],
    });

  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleSelectTab(index) {
    eventEmitter.emit('increase-labor:tab:change', index);
  }

  ngOnChanges(changes) {
  }

  ngOnDestroy() {
  }
}
