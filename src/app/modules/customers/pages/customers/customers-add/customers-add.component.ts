import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-customers-add',
  templateUrl: './customers-add.component.html',
  styleUrls: ['./customers-add.component.less']
})
export class CustomersAddComponent implements OnInit, OnDestroy {

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
    private modalService: NzModalService,
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
      address: ['',Validators.required],
      delegate: ['', Validators.required],
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER) ]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      website: ['', Validators.required],
      active: ['1', Validators.required],
    });
  }

  handleSearchTax() {
  
    if (this.tax) {
      this.agencieService.getOrganizationByTax(this.tax).then((data) => {
          if (data['MaSoThue']) {
            this.companyAgencies.patchValue({
              name: data['Title'],
              address: data['DiaChiCongTy'],
              delegate: data['GiamDoc'],
              tel:data['NoiNopThue_DienThoai']
            });
          } else {

            this.companyAgencies.patchValue({
              name: '',
              address: '',
              delegate: '',
              tel:'',
            });

            this.taxInvalid();
          }
      });
    } else {
      this.taxInvalid();
    }

  }
  
  taxInvalid() {
    this.modalService.warning({
      nzTitle: 'Không tìm thấy mã số thuế cần tìm'
    });
  }
           
  

  get tax() {
    return this.companyAgencies.get('tax').value;
  }
  
  private save() {
    
    for (const i in this.companyAgencies.controls) {
      this.companyAgencies.controls[i].markAsDirty();
      this.companyAgencies.controls[i].updateValueAndValidity();
    }
    
    if (this.companyAgencies.invalid) {
      return;
    }
    
    this.agencieService.create(this.companyAgencies.value).subscribe(data => {
      this.router.navigate(['/customers/list']);
    });    
  }
}

