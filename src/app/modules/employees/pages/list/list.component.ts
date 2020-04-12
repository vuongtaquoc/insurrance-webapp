import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-employees-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(private modalService: NzModalService) {}

  ngOnInit() {
    for (let i = 1; i < 21; i++) {
      this.employees.push({
        id: i,
        fullName: `Vương ${i}`,
        employeeCode: `000${i}`,
      })
    }
  }

  onChange(value) {
    console.log(value)
  }

  add() {
    const modal = this.modalService.create({
      nzWidth: 980,
      nzWrapClassName: 'employee-modal',
      nzTitle: 'Cập nhật thông tin người lao động',
      nzContent: EmployeeFormComponent,
      nzOnOk: (data) => console.log('Click ok', data)
    });

    modal.afterClose.subscribe(result => console.log('[afterClose] The result is:', result));
  }
}
