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

@Component({
  selector: 'app-declaration-error',
  templateUrl: './declaration-error.component.html',
  styleUrls: ['./declaration-error.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationErrorComponent implements OnInit {
  @Input() resultError: any;
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
}
