import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CityService, IsurranceDepartmentService, CompanyService,  
  AuthenticationService, SwitchVendorService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import { City, District } from '@app/core/models';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    private router: Router,
    private cityService: CityService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private switchVendorService: SwitchVendorService,
    private modalService: NzModalService,
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
    this.switchVendorService.getDraft().subscribe(data => {
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

    const data = this.getData();
    this.switchVendorService.create(data).subscribe(data => {
      this.modalService.success({
        nzTitle: 'Đăng ký ngừng dịch vụ ',
        nzContent: 'Đăng ký ngừng dịch vụ thành công, vui lòng điền đầy đủ thông tin tab đăng ký mới'
      });
    });
  }

  private rollback() {
    this.router.navigate([this.authenticationService.currentCredentials.role.defaultUrl]);
  }

  changeRegisterCity(value) {
    this.isurranceDepartments = [];
    this.registerForm.patchValue({
        isurranceDepartmentId: null,
    });

    this.getIsurranceDepartments(value);
  }

  getIsurranceDepartments(cityCode) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityCode).subscribe(data => {
        this.isurranceDepartments = data;
    });
  }

  private getData() {
    return {
      companyId: this.companyId,
      ...this.registerForm.value,
    };
  }


}
