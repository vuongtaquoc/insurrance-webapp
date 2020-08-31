import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Company } from '@app/core/models';
import { Router } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.less']
})
export class AccountAddComponent implements OnInit, OnDestroy {
  constructor(
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}

