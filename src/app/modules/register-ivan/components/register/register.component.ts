import { Component, OnInit, Input } from '@angular/core';
import { DataRegisterIvan, MustMatch } from "@app/shared/constant";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { City, District } from '@app/core/models';
import {
  CityService, IsurranceDepartmentService, SalaryAreaService, CompanyService,
  PaymentMethodServiced, GroupCompanyService, DepartmentService, DistrictService, WardsService,
  AuthenticationService, ProductService, PriceService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import format from '@app/shared/utils/format';


@Component({
  selector: 'app-register-ivan-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterIvanRegisterComponent implements OnInit {
  
  registerIvanData: any[] = [];
  registerForm: FormGroup;
  checked: boolean = false;
  files: any[] = [];
  isSubmit: boolean = false;
  companyId: string = '0';
  cities: City[] = [];
  isurranceDepartments: any;
  registerDistricts: District[] = [];
  departments: any = [];
  salaryAreas: any = [];
  groupCompanies: any = [];
  loading: boolean = false;
  paymentMethods: any = [];
  districts: City[] = [];
  wards: City[] = [];
  products: any = [];
  prices: any = [];

  amount: number;
  dataStandard: string;
  useDate: string;
  dataBonus: string;

  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private salaryAreaService: SalaryAreaService,
    private paymentMethodServiced: PaymentMethodServiced,
    private groupCompanyService: GroupCompanyService,
    private departmentService: DepartmentService,
    private districtService: DistrictService,
    private wardsService: WardsService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private productService: ProductService,
    private priceService: PriceService,
  ) {}

  ngOnInit() {
    this.registerIvanData = DataRegisterIvan;
    this.registerForm = this.formBuilder.group({
      cityCode: ['', [Validators.required]],
      isurranceDepartmentId: ['', [Validators.required]],
      groupCode: ['', [Validators.required]],
      salaryAreaCode: ['', [Validators.required]],
      taxCode: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressRegister: ['', [Validators.required]],
      delegate: ['', [Validators.required]],
      position: ['', [Validators.required]],
      tel: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      personContact: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      emailConfirm: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      paymentMethodCode: ['', [Validators.required]],
      responseResults: ['', [Validators.required]],
      privateKey: ['', [Validators.required]],
      vendorToken: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      expired: ['', [Validators.required]],
      productId: ['', [Validators.required]],
      priceId: ['', [Validators.required]],
      paymentMethodCodeIvan: ['', [Validators.required]],
      companyType: ['', [Validators.required]],
      license: ['', [Validators.required]],
      issued: ['', [Validators.required]],
      note: ['', [Validators.required]],
      addressReception: [''],
      authorityNo:[''],
      authorityDate:[''],
      hasToken: [false],
      isFirst: [false]
    },
      {
        validator: MustMatch('email', 'emailConfirm')
      });

    this.InitializeData();
  }

  handleUpperCase(key) {
    const value = this.registerForm.value[key];

    this.registerForm.patchValue({
      [key]: value.toUpperCase()
    });
  }

  changeChecked(value) {
    this.checked = value;
  }

  save() {
    this.isSubmit = true;

    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    this.getFullHeight();

    // if (this.registerForm.invalid) {
    //   return;
    // }
  }

  getFullHeight() {
    if (this.isSubmit && this.checked) return '25%';
    return this.isSubmit ? '31%' : this.checked ? '32%' : '40%';
  }

  InitializeData() {
    this.companyId = this.authenticationService.currentCredentials.companyInfo.id;
    this.getDetail();
  }


  getDetail() {
    this.companyService.getCompanyInfo(this.companyId).subscribe(data => {
      this.loading = false;
      const fork = [
        this.cityService.getCities(),
        this.salaryAreaService.getSalaryAreas(),
        this.isurranceDepartmentService.getIsurranceDepartments(data.cityCode),
        this.groupCompanyService.getGroupCompany(),
        this.paymentMethodServiced.getPaymentMethods(),
        this.productService.getList(),
      ];

      forkJoin(fork).subscribe(([cities, salaryAreas, isurranceDepartments, groupCompanies, paymentMethods, products]) => {
        this.setDataToForm(data);
        this.cities = cities;
        this.salaryAreas = salaryAreas;
        this.isurranceDepartments = isurranceDepartments;
        this.groupCompanies = groupCompanies;
        this.paymentMethods = paymentMethods;
        this.products = products.data;
        this.loading = true;
      });

    });
  }

  setDataToForm(data) {

    this.registerForm.patchValue({
      cityCode: data.cityCode,
      isurranceDepartmentId: data.isurranceDepartmentId,
      groupCode: data.groupCode,
      salaryAreaCode: data.salaryAreaCode,
      taxCode: data.taxCode,
      code: data.code,
      name: data.name,
      address: data.address,
      addressRegister: data.addressRegister,
      delegate: data.delegate,
      position: data.position,
      tel: data.tel,
      personContact: data.personContact,
      mobile: data.mobile,
      email: data.email,
      emailConfirm: data.email,
      paymentMethodCode: data.paymentMethodCode,
      responseResults: (data.responseResults || '0').toString(),
      privateKey: data.privateKey,
      vendorToken: data.vendorToken,
      fromDate: data.fromDate,
      expired: data.expired,
      productId: data.code,
      priceId: data.code,
      // paymentMethodCodeIvan: data.code,
      companyType: data.code,
      license: data.license,
      issued: data.issued,
      note: data.note,
      addressReception: data.addressReception,
      hasToken: (data.hasToken || '0').toString(),
      isFirst: data.isFirst,
      authorityNo:data.authorityNo,
      authorityDate: data.authorityDate,
    });   

  }

  changeRegisterCity(id) {
      
  }

  changeProduct(productId) {
    this.prices = [];
    this.registerForm.patchValue({
      priceId: ''
    });

    this.priceService.getList({
      productId
    }).subscribe(prices => {
      this.prices = prices.data;
    });

  }

  private changePrice(id) {
    this.priceService.getById(id).subscribe(data => {
       this.amount = format.currency(data.amount);
       this.dataStandard = data.dataStandard;
       this.useDate = data.useDate;
       this.dataBonus= data.dataBonus;
    });
  }

  get hasToken() {
    return this.registerForm.get('hasToken').value;
  }


}
