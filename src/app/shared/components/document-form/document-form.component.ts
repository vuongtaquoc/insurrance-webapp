import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { DATE_FORMAT } from '@app/shared/constant';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent implements OnInit {
  @Input() employee: any = {};
  documentlist: any[] = [];
  documentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
  ) {}

  ngOnInit() {
    const employee = this.employee;
    console.log(employee);
    this.documentlist = employee;
    this.documentForm = this.formBuilder.group({
      
    });
  }

  save(): void {
  }

  handleChangeProcessTable({ records, columns }) {
    // const documentlist = [];

    // records.forEach(record => {
    //   documentlist.push(this.arrayToProps(record, columns));
    // });

    // this.documentlist = documentlist;
  }

  handleDeleteProcessData({ rowNumber, numOfRows }) {
    const documentlist = [ ...this.documentlist ];

    documentlist.splice(rowNumber, numOfRows);

    this.updateOrders(documentlist);

    this.documentlist = documentlist;
  }

  private updateOrders(data) {
    const order: { index: 0 } = { index: 0 };

    data.forEach((d, index) => {
      order.index += 1;

      d.orders = order.index;
    });
  }

  dismiss(): void {
    this.modal.destroy();
  }
}
