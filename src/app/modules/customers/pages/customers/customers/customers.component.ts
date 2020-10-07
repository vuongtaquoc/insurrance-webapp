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
  formCustomer: FormGroup;
  loading = false;
  cities: any;
  wards: any;
  districts: any;
  salaryAreas: any;
  paymentMethods: any;
  groupCompanyCode: any;
  isurranceDepartments: any;
  customer: Customer;
  isSpinning: boolean = false;
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
    this.isSpinning = true;
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
        this.isSpinning = false;
      });

    });
  }

  setDataToForm(data) {
    this.formCustomer.patchValue({
      name: data.name,
      isurranceCode: data.isurranceCode,
      isurranceDepartmentCode: data.isurranceDepartmentCode,
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
    this.formCustomer = this.formBuilder.group({
      name: ['', Validators.required],
      isurranceCode: [''],
      isurranceDepartmentCode: ['', Validators.required],
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
    this.formCustomer.patchValue({
      isurranceDepartmentCode: null
    });

    if (item) {
      this.getIsurranceDepartments(item)
    }
  }

  handleSearchTax() {

    if (this.tax) {
      this.isSpinning = true;
      this.agencieService.getOrganizationByTax(this.tax).then((data) => {
        if (data['MaSoThue']) {
          this.formCustomer.patchValue({
            name: data['Title'],
            address: data['DiaChiCongTy'],
            addressRegister: data['DiaChiCongTy'],
            delegate: data['GiamDoc'],
            tel: data['NoiNopThue_DienThoai'],
            active: true,
          });
        } else {

          this.formCustomer.patchValue({
            name: '',
            address: '',
            delegate: '',
            addressRegister: '',
            tel: '',
            active: false,
          });

          this.taxInvalid();
        }
      });
    } else {
      this.taxInvalid();
    }
    this.isSpinning = false;

  }

  taxInvalid() {
    this.modalService.warning({
      nzTitle: 'Không tìm thấy mã số thuế cần tìm'
    });
  }

  get tax() {
    return this.formCustomer.get('tax').value;
  }

  private save() {

    for (const i in this.formCustomer.controls) {
      this.formCustomer.controls[i].markAsDirty();
      this.formCustomer.controls[i].updateValueAndValidity();
    }

    if (this.formCustomer.invalid) {
      return;
    }

    if (this.customerId) {
      this.update();
    } else {
      this.create();
    }

  }
  getData() {

    return {
      ...this.formCustomer.value,
      isurranceDepartmentName: this.getNameOfDropdown(this.isurranceDepartments, this.formCustomer.value.isurranceDepartmentCode),   
    };
    
  }

  create() {
    this.isSpinning = true;
    const customerData = this.getData();
    this.customerService.create(customerData).subscribe(data => {
      this.isSpinning = false;
      this.router.navigate(['/customers/list']);
    });
  }
  update() {
    this.isSpinning = true;
    const customerData = this.getData();
    console.log(customerData);
    this.customerService.update(this.customerId, customerData).subscribe(data => {
      this.isSpinning = false;
      this.router.navigate(['/customers/list']);
    });
  }

  getIsurranceDepartments(cityId: string) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityId).subscribe(datas => {
      this.isurranceDepartments = datas;
    });
  }

  getNameOfDropdown(sourceOfDropdown: any, id: string) {
    let name = '';
    const item = sourceOfDropdown.find(r => r.id === id);
    if (item) {
      name = item.name;
    }
    return name;
  }
}

