import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService,GroupCompanyService, PaymentMethodServiced, SalaryAreaService,} from '@app/core/services';
import { CityService, DistrictService, WardsService, IsurranceDepartmentService } from '@app/core/services';
import { TABLE_COLUMNS_TYPE, TABLE_HEADERS, TABLE_COLUMNS_WIDTHS } from '@app/modules/company/data/department-table';
import { Department, Company } from '@app/core/models';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.less']
})
export class CompanyEditComponent implements OnInit, OnDestroy {
  item: Company;
  companyForm: FormGroup;
  declarations: Department[] = [];
  tableColumnType: any[] = TABLE_COLUMNS_TYPE;
  tableHeader: any[] = TABLE_HEADERS;
  tableColumnWidth: any[] = TABLE_COLUMNS_WIDTHS;

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
    private groupCompanyService: GroupCompanyService,
    private paymentMethodServiced: PaymentMethodServiced,
    private salaryAreaService: SalaryAreaService,
    private cityService: CityService,
    private districtService: DistrictService,
    private wardsService: WardsService,
    private authenticationService: AuthenticationService,
    private isurranceDepartmentService: IsurranceDepartmentService,
  ) {
  }
  ngOnInit() {
    this.companyForm = this.formBuilder.group({
      cities: ['', Validators.required],
      insurranceManagement: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreas: ['', Validators.required],
      name: ['', Validators.required],
      addressRegister: ['', Validators.required] ,
      address: ['', Validators.required],
      taxCode: ['', Validators.required],
      delegate: ['', Validators.required],
      traders: ['', Validators.required],
      mobile: ['', Validators.required],
      emailOfContract: ['', Validators.required],
      paymentMethodId: ['', Validators.required],
      responseResults: ['1', Validators.required],
      groupCompanyCode: ['', Validators.required],
      submissionType: ['0', Validators.required],
      districts: ['', Validators.required],
      wards: ['', Validators.required],
      object: ['', Validators.required]
    });
    // this.item = new Company(this.loginForm);
    // this.companyForm.get('code').setValue('DUCLV88');
    this.getCities();
    this.getGroupCompanies();
    this.getSalaryAreas();
    this.getPaymentMethods();
    this.setInfoModelFromSession();
    // this.companyForm.get('groupCompanyCode').setValue('05');
  }

  ngOnDestroy() {
  }

  getGroupCompanies() {
    this.groupCompanyService.getGroupCompany().subscribe(datas => {
      this.groupCompanies = datas;
    });
  }


  getCities() {
    this.cityService.getCities().subscribe(datas => {
      this.cities = datas;
    });
  }

  getDistricts(cityId: string) {
    this.districtService.getDistrict(cityId).subscribe(datas => {
      this.districts = datas;
    });
  }

  getWads(districtId: string) {
    this.wardsService.getWards(districtId).subscribe(datas => {
      this.wards = datas;
    });
  }

  getSalaryAreas() {
    this.salaryAreaService.getSalaryAreas().subscribe(datas => {
      this.salaryAreas = datas;
    });
  }
  getPaymentMethods() {
    this.paymentMethodServiced.getPaymentMethods().subscribe(datas => {
      this.paymentMethods = datas;
    });
  }

  getIsurranceDepartments(cityId: string) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityId).subscribe(datas => {
      this.isurranceDepartments = datas;
    });
  }

  changeCity(item) {
    if(item) {
      this.getDistricts(item);
      this.getIsurranceDepartments(item)
    }
  }

  changeDistrict(item) {
    if(item) {
      this.getWads(item);
    }
  }

  setInfoModelFromSession() {
    const currentCredentials = this.authenticationService.currentCredentials;
  }
  get form() {
    return this.companyForm.controls;
  }
}

