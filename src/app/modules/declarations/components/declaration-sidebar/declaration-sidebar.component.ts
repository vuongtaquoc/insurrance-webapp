import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeService } from '@app/core/services';

import { EmployeeFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-declaration-sidebar',
  templateUrl: './declaration-sidebar.component.html',
  styleUrls: ['./declaration-sidebar.component.less']
})
export class DeclarationSidebarComponent {
  @Input() isHiddenSidebar = false;
  @Output() onSelectEmployees: EventEmitter<any> = new EventEmitter();
  @Output() onToggleSidebar: EventEmitter<any> = new EventEmitter();

  isSpinning: boolean;
  employeeSelected: any[] = [];
  employeeSubject: Subject<any> = new Subject<any>();

  constructor(
    private modalService: NzModalService,
    private employeeService: EmployeeService
  ) {}

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;

    this.onSelectEmployees.emit(employees);
  }

  addEmployee() {
    const modal = this.modalService.create({
      nzWidth: 980,
      nzWrapClassName: 'employee-modal',
      nzTitle: 'Cập nhật thông tin người lao động',
      nzContent: EmployeeFormComponent,
      nzOnOk: (data) => console.log('Click ok', data)
    });

    modal.afterClose.subscribe(result => {
      this.employeeSubject.next({
        type: 'add',
        status: 'success'
      });
    });
  }

  editEmployee() {
    if (!this.employeeSelected.length) {
      return;
    }

    if (this.employeeSelected.length > 1) {
      return this.modalService.error({
        nzTitle: 'Có lỗi xảy ra',
        nzContent: 'Bạn chỉ có thể sửa 1 nhân viên'
      });
    }

    this.isSpinning = true;
    const selected = this.employeeSelected[0];

    this.employeeService.getEmployeeById(selected.id).subscribe(employee => {
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
        this.employeeSubject.next({
          type: 'edit',
          status: 'success'
        });
      });
    });
  }

  toggleSidebar() {
    this.onToggleSidebar.emit(this.isHiddenSidebar);
  }
}
