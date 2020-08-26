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
   

  ngOnInit() {
    if (!this.departments.length) {
      this.loadDefaultData();
    }
  }

  ngOnChanges(changes) {
   
  }

  private loadDefaultData() {
    for (let i = 1; i <= 4; i++) {
      this.departments.push({
        code: '',
        name: ''
      });
    }
  }

  addRow() {

    this.departments.push({
      code: '',
      name: ''
    });
  }


}
