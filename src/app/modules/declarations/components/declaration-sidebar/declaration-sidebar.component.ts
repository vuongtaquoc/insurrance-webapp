import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeService } from '@app/core/services';

import { EmployeeFormComponent } from '@app/shared/components';
import { DeclarationSidebarSearchComponent } from './search.component';

@Component({
  selector: 'app-declaration-sidebar',
  templateUrl: './declaration-sidebar.component.html',
  styleUrls: ['./declaration-sidebar.component.less']
})
export class DeclarationSidebarComponent implements OnInit, OnDestroy {
  @Input() isHiddenSidebar = false;
  @Input() events: Observable<any>;
  @Output() onSelectEmployees: EventEmitter<any> = new EventEmitter();
  @Output() onToggleSidebar: EventEmitter<any> = new EventEmitter();
  @Output() onUserUpdated: EventEmitter<any> = new EventEmitter();

  isSpinning: boolean;
  employeeSelected: any[] = [];
  employeeSubject: Subject<any> = new Subject<any>();
  private eventsSubscription: Subscription;

  constructor(
    private modalService: NzModalService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(({ type }) => {
      if (type === 'clean') {
        this.employeeSubject.next({
          type: 'clean'
        });
        this.employeeSelected.length = 0;
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

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

    const selected = this.employeeSelected[0];

    this.edit(selected);
  }

  handleEditEmployee(selected) {
    this.edit(selected);
  }

  deleteEmployee() {
    if (!this.employeeSelected.length) {
      return;
    }

    if (this.employeeSelected.length > 1) {
      return this.modalService.error({
        nzTitle: 'Có lỗi xảy ra',
        nzContent: 'Bạn chỉ có thể xóa 1 nhân viên'
      });
    }

    const selected = this.employeeSelected[0];

    this.modalService.confirm({
      nzTitle: 'Xóa hồ sơ',
      nzContent: `Bạn có chắc chắn xóa hồ sơ: ${selected.fullName}?`,
      nzOkText: 'Tiếp tục',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.employeeService.delete(selected.employeeId || selected.id).subscribe(() => {
          this.employeeSubject.next({
            type: 'delete',
            status: 'success'
          });
        });
      }
    });
  }

  toggleSidebar() {
    this.onToggleSidebar.emit(this.isHiddenSidebar);
  }

  search() {
    const modal = this.modalService.create({
      nzWidth: 600,
      nzWrapClassName: 'declaration-search-modal',
      nzTitle: 'Tìm kiếm mở rộng',
      nzOnOk: (data) => {
        console.log(data)
      },
      nzOkText: 'Tìm',
      nzCancelText: 'Đóng',
      nzContent: DeclarationSidebarSearchComponent
    });

    modal.afterClose.subscribe(result => {

    });
  }

  refresh() {
    this.employeeSubject.next({
      type: 'refesh',
      status: 'success'
    });
  }

  private edit(selected) {
    this.isSpinning = true;

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
        if (!result) return;

        this.employeeSubject.next({
          type: 'edit',
          status: 'success'
        });

        this.modalService.confirm({
          nzTitle: 'Bạn muốn cập nhật thông tin NLĐ trong hồ sơ?',
          nzOkText: 'Cập nhật',
          nzCancelText: 'Hủy',
          nzOnOk: () => this.onUserUpdated.emit(result)
        });
      });
    });
  }
}
