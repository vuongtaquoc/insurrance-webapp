import { Component, OnInit, Input } from '@angular/core';
import { DataRegisterIvan, MustMatch } from "@app/shared/constant";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { City, District } from '@app/core/models';
import {
  CityService, IsurranceDepartmentService, SalaryAreaService, CompanyService,
  PaymentMethodServiced, GroupCompanyService, DepartmentService, DistrictService, WardsService,
  AuthenticationService, ContractService
} from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-register-ivan-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterIvanRegisterComponent implements OnInit {
  
  registerIvanData: any[] = [];
  registerForm: FormGroup;
  isFirst: boolean = false;
  files: any[] = [];
  isSubmit: boolean = false;
  companyId: string = '0';
  currentCompanyId: string = '0';
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
  fileUpload: any = [];
  amount: number;
  dataStandard: string;
  useDate: string;
  dataBonus: string;
  contract: any = {};
  contractDetail: any = {};
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  formContractIsvalid = false;

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
    private contractService: ContractService,
    private modalService: NzModalService,
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
      companyType: [''],
      license: [''],
      issued: ['', [Validators.required]],
      note: [''],
      addressReception: [''],
      authorityNo:[''],
      authorityDate:[''],
      hasToken: [false],
      isFirst: [false]
    },
      {
        validator: MustMatch('email', 'emailConfirm')
      });
    
    this.getFullHeight();
    this.InitializeData();
  }

  handleUpperCase(key) {
    const value = this.registerForm.value[key];

    this.registerForm.patchValue({
      [key]: value.toUpperCase()
    });
  }

  changeIsFirst(value) {
    this.isFirst = value;

    if (value) {
      this.registerForm.get('companyType').setValidators(Validators.required);
      this.registerForm.get('companyType').setValidators(Validators.required);
      this.registerForm.get('license').setValidators(Validators.required);
      this.registerForm.get('license').setValidators(Validators.required);
      this.registerForm.get('issued').setValidators(Validators.required);
      this.registerForm.get('issued').setValidators(Validators.required);
      this.registerForm.get('note').setValidators(Validators.required);
      this.registerForm.get('note').setValidators(Validators.required);
    } else {
      this.registerForm.get('companyType').clearValidators();
      this.registerForm.get('companyType').markAsPristine();
      this.registerForm.get('license').clearValidators();
      this.registerForm.get('license').markAsPristine();
      this.registerForm.get('issued').clearValidators();
      this.registerForm.get('issued').markAsPristine();
      this.registerForm.get('note').clearValidators();
      this.registerForm.get('note').markAsPristine();
    }

    this.getFullHeight();
  }

  save() {
    this.isSubmit = true;
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    eventEmitter.emit('formContract:validFrom');
    if (this.registerForm.invalid || this.formContractIsvalid) {
      return;
    }

    if(this.isFirst && this.fileUpload.length < 1) {
      this.modalService.error({
        nzTitle: 'Lỗi đăng ký',
        nzContent: 'Vui lòng upload file đăng ký kinh doanh hoặc giấy tờ liên quan đến doanh nghiệp'
      });

      return;
    } 
    const data = this.getData();
    this.contractService.create(data).subscribe(data => {
      this.modalService.success({
        nzTitle: 'Đăng ký thành công',
        nzContent: 'Chúng tôi sẽ liên hệ lại đơn vị để xác nhận thông tin lập hợp đồng, hóa đơn'
      });
    });

  }

  

  private getFullHeight() {
    if(this.isFirst) {
      return '40%';
    } else {
      return '45%'; 
    }
  }

  InitializeData() {
    this.companyId = this.authenticationService.currentCredentials.companyInfo.companyId;
    this.currentCompanyId = this.authenticationService.currentCredentials.companyInfo.id;
    this.getDetail();
    this.contract = {
      productId: 1,
      priceId: 2,
      paymentMethodCode: '0',
    };
  }

  changeHasToken(value) {
    if (value === '0') {
      this.registerForm.get('privateKey').setValidators(Validators.required);
      this.registerForm.get('privateKey').setValidators(Validators.required);
      this.registerForm.get('vendorToken').setValidators(Validators.required);
      this.registerForm.get('vendorToken').setValidators(Validators.required);
      this.registerForm.get('fromDate').setValidators(Validators.required);
      this.registerForm.get('fromDate').setValidators(Validators.required);
      this.registerForm.get('expired').setValidators(Validators.required);
      this.registerForm.get('expired').setValidators(Validators.required);
    } else {
      this.registerForm.get('privateKey').clearValidators();
      this.registerForm.get('privateKey').markAsPristine();
      this.registerForm.get('vendorToken').clearValidators();
      this.registerForm.get('vendorToken').markAsPristine();
      this.registerForm.get('fromDate').clearValidators();
      this.registerForm.get('fromDate').markAsPristine();
      this.registerForm.get('expired').clearValidators();
      this.registerForm.get('expired').markAsPristine();
    }

  }

  getDetail() {
    this.contractService.getContractOfCompany().subscribe(data => {
      this.loading = false;
      const fork = [
        this.cityService.getCities(),
        this.salaryAreaService.getSalaryAreas(),
        this.isurranceDepartmentService.getIsurranceDepartments(data.cityCode),
        this.groupCompanyService.getGroupCompany(),
        this.paymentMethodServiced.getPaymentMethods(),
      ];

      forkJoin(fork).subscribe(([cities, salaryAreas, isurranceDepartments, groupCompanies, paymentMethods]) => {
        this.setDataToForm(data);
        this.cities = cities;
        this.salaryAreas = salaryAreas;
        this.isurranceDepartments = isurranceDepartments;
        this.groupCompanies = groupCompanies;
        this.paymentMethods = paymentMethods;
        this.loading = true;
        this.files = data.files;
        this.contract = data.contractDetail;
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
      companyType: data.companyType,
      license: data.license,
      issued: data.issued,
      note: data.note,
      addressReception: data.addressReception,
      hasToken: (data.hasToken ? 1 : 0).toString(),
      isFirst: data.isFirst,
      authorityNo:data.authorityNo,
      authorityDate: data.authorityDate ? data.authorityDate.split('/').join('') : '',
    });   

  }

  changeRegisterCity(value) {
    this.districts = [];
    this.isurranceDepartments = [];
    this.wards = [];
    this.registerForm.patchValue({
        isurranceDepartmentId: null,
        districtCode: null,
        wardsCode: null
    });

    this.getIsurranceDepartments(value);
  }

  getIsurranceDepartments(cityCode) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityCode).subscribe(data => {
        this.isurranceDepartments = data;
    });
  }

  get hasToken() {
    return this.registerForm.get('hasToken').value;
  }

  handleFormValuesChanged(data) {
    this.contractDetail = data;
  }

  private getData() {

    const contracInfo =  {
      ...this.registerForm.value,
      companyId: this.companyId,
      customerId: this.currentCompanyId,
      authorityDate: this.authorityDate,   
      contractDetail: this.contractDetail,
      hasToken: this.hasToken == 1 ? true : false,
      files: this.fileUpload
    };

    if(!this.isFirst) {
      contracInfo.companyType = null;
      contracInfo.license = null;
      contracInfo.issued = null;
      contracInfo.note = null;
      contracInfo.addressReception = null;
      contracInfo.files = [];
    }

    if(this.hasToken === '0') {
      contracInfo.privateKey = null;
      contracInfo.vendorToken = null;
      contracInfo.fromDate = null;
      contracInfo.expired = null;
    }

    return contracInfo;

  }

  handleFileSelected(files) {
    this.fileUpload = files;
  }

  get authorityDate() {
    const authorityDate = this.registerForm.get('authorityDate').value;

    if (!authorityDate) return '';

    const birth = getBirthDay(authorityDate, false, false);

    return birth.format;
  }

  handleValidForm(data) {
    this.formContractIsvalid = data.result;
  }
}
