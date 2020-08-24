import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, AuthenticationService } from '@app/core/services';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { log } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX, DECLARATIONS } from '@app/shared/constant';
import * as _ from 'lodash';


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
  declarationCode: string = '604'
  declarationName: string = ''
  currentCredentials: any;
  documentForm: FormGroup;
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };

  checkOptionsOne = [
    {
      value: "T",
      label: "Hàng tháng",
      checked: false
    },
    {
      value: "Q",
      label: "Hàng quý",
      checked: false
    },
    {
      value: "6T",
      label: "6 tháng",
      checked: false
    }
  ]

  constructor(
    protected declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {

    const date = new Date();
    this.declarationName = this.getDeclaration(this.declarationCode).value;
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      number: ['1'],
      month: [date.getMonth() + 1],
      year: [date.getFullYear()]
    });

    this.companyForm = this.formBuilder.group({
      cityId: ['', Validators.required],
      isurranceDepartmentId: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreaId: ['', Validators.required],
      name: ['', Validators.required],
      addressRegister: ['', Validators.required],
      address: ['', Validators.required],
      companyCode: ['', Validators.required],
      taxCode: ['', Validators.required],
      delegate: ['', Validators.required],
      traders: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      emailOfContract: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      paymentMethodId: ['', Validators.required],
      responseResults: ['1', Validators.required],
      groupCompanyCode: ['', Validators.required],
      submissionType: ['0', Validators.required],
      districtId: ['', Validators.required],
      wardsId: ['', Validators.required],
      object: ['', Validators.required],
      companyName: ['CÔNG TY TNHH HÓA ĐƠN ĐIỆN TỬ M-INVOICE - CHI NHÁNH HÀ NỘI'],
      subject: ['Bảo hiểm xã hội quận Hà Đông', Validators.required],
      career: ['', Validators.required],
      license: ['', Validators.required],
      noteChange: ['', Validators.required],
      documentFile: [''],
      issued: ['', Validators.required],
      methodPayother: [null, Validators.required]
    });

    this.documentForm = this.formBuilder.group({
      userAction: [this.currentCredentials.companyInfo.delegate],
      mobile: [this.currentCredentials.companyInfo.mobile],
      usedocumentDT01: [true],
    });

  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleSelectTab(index) {
    eventEmitter.emit('increase-labor:tab:change', index);
  }

  public validateControl = (controlName: string) => {
    if (this.companyForm.controls[controlName].invalid && this.companyForm.controls[controlName].touched)
      return true;

    return false;
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
  }

  public hasError = (controlName: string, errorName: string) => {
    if (this.companyForm.controls[controlName].hasError(errorName))
      return true;

    return false;
  }

  emitEventToChild(action) {
  }


  ngOnChanges(changes) {
  }

  ngOnDestroy() {
  }
}
