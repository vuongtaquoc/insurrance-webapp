import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';

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
  selected: any[];
  searchValue = '';

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployeeTrees().subscribe(employees => {
      this.employees = employees;
    });
  }

  nzEvent(event) {
    console.log(event)
    // this.onSelectEmployees.emit(this.selected);
  }
}
