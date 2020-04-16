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
      cityId: ['', Validators.required],
      isurranceDepartmentId: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreaId: ['', Validators.required],
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
      districtId: ['', Validators.required],
      wardsId: ['', Validators.required],
      object: ['', Validators.required]
    });
    // this.item = new Company(this.loginForm);
    this.getCities();
    this.getGroupCompanies();
    this.getSalaryAreas();
    this.getPaymentMethods();
    this.setInfoModelFromSession();
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
    this.getIsurranceDepartments(currentCredentials.companyInfo.cityId);
    this.getDistricts(currentCredentials.companyInfo.cityId);
    this.getWads(currentCredentials.companyInfo.districtId);
    this.companyForm.get('code').setValue(currentCredentials.companyInfo.code);
    this.companyForm.get('name').setValue(currentCredentials.companyInfo.name);
    this.companyForm.get('address').setValue(currentCredentials.companyInfo.address);
    this.companyForm.get('addressRegister').setValue(currentCredentials.companyInfo.addressRegister);
    this.companyForm.get('taxCode').setValue(currentCredentials.companyInfo.taxCode);
    this.companyForm.get('delegate').setValue(currentCredentials.companyInfo.delegate);
    this.companyForm.get('traders').setValue(currentCredentials.companyInfo.traders);
    this.companyForm.get('cityId').setValue(currentCredentials.companyInfo.cityId);
    this.companyForm.get('isurranceDepartmentId').setValue(currentCredentials.companyInfo.isurranceDepartmentId);
    this.companyForm.get('salaryAreaId').setValue(currentCredentials.companyInfo.salaryAreaId);
    this.companyForm.get('mobile').setValue(currentCredentials.companyInfo.mobile);
    this.companyForm.get('emailOfContract').setValue(currentCredentials.companyInfo.emailOfContract);
    this.companyForm.get('paymentMethodId').setValue(currentCredentials.companyInfo.paymentMethodId);
    this.companyForm.get('responseResults').setValue(currentCredentials.companyInfo.responseResults);
    this.companyForm.get('groupCompanyCode').setValue(currentCredentials.companyInfo.groupCompanyCode);
    this.companyForm.get('submissionType').setValue(currentCredentials.companyInfo.submissionType);
    this.companyForm.get('districtId').setValue(currentCredentials.companyInfo.districtId);
    this.companyForm.get('wardsId').setValue(currentCredentials.companyInfo.wardsId);
    this.companyForm.get('object').setValue(currentCredentials.companyInfo.object);
  }
  get form() {
    return this.companyForm.controls;
  }
}

