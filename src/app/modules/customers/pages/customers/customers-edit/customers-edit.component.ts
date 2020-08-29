import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-customers-edit',
  templateUrl: './customers-edit.component.html',
  styleUrls: ['./customers-edit.component.less']
})
export class CustomersEditComponent implements OnInit, OnDestroy {

  item: Company;
  companyAgencies: FormGroup;
  customerId: number;
  loading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.customerId = this.route.snapshot.params.id;
  }

  ngOnDestroy() {

  }   
}

