import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';

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
  handler;

  private eventsSubscription: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
    this.getEmployeeTrees();

    this.eventsSubscription = this.events.subscribe(({ type, status, data }) => {
      if (status === 'success') {
        if (!data) {
          this.getEmployeeTrees();
        } else {
          this.getEmployeeTrees(data.searchType, data.text);
        }
      }

      if (type === 'clean') {
        this.defaultCheckedKeys = [];
        this.defaultSelectedKeys = [];
      }

    });

    this.handler = eventEmitter.on('tree-declaration:deleteUser', () => {
      this.getEmployeeTrees();
    });
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    this.handler();
  }

  getEmployeeTrees(type = '', keyWord = '') {
    this.isLoading = true;
    this.employeeService.getEmployeeTrees({
      keyWord,
      type
    }).subscribe(employees => {
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

  changeSearch(data) {
    this.getEmployeeTrees('', data);
  }
}
