import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeService } from '@app/core/services';

import { EmployeeFormComponent } from '@app/shared/components';
import { DeclarationSidebarSearchComponent } from './search.component';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-declaration-sidebar',
  templateUrl: './declaration-sidebar.component.html',
  styleUrls: ['./declaration-sidebar.component.less']
})
export class DeclarationSidebarComponent implements OnInit, OnDestroy {
  @Input() isHiddenSidebar = false;
  @Input() tableName: string;
  @Input() events: Observable<any>;
  @Output() onSelectEmployees: EventEmitter<any> = new EventEmitter();
  @Output() onToggleSidebar: EventEmitter<any> = new EventEmitter();
  @Output() onUserUpdated: EventEmitter<any> = new EventEmitter();
  @Output() onUserDeleted: EventEmitter<any> = new EventEmitter();
  @Output() onUserAdded: EventEmitter<any> = new EventEmitter();

  isSpinning: boolean;
  employeeSelected: any[] = [];
  employeeSubject: Subject<any> = new Subject<any>();
  private eventsSubscription: Subscription;
  private handlers: any = [];

  constructor(
    private modalService: NzModalService,
    private employeeService: EmployeeService,
    private translateService: TranslateService,
    private messageService: NzMessageService,
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
    this.handlers = [
      eventEmitter.on('tableEditor:addEmployee', ({ tableName, y, x }) => {
        if (tableName.indexOf(this.tableName) > -1) {
          this.add(tableName, y);
        }
      })
    ];
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    eventEmitter.destroy(this.handlers);
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;

    this.onSelectEmployees.emit(employees);
  }

  handleDeleteEmployee(employees) {
    this.delete(employees);
  }

  add(tableName = '', y?) {
    this.employeeService.getPressCreate().subscribe(data => {
      const employee =
      {
        ratio: data.ratioInsurrance.ratio,
        rate: data.ratioInsurrance.bhxh,
        paymentMethodCode: data.ratioInsurrance.month,
        orders: data.order
      }
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
        if (!result) return;

        this.employeeSubject.next({
          type: 'add',
          status: 'success'
        });

        if (tableName) {
          this.onUserAdded.emit({
            tableName,
            y,
            employee: result
          });
        }
      });
    });
  }

  addEmployee() {
    this.add();
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

    const employee = this.employeeSelected[0];
    this.delete(employee);
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
        this.employeeSubject.next({
          type: 'search',
          status: 'success',
          data: {
            text: data.text ? data.text.replace(/(\r\n|\n|\r)/gm, ';') : '',
            searchType: data.searchType
          }
        });
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
  private delete(employee) {

    this.modalService.confirm({
      nzTitle: 'Xóa hồ sơ',
      nzContent: `Bạn có chắc chắn xóa hồ sơ: ${employee.fullName}?`,
      nzOkText: 'Tiếp tục',
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        this.employeeService.delete(employee.employeeId || employee.id).subscribe(() => {

          this.employeeSubject.next({
            type: 'delete',
            status: 'success'
          });

          this.modalService.confirm({
            nzTitle: 'Bạn muốn xóa thông tin NLĐ trong hồ sơ?',
            nzOkText: 'Xóa NLĐ',
            nzCancelText: 'Hủy',
            nzOnOk: () => {
              this.onUserDeleted.emit(employee);
              eventEmitter.emit('tree-declaration:deleteUser', {
                tableName: this.tableName,
                employee
              });
            }
          });

        },
        (err) => {
          this.translateService.get(err.message).subscribe(message => {
            this.messageService.create('error', message);
          });
        });
      }
    });
  }

  private edit(selected) {
    this.isSpinning = true;
    eventEmitter.emit('loading:open', true);

    this.employeeService.getEmployeeById(selected.id).subscribe(employee => {

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
      this.isSpinning = false;
      eventEmitter.emit('loading:open', false);
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
          nzOnOk: () => {
            this.onUserUpdated.emit(result);
            eventEmitter.emit('tree-declaration:updateUser', {
              tableName: this.tableName,
              employee: result
            });
          }
        });
      });
    });
  }
}
