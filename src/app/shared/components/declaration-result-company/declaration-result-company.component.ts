import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ExternalService, AuthenticationService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE } from '@app/shared/constant';

@Component({
  selector: 'app-declaration-result-company',
  templateUrl: './declaration-result-company.component.html',
  styleUrls: ['./declaration-result-company.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationResultOfCompanyComponent implements OnInit {
  @Input() declarationFileInfo: any;
  resultsProcess: any[] = [];
  categoryCode?: string;
  categoryName?: string;
  createdDate?: string;
  documentForm: FormGroup;
  authenticationToken: string;
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private externalService: ExternalService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.getStepOfProcess();    
  }

  private getStepOfProcess() {

    this.resultsProcess.push({
      step: 1,
      ...this.declarationFileInfo.resultDetail.stepOne
    });
    this.resultsProcess.push({
      step: 2,
      ...this.declarationFileInfo.resultDetail.stepTwo
    });
    this.resultsProcess.push({
      step: 3,
      ...this.declarationFileInfo.resultDetail.stepThree
    });
    
  }

  dismiss(): void {
    this.modal.destroy();
  }
  
}
