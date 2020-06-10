import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '@app/core/services';

@Component({
  selector: 'app-users-tree',
  templateUrl: './users-tree.component.html',
  styleUrls: ['./users-tree.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class UsersTreeComponent implements OnInit, OnDestroy {
  @Input() events: Observable<any>;
  @Output() onSelectEmployees = new EventEmitter();
  @Output() onEditEmployee = new EventEmitter();
  @Output() onDeleteEmployee = new EventEmitter();

  employees: any[];
  searchValue = '';
  defaultCheckedKeys = [];
  defaultSelectedKeys = [];
  defaultExpanded = [];
  isLoading = false;
  
  private eventsSubscription: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployeeTrees();

    this.eventsSubscription = this.events.subscribe(({ type, status }) => {
      if (status === 'success') {
        this.getEmployeeTrees();
      }

      if (type === 'clean') {
        this.defaultCheckedKeys = [];
        this.defaultSelectedKeys = [];
      }
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  getEmployeeTrees() {
    this.isLoading = true;
    this.employeeService.getEmployeeTrees().subscribe(employees => {
      this.employees = employees;
      this.defaultExpanded = this.employees.map(e => e.key);

      this.isLoading = false;
    });
  }

  nzCheck(event) {
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

    this.defaultCheckedKeys = event.keys;
    this.defaultSelectedKeys = event.keys;

    this.onSelectEmployees.emit(selected);
  }

  editUser(origin) {
    this.onEditEmployee.emit(origin);
  }

  deleteUser(origin) {
    this.onDeleteEmployee.emit(origin);
  }
}
