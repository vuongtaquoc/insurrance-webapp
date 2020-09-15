import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import {
  CityService, IsurranceDepartmentService, CompanyService,
  AuthenticationService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import { City, District } from '@app/core/models';

@Component({
  selector: 'app-register-ivan-stop-service',
  templateUrl: './stop-service.component.html',
  styleUrls: ['./stop-service.component.less']
})
export class RegisterIvanStopServiceComponent implements OnInit {
  registerForm: FormGroup;
  companyId: string = '0';
  cities: City[] = [];
  isurranceDepartments: any;

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      cityCode: ['', [Validators.required]],
      isurranceDepartmentId: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      taxCode: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });

    this.InitializeData();
  }

  InitializeData() {
    this.companyId = this.authenticationService.currentCredentials.companyInfo.id;
    this.getDetail();
  }

  handleUpperCase(key) {
    const value = this.registerForm.value[key];

    this.registerForm.patchValue({
      [key]: value.toUpperCase()
    });
  }

  getDetail() {
    this.companyService.getCompanyInfo(this.companyId).subscribe(data => {
      
      const fork = [
        this.cityService.getCities(),
        this.isurranceDepartmentService.getIsurranceDepartments(data.cityCode),
      ];

      forkJoin(fork).subscribe(([cities, isurranceDepartments]) => {
        this.setDataToForm(data);
        this.cities = cities;
        this.isurranceDepartments = isurranceDepartments;
      });

    });
  }

  private setDataToForm(data) {
    this.registerForm.patchValue({
      cityCode: data.cityCode,
      isurranceDepartmentId: data.isurranceDepartmentId,
      taxCode: data.taxCode,
      code: data.code,
      name: data.name,
      reason: 'Chuyên đổi đơn vị cung cấp',
    });
  }

  save() {
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.getData());
  }

  private getData() {
    return {
      companyId: this.companyId,
      ...this.registerForm.value,
    };
  }
}
