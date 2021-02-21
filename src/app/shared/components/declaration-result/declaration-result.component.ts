import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ExternalService, AuthenticationService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE, schemaSign } from '@app/shared/constant';

@Component({
  selector: 'app-declaration-result',
  templateUrl: './declaration-result.component.html',
  styleUrls: ['./declaration-result.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationResultComponent implements OnInit {
  @Input() declarationFileInfo: any;
  resultDetail: any = [];
  resultHeader: any = [];
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private externalService: ExternalService,
    private modalService: NzModalService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.getResult();
    this.getDetailInResult();
  }

  getDetailInResult() {
      this.declarationFileInfo.resultResearch.detail.forEach((data) => {
        if(data.step === '0') return;
        data.historyProcessDeclarations.forEach((item) => {
          this.resultDetail.push( {
            step: data.step,
            department: data.department,
            action: item.action,
            employeeHandler: item.employeeHandler,
            timeProcess: item.timeProcess,
            actualReceiptDate: data.actualReceiptDate,
            actualResponseDate: data.actualResponseDate,
          });
        });
      });
  }

  getResult() {
    this.declarationFileInfo.resultResearch.detail.forEach((data) => { 
      if(data.step === '0') {
        this.resultHeader.push(data);
      }
    });
  }
  
  dismiss(): void {
    this.modal.destroy();
  }
}
