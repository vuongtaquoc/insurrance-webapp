import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { EmployeeService,AuthenticationService, DepartmentService } from '@app/core/services';
import { EmployeeFormComponent } from '@app/shared/components';
import { ManageUnitFormComponent } from '@app/shared/components';
import { PAGE_SIZE, GENDER } from '@app/shared/constant';

@Component({
  selector: 'app-employees-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  total: number;
  skip: number;
  selectedPage: number = 1;
  isSpinning: boolean;
  gender: any = GENDER;
  filter: any = {
    fullName: '',
    code: '',
    isurranceCode: '',
    isurranceNo: '',
    identityCar: '',
    birthday: '',
    gender: '',
    hospitalFirstRegistName: ''
  };
  keyword: string = '';
  tableHeight: number;

  constructor(
    private authenticationService: AuthenticationService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private employeeService: EmployeeService,
    private translateService: TranslateService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.getEmployees();

    if (window.innerWidth > 1366) {
      this.tableHeight = 600;
    } else if (window.innerWidth <= 1366) {
      this.tableHeight = 420;
    }
  }

  getEmployees(skip = 0, take = PAGE_SIZE) {
    this.employeeService.getEmployees({
      keyWord: this.keyword,
      skip,
      take
    }).subscribe(res => {
      this.employees = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= PAGE_SIZE;
        this.selectedPage -= 1;

        this.getEmployees(this.skip);
      }
    });
  }

  handleFilter(key) {
    this.keyword = this.filter[key];

    this.getEmployees();
  }

  pageChange({ skip, page }) {
    this.selectedPage = page;

    this.getEmployees(skip, PAGE_SIZE);
  }

  add() {

    this.isSpinning = true;
    this.employeeService.getPressCreate().subscribe(data => {
      const employee =
      {
        ratio: data.ratioInsurrance.ratio,
        rate: data.ratioInsurrance.bhxh,
        paymentMethodCode: data.ratioInsurrance.month,
        orders: data.order
      }

      this.isSpinning = false;
      const modal = this.modalService.create({
        nzWidth: 980,
        nzWrapClassName: 'employee-modal',
        nzTitle: 'Cập nhật thông tin người lao động',
        nzContent: EmployeeFormComponent,
        nzOnOk: (data) => console.log('Click ok', data),
        nzComponentParams: {
          employee
        }
      });

      modal.afterClose.subscribe(result => {
        this.getEmployees();
      });
    });
  }

  changeCompanyInfo() {
    const companyInfo  =  this.authenticationService.currentCredentials.companyInfo;
    if(companyInfo.groupCode === '01') {
      this.getDepartment((data) => {
        companyInfo.departments =  data,
        this.showDialogChangeCompany(companyInfo);
      });
    }
     else {
      this.showDialogChangeCompany(companyInfo);
    }
  }



  getDepartment(callback) {
    this.departmentService.getDepartmentShortName().subscribe(data => {
      callback(data);
    });
  }

  showDialogChangeCompany(companyInfo) {
    const modal = this.modalService.create({
      nzWidth: 980,
      nzWrapClassName: 'manage-unit-modal',
      nzTitle: 'Cập nhật thông tin đơn vị',
      nzContent: ManageUnitFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        companyInfo
      }
    });

    modal.afterClose.subscribe(result => {
      if(!result) {
        return;
      }
      this.modalService.success({
        nzTitle: 'Cập nhập thông tin thành công'
      });
      this.authenticationService.updateCompanyInStorage(result);
    });
  }

  edit(employeeId) {
    this.isSpinning = true;

    this.employeeService.getEmployeeById(employeeId).subscribe(employee => {
      this.isSpinning = false;
      const modal = this.modalService.create({
        nzWidth: 980,
        nzWrapClassName: 'employee-modal',
        nzTitle: 'Chỉnh sửa thông tin người lao động',
        nzContent: EmployeeFormComponent,
        nzOnOk: (data) => console.log('Click ok', data),
        nzComponentParams: {
          employee
        }
      });

      modal.afterClose.subscribe(result => {
        this.getEmployees();
      });
    }, () => {
      this.isSpinning = false;
    });
  }

  delete(employeeId) {
    this.employeeService.delete(employeeId).subscribe(() => {
      this.getEmployees(this.skip);
    },
    (err) => {
      this.translateService.get(err.message).subscribe(message => {
        this.messageService.create('error', message);
      });
    });
  }
}
