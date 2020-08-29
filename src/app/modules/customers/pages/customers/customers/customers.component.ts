import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AuthenticationService, CustomerService, CityService, DistrictService,
  WardsService, IsurranceDepartmentService, SalaryAreaService, AgencieService
} from '@app/core/services';
import { Company, Customer } from '@app/core/models';
import { Router } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.less']
})
export class CustomersComponent implements OnInit, OnDestroy {
  @Input() customerId: string;

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
  customer: Customer;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cityService: CityService,
    private customerService: CustomerService,
    private agencieService: AgencieService,
    private modalService: NzModalService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private salaryAreaService: SalaryAreaService,
  ) {
  }

  ngOnInit() {
    this.loadForm();
    this.InitializeData();
  }

  ngOnDestroy() {

  }

  InitializeData() {
    
    if (this.customerId) {
      this.getDetail();
    } else {
      this.getCities();
      this.getSalaryAreas();
      this.loading = true;
    }

  }

  getDetail() {
    this.customerService.getDetailById(this.customerId).subscribe(data => {
      this.loading = false;
      const fork = [
        this.cityService.getCities(),
        this.salaryAreaService.getSalaryAreas(),
        this.isurranceDepartmentService.getIsurranceDepartments(data.cityCode)
      ];

      forkJoin(fork).subscribe(([cities, salaryAreas, isurranceDepartments]) => {
        this.setDataToForm(data);
        this.cities = cities;
        this.salaryAreas = salaryAreas;
        this.isurranceDepartments = isurranceDepartments;
        this.loading = true;
      });

    });
  }

  // getData(callback) {

  //   if(this.customerId) {
  //     this.customerService.getDetailById(this.customerId).subscribe(data => {
  //       callback(data);
  //     });
  //   }

  // }

  setDataToForm(data) {
    this.companyAgencies.patchValue({
      name: data.name,
      code: data.code,
      isurranceDepartmentId: data.isurranceDepartmentId,
      cityCode: data.cityCode,
      salaryAreaCode: data.salaryAreaCode,
      tax: data.tax,
      address: data.address,
      addressRegister: data.addressRegister,
      personContact: data.personContact,
      tel: data.tel,
      email: data.email,
      position: data.position,
      mobile: data.mobile,
      delegate: data.delegate,
      active: data.active,
    });
  }

  private loadForm() {
    this.companyAgencies = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      isurranceDepartmentId: ['', Validators.required],
      cityCode: ['', Validators.required],
      salaryAreaCode: ['', Validators.required],
      tax: ['', Validators.required],
      address: ['', Validators.required],
      addressRegister: ['', Validators.required],
      personContact: ['', Validators.required],
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER)]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      position: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      delegate: ['', Validators.required],
      active: ['1', Validators.required],
    });

  }

  getCities() {
    this.cityService.getCities().subscribe(datas => {
      this.cities = datas;
    });
  }

  getSalaryAreas() {
    this.salaryAreaService.getSalaryAreas().subscribe(datas => {
      this.salaryAreas = datas;
    });
  }

  changeCity(item) {
    if (!this.loading) {
      return;
    }
    this.isurranceDepartments = [];
    this.companyAgencies.patchValue({
      isurranceDepartmentId: null
    });

    if (item) {
      this.getIsurranceDepartments(item)
    }
  }

  handleSearchTax() {

    if (this.tax) {
      this.agencieService.getOrganizationByTax(this.tax).then((data) => {
        if (data['MaSoThue']) {
          this.companyAgencies.patchValue({
            name: data['Title'],
            address: data['DiaChiCongTy'],
            addressRegister: data['DiaChiCongTy'],
            delegate: data['GiamDoc'],
            tel: data['NoiNopThue_DienThoai']
          });
        } else {

          this.companyAgencies.patchValue({
            name: '',
            address: '',
            delegate: '',
            addressRegister: '',
            tel: '',
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

    if (this.customerId) {
      this.update();
    } else {
      this.create();
    }


  }
  create() {
    this.customerService.create(this.companyAgencies.value).subscribe(data => {
      this.router.navigate(['/customers/list']);
    });
  }
  update() {
    this.customerService.update(this.customerId, this.companyAgencies.value).subscribe(data => {
      this.router.navigate(['/customers/list']);
    });
  }

  getIsurranceDepartments(cityId: string) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityId).subscribe(datas => {
      this.isurranceDepartments = datas;
    });
  }
}

