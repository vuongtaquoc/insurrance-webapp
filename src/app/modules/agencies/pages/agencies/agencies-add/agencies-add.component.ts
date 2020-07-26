import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agencies-add',
  templateUrl: './agencies-add.component.html',
  styleUrls: ['./agencies-add.component.less']
})
export class AgenciesAddComponent implements OnInit, OnDestroy {

  item: Company;
  companyAgencies: FormGroup;

  loading = false;
  groupCompanies: any;
  cities: any;
  wards: any;
  districts: any;
  salaryAreas: any;
  paymentMethods: any;
  groupCompanyCode: any;
  isurranceDepartments: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private agencieService: AgencieService,
  ) {
  }

  ngOnInit() {
    
    this.loadForm();
  }

  ngOnDestroy() {
  }

  private loadForm() {
    this.companyAgencies = this.formBuilder.group({
      tax: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required],
      delegate: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required],
      Website: ['', Validators.required],
      active: ['', Validators.required] 
    });
  }

  handleSubmit() {
    this.save();
  }
  
  private save() {
    if (this.companyAgencies.invalid) {
      return;
    }
    this.agencieService.create(this.companyAgencies.value).subscribe(data => {
      this.router.navigate(['/agencies/list']);
    });
    
  }
}

