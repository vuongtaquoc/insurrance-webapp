import { Component, ViewEncapsulation, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DepartmentComponent implements OnInit, OnChanges {
  @Input() table: FormGroup;
  @Input() departments: any = [];
  editIndex: number;
  isError: boolean = false;
  errorTitleCode: string = '';
  errorTitleName: string = '';
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
        id: '',
        name: ''
      });
    }
  }

  addRow() {

    this.departments.push({
      id: '',
      name: ''
    });
  }

  remove(index) {
    this.departments.splice(index, 1);
  }

  codeChange(event, index) {
    let id = event.target.value;
    if (id) {
      this.editIndex = index;
      let codes = this.departments.filter(x => x.id == id);
      if (codes.length > 1) {
        this.isError = true;
        this.errorTitleCode = `Mã ${id} đã tồn tại`;
      }
      else {
        this.errorTitleCode = '';
        this.isError = false;
      }
    } else {
      this.errorTitleCode = '';
      this.isError = false;
    }


  }

}
