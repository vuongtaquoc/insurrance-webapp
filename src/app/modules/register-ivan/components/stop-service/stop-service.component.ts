import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CityService, IsurranceDepartmentService, CompanyService,  
  AuthenticationService, SwitchVendorService, CustomerService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import { City, District } from '@app/core/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { schemaSign, HumCommand } from '@app/shared/constant';
import { HubService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-register-ivan-stop-service',
  templateUrl: './stop-service.component.html',
  styleUrls: ['./stop-service.component.less']
})
export class RegisterIvanStopServiceComponent implements OnInit {
  registerForm: FormGroup;
  companyId: string = '0';
  cities: City[] = [];
  isSpinning: boolean;
  shemaUrl: any;
  authenticationToken: string;
  isurranceDepartments: any;
  private hubProxy: any;
  private handlers;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cityService: CityService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private switchVendorService: SwitchVendorService,
    private modalService: NzModalService,
    private customerService: CustomerService,   
    private hubService: HubService,
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
    this.handlers = [
      eventEmitter.on("saveData:error", () => {
         this.isSpinning = false;
      }),
      eventEmitter.on("resultHub:sign", (data) => {
        this.getResultHub(data);
      })
    ];

    this.InitializeData();
  }

  getResultHub(data) {
    if(!data || data.tabIndex !== 1) {
      return;
    }
    this.isSpinning = false;
    let mesage = 'Ký số tờ khai thành công';
    if(!data || !data.status) 
    {
      mesage = 'Ký số tờ khai lỗi, vui lòng liên hệ với quản trị';
    }

    this.modalService.success({
      nzTitle: mesage,
    });
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

  handleSearchTax() {
    if (this.tax) {
      this.isSpinning = true;
      this.customerService.getOrganizationByTax(this.tax).then((data) => {
        if (data['ma_so_thue']) {
         this.setDataFromSearchTax(data);
        } else {
          this.registerForm.patchValue({
            name: '',
            taxCode: '',
          });

          this.taxInvalid();
        }
      });
    } else {
      this.taxInvalid();
    }
    this.isSpinning = false;
  }

  get tax() {
    return this.registerForm.get('taxCode').value;
  }

  taxInvalid() {
    this.modalService.warning({
      nzTitle: 'Không tìm thấy mã số thuế cần tìm'
    });
  }

  setDataFromSearchTax(data: any) {
    this.registerForm.patchValue({
      name: data['ten_cty'],
      active: true,
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
    this.isSpinning = true;
    const data = this.getData();
    this.switchVendorService.create(data).subscribe(data => {
      this.modalService.confirm({
        nzTitle: 'Đăng ký ngừng dịch vụ thành công, Bạn có muốn nộp Hồ sơ đăng ký ngừng sử dụng dịch vụ I-VAN?',
        nzOkText: 'Nộp tờ khai',
        nzCancelText: 'Không',
        nzOkType: 'danger',
        nzOnOk: () => {
          this.signDeclaration(data);
        },
        nzOnCancel: () => {
          this.isSpinning = false;
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

  signDeclaration(data) {
    this.isSpinning = true;
    this.hubProxy = this.hubService.getHubProxy();
    if (this.hubProxy == null || this.hubProxy.connection.state !== 1) {
      this.startAppSign(data);
    } else {
      this.signDeclarationHub(data);
    }
  }

  private startAppSign(data) 
  {
    this.authenticationToken = this.authenticationService.currentCredentials.token;
    let shemaSign = window['schemaSign'] || schemaSign;
    shemaSign = shemaSign.replace('token', this.authenticationToken);
    const link = document.createElement('a');
    link.href = shemaSign.replace('declarationId', data.id);
    link.click();
  }

  private signDeclarationHub(data) {   
    const argum = `${ this.authenticationService.currentCredentials.token },${ data.id },${ HumCommand.signDocument },${ HumCommand.rootAPI }`;
    this.hubProxy.invoke("processMessage", argum).done(() => {
    }).fail((error) => {
      this.isSpinning = false;
    });
  }

}
