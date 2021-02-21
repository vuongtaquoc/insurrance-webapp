import { Component, OnInit } from '@angular/core';

import { DeclarationService, DeclarationConfigService, ExternalService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

import { PAGE_SIZE, RESULTSUBMIT } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DocumentFormComponent } from '@app/shared/components';
import * as moment from 'moment';
import { DeclarationResultComponent } from '@app/shared/components';

@Component({
  selector: 'app-health-recovery-approval-list',
  templateUrl: './health-recovery-approval-list.component.html',
  styleUrls: ['./health-recovery-approval-list.component.less', '../reduction-labor-list/reduction-labor-list.component.less']
})
export class HealthRecoveryApprovalListComponent implements OnInit {
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
  declarationCode: string = '630c';
  declarationName: string;
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
    private declarationConfigService: DeclarationConfigService,
    private externalService: ExternalService,
  ) { }

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

    if (declarationInfo.status === 0) {
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

  private loadResultOfDeclaration(declaration) {
    if (declaration.documentNo === '' || declaration.documentNo === null) {
      this.modalService.warning({
        nzTitle: 'Chứa có mã số hồ sơ cần tra cứu'
      });
      return;
    }
    
    const docmentNo = this.replace(declaration.documentNo, '/');
    this.externalService.getProcessDeclarationDocNo(docmentNo).subscribe(data => {
      const modal = this.modalService.create({
        nzWidth: 980,
        nzWrapClassName: 'document-modal',
        nzTitle: 'Kết quả xử lý hồ sơ số: ' + data.documentNo,
        nzContent: DeclarationResultComponent,
        nzOnOk: (data) => console.log('Click ok', data),
        nzComponentParams: {
          declarationFileInfo: data,
        }
      });
  
      modal.afterClose.subscribe(result => {
      });
    });
  }

  private replace(strValue, charWillbeRemove) {
    const arrayValue = strValue.split('/');
    let valueAfterReturn = '';
    arrayValue.forEach(element => {
      valueAfterReturn = valueAfterReturn + element;
    });

    return valueAfterReturn;
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
