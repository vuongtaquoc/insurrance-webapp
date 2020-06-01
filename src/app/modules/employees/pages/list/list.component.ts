import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeService } from '@app/core/services';
import { EmployeeFormComponent } from '@app/shared/components';

import { PAGE_SIZE } from '@app/shared/constant';

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

  constructor(
    private modalService: NzModalService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees(skip = 0, take = PAGE_SIZE) {
    this.employeeService.getEmployees({
      keyWord: '',
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

  pageChange({ skip, page }) {
    this.selectedPage = page;

    this.getEmployees(skip);
  }

  add() {
    const modal = this.modalService.create({
      nzWidth: 980,
      nzWrapClassName: 'employee-modal',
      nzTitle: 'Cập nhật thông tin người lao động',
      nzContent: EmployeeFormComponent,
      nzOnOk: (data) => console.log('Click ok', data)
    });

    modal.afterClose.subscribe(result => {
      this.getEmployees();
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
    });
  }

  delete(employeeId) {
    this.employeeService.delete(employeeId).subscribe(() => {
      this.getEmployees(this.skip);
    });
  }
}
