import { Component, ViewEncapsulation, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit, OnChanges {
  @Input() departments: any = [];
  rows: any[] = [];

  ngOnInit() {
    if (!this.rows.length) {
      this.loadDefaultData();
    }
  }

  ngOnChanges(changes) {
   
  }

  private loadDefaultData() {
    for (let i = 1; i <= 10; i++) {
      this.rows.push({
        no: i,
        rowId: uuid.v4(),
        departmentCode: '',
        departmentName: ''
      });
    }
  }

}
