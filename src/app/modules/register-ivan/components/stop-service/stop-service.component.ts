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
import { schemaSign } from '@app/shared/constant';

@Component({
  selector: 'app-register-ivan-stop-service',
  templateUrl: './stop-service.component.html',
  styleUrls: ['./stop-service.component.less']
})
export class RegisterIvanStopServiceComponent implements OnInit {
  registerForm: FormGroup;
  companyId: string = '0';
  cities: City[] = [];
  shemaUrl: any;
  authenticationToken: string;
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
      isurranceDepartmentCode: ['', [Validators.required]],
      isurranceCode: ['', [Validators.required]],
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
      isurranceDepartmentCode: data.isurranceDepartmentCode,
      taxCode: data.taxCode,
      isurranceCode: data.isurranceCode,
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
      this.modalService.confirm({
        nzTitle: 'Đăng ký ngừng dịch vụ thành công, Bạn có muốn nộp Hồ sơ đăng ký ngừng sử dụng dịch vụ I-VAN?',
        nzOkText: 'Nộp tờ khai',
        nzCancelText: 'Không',
        nzOkType: 'danger',
        nzOnOk: () => {
          this.signDeclaration(data);
        }
      });
    });
  }

  private rollback() {
    this.router.navigate([this.authenticationService.currentCredentials.role.defaultUrl]);
  }

  changeRegisterCity(value) {
    this.isurranceDepartments = [];
    this.registerForm.patchValue({
      isurranceDepartmentCode: null,
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
      isurranceDepartmentName: this.getNameOfDropdown(this.isurranceDepartments, this.registerForm.value.isurranceDepartmentCode),
      ...this.registerForm.value,
    };
  }

  getNameOfDropdown(sourceOfDropdown: any, id: string) {
    let name = '';
    const item = sourceOfDropdown.find(r => r.id === id);
    if (item) {
      name = item.name;
    }
    return name;
  }

  private createLink() {
    const link = document.createElement('a');
    link.href = this.shemaUrl;
    link.click();
  }

  private buildShemaURL(suffix) {

    this.authenticationToken = this.authenticationService.currentCredentials.token;
    let shemaSign = window['schemaSign'] || schemaSign;
    shemaSign = shemaSign.replace('token', this.authenticationToken);
    this.shemaUrl = shemaSign.replace('declarationId', suffix);

  }

  signDeclaration(data) {

    this.buildShemaURL(data.id);
    this.createLink();

  }


}
