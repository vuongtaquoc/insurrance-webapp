import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, SalaryAreaService,} from '@app/core/services';
import { CityService, ContractService, IsurranceDepartmentService,
ProductService, PriceService } from '@app/core/services';
import { Department, Company, Price } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import format from '@app/shared/utils/format';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.less']
})
export class ContractEditComponent implements OnInit, OnDestroy {
  contractId: number; 
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.contractId = this.route.snapshot.params.id;
  }

  ngOnDestroy() {
  }   
   
}

