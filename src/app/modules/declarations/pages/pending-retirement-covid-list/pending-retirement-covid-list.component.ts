import { Component, OnInit } from '@angular/core';

import { DeclarationService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

import { PAGE_SIZE, DECLARATIONS, RESULTSUBMIT } from '@app/shared/constant';
import { DocumentFormComponent } from '@app/shared/components';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

@Component({
  selector: 'app-pending-retirement-covid-list',
  templateUrl: './pending-retirement-covid-list.component.html',
  styleUrls: ['./pending-retirement-covid-list.component.less', '../reduction-labor-list/reduction-labor-list.component.less']
})
export class PendingRetirementCovidListComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: Declaration[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  year: any = null;
  declarations: Declaration[] = [];
  total: number;
  orderby: string = '';
  orderType: string = '';
  skip: number;
  selectedPage: number = 1;
  declarationCode: string = '600d';
  declarationName: string;

  keyword: string = '';
  status: any = RESULTSUBMIT;
  filter: any = {};
  param: any = {
    createDate: '',
    documentNo: '',
    declarationName: '',
    sendDate: '',
    status: ''
  };

  constructor(
    private declarationService: DeclarationService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.year = new Date();
    this.declarationName = this.getDeclaration(this.declarationCode).value;
    this.getDeclarations();
  }

  getDeclarations(skip = 0, take = PAGE_SIZE) {
    
    this.declarationService.getDeclarations(
      {
        ...this.filter,
        orderby: this.orderby,
        orderType: this.orderType,
        documentType: this.declarationCode,
        year: this.getYear(),
        skip,       
        take
      }).subscribe(res => {
      this.declarations = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= PAGE_SIZE;
        this.selectedPage -= 1;

        this.getDeclarations(this.skip);
      }
    });
  }

  getYear() {

    if(moment(this.year,"YYYY").isValid()) {
      return  moment(this.year).format("YYYY");
    }

    return null;
  }

  handleFilter(key) {

    if (key === 'createDate' || key === 'sendDate') {
      if(moment(this.param[key],"DD/MM/YYYY").isValid()) {
        this.filter[key] = moment(this.param[key]).format("DD/MM/YYYY");
      } else {
        this.filter[key] = '';
      }
    } else {
      this.filter[key] = this.param[key];
    }
    
    this.selectedPage = 1;
    this.getDeclarations();
  }

  sort(event) {
    this.orderby = event.key;
    this.orderType = event.value;
    this.getDeclarations();
  }

  pageChange({ skip, page }) {
    this.skip = skip;
    this.selectedPage = page;

    this.getDeclarations(skip);
  }

  delete(id) {
    this.declarationService.delete(id).subscribe(() => {
      this.getDeclarations(this.skip);
    });
  }

  viewDocument(declarationInfo: any) {

    if(declarationInfo.status === 0) {
      this.showMessageNotView();
    } else {
      this.showViewDeclarationFile(declarationInfo);
    }
  }

  private showViewDeclarationFile(declarationInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Thông tin biểu mẫu, tờ khai đã xuất',
      nzContent: DocumentFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        declarationInfo
      }
    });

    modal.afterClose.subscribe(result => {
    });
  }

  private showMessageNotView() {
    const modal = this.modalService.warning({
      nzTitle: 'Thông báo',
      nzContent: 'Hồ sơ đang ở trạng thái lưu tạm thời nên không thể xem tờ khai'
    });
  }

  getDeclaration(declarationCode: string) {
    const declarations = DECLARATIONS.find(d => d.key === declarationCode);
    return declarations;
  }

  onChangeYear () {
    if(!moment(this.year,"YYYY").isValid()) {
      this.year = '';
      return;
    }
    this.getDeclarations();
  }

}
