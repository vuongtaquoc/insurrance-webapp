import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupCompanyService, PaymentMethodServiced, SalaryAreaService, CityService, DistrictService, WardsService } from '@app/core/services';
import { SelectItem } from '@app/core/interfaces';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.less']
})
export class CompanyEditComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  groupCompanies: any;
  cities: any;
  wards: any;
  districts: any;
  salaryAreas: any;
  groupCompanyCode: any;
  documentTypes: SelectItem[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private groupCompanyService: GroupCompanyService,
    private paymentMethodServiced: PaymentMethodServiced,
    private salaryAreaService: SalaryAreaService,
    private cityService: CityService,
    private districtService: DistrictService,
    private wardsService: WardsService,
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      cities: ['', Validators.required],
      insurranceManagement: ['', Validators.required],
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
      districts: ['', Validators.required],
      wards: ['', Validators.required]
    });

    this.getCities();
    this.getGroupCompanies();
    this.getSalaryAreas();
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

  getdistricts(cityId: string) {
    this.districtService.getDistrict(cityId).subscribe(datas => {
      this.districts = datas;
    });
  }

  getWads(districtId: string) {
    this.wardsService.getWards(districtId).subscribe(datas => {
      this.cities = datas;
    });
  }

  getSalaryAreas() {
    this.salaryAreas.getSalaryAreas().subscribe(datas => {
      this.salaryAreas = datas;
    });
  }
   
  changeCity(item) {
    if(item) {
      this.getdistricts(item);
    }
  }
  get form() {
    return this.loginForm.controls;
  }
}

