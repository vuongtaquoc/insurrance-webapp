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
import { DeclarationResultDetailComponent } from '@app/shared/components';

@Component({
  selector: 'app-declaration-result',
  templateUrl: './declaration-result.component.html',
  styleUrls: ['./declaration-result.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationResultComponent implements OnInit {
  @Input() declarationFileInfo: any;
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private externalService: ExternalService,
    private modalService: NzModalService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    
  }

  dismiss(): void {
    this.modal.destroy();
  }

  viewDetail(declarationInfo) {
    const modalView = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: declarationInfo.department, 
      nzContent: DeclarationResultDetailComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        declarationInfo
      }
    });

    modalView.afterClose.subscribe(result => {
    });

  }
  
}
