import { Component, OnInit, ViewEncapsulation, Output, EventEmitter, ViewChild } from '@angular/core';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core';

import { EmployeeService } from '@app/core/services';

@Component({
  selector: 'app-users-tree',
  templateUrl: './users-tree.component.html',
  styleUrls: ['./users-tree.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UsersTreeComponent implements OnInit {
  @Output() onSelectEmployees = new EventEmitter();

  employees: any[];
  searchValue = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployeeTrees().subscribe(employees => {
      this.employees = employees;
    });
  }

  nzCheck(event: NzFormatEmitEvent) {
    const selected = event.checkedKeys.reduce(
      (combine, current, index): any => {
        if (current.level === 0 && current.isChecked) {
          const children = current.getChildren();

          return [ ...combine, ...children.map(child => child.origin) ];
        }

        return [ ...combine, current.origin ];
      },
      []
    );

    this.onSelectEmployees.emit(selected);
  }
}
