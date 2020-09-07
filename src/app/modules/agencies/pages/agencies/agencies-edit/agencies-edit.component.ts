import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-agencies-edit',
  templateUrl: './agencies-edit.component.html',
  styleUrls: ['./agencies-edit.component.less']
})
export class AgenciesEditComponent implements OnInit, OnDestroy {
  agenciesId: number;
  loading = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.agenciesId = this.route.snapshot.params.id;
  }

  ngOnDestroy() {

  }
}

