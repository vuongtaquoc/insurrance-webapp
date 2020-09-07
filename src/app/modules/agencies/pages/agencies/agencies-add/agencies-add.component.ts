import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-agencies-add', 
  templateUrl: './agencies-add.component.html',
  styleUrls: ['./agencies-add.component.less']
})
export class AgenciesAddComponent implements OnInit, OnDestroy {

  constructor(
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}


