import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { TreeNode } from 'primeng/api';

import { EmployeeService } from '@app/core/services';

@Component({
  selector: 'app-users-tree',
  templateUrl: './users-tree.component.html',
  styleUrls: ['./users-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersTreeComponent implements OnInit {
  @Output() onSelectEmployees = new EventEmitter();

  employees: TreeNode[];
  selected: TreeNode[];

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.employeeService.getEmployeeTrees().subscribe(employees => {
      this.employees = employees;
    });
  }

  nodeSelect() {
    this.onSelectEmployees.emit(this.selected);
  }
}
