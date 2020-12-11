import { Component, OnInit } from '@angular/core';

import { DeclarationService,DeclarationConfigService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

import { PAGE_SIZE, RESULTSUBMIT } from '@app/shared/constant';
import { DocumentFormComponent } from '@app/shared/components';
import { NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

@Component({
  selector: 'app-infomation-insurance-card-list',
  templateUrl: './infomation-insurance-card-list.component.html',
  styleUrls: ['./infomation-insurance-card-list.component.less', '../reduction-labor-list/reduction-labor-list.component.less']
})
export class InfomationInsuranceCardListComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: Declaration[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  year: any = null;
  declarations: Declaration[] = [];
  total: number;
  skip: number;
  orderby: string = '';
  orderType: string = '';
  selectedPage: number = 1;
  declarationCode: string = '608';
  declarationName: string;
  status: any = RESULTSUBMIT;
  keyword: string = '';
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
    private declarationConfigService: DeclarationConfigService,
  ) {}

  ngOnInit() {
    this.year = new Date();
    this.loadDeclarationConfig();
    this.getDeclarations();
  }

  getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.declarationService.getDeclarations({
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
    this.selectedPage = page;
    this.skip = skip;
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

  private loadDeclarationConfig() {
    this.declarationConfigService.getDetailByCode(this.declarationCode).subscribe(data => {
       this.declarationName = data.declarationName;      
    });
  }

  onChangeYear () {
    if(!moment(this.year,"YYYY").isValid()) {
      this.year = '';
      return;
    }
    this.getDeclarations();
  }
}
