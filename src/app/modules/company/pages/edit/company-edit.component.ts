import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GroupCompanyService, PaymentMethodServiced, SalaryAreaService, CityService } from '@app/core/services';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  groupCompanyCode: any;
  groupCompanies: SelectItem[] = [];
  paymentMethods: SelectItem[] = [];
  salaryAreas: SelectItem[] = [];
  cities: SelectItem[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private groupCompanyService: GroupCompanyService,
    private paymentMethodServiced: PaymentMethodServiced,
    private salaryAreaService: SalaryAreaService,
    private cityService: CityService,
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      subject: ['', Validators.required],
      name: ['', Validators.required],
      taxcode: ['', Validators.required],
      address: ['', Validators.required],
      addressregister: ['', Validators.required],
      companycode: ['', Validators.required] ,
      responseresults: ['1', Validators.required],
      groupCompanyCode: ['', Validators.required],
      cityId: ['', Validators.required] 
    });

    this.getGroupCompanies();
    this.getCities();
  }

  ngOnDestroy() {
  }

  getGroupCompanies() {
    this.groupCompanyService.getGroupCompany().subscribe(datas => {
      this.formatObjectDropdown(datas, this.groupCompanies, false)
    });
  }

  onChange(itemSelected) {
    console.log('event :' + itemSelected);
    console.log(itemSelected.value);
  }

  getCities() {
    this.cityService.getCities().subscribe(datas => {
      this.formatObjectDropdown(datas, this.cities, true)
    });
  }

  formatObjectDropdown(datas: any, sourceDropDown: SelectItem[], isSetId: boolean) {
    datas.forEach((item) => {
      if(isSetId) {
        sourceDropDown.push({label: item.name,value: item.id});
      }else {
        sourceDropDown.push({label: item.name,value: item.code});
      }
    });
  }

  get form() {
    return this.loginForm.controls;
  }
}

