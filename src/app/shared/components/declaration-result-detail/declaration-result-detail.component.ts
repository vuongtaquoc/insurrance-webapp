import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-declaration-result-detail',
  templateUrl: './declaration-result-detail.component.html',
  styleUrls: ['./declaration-result-detail.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationResultDetailComponent implements OnInit {
  @Input() declarationInfo: any;
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
  ) {}

  ngOnInit() {
    
  }

  dismiss(): void {
    this.modal.destroy();
  }
  
}
