import { Component, Input } from '@angular/core';

const TABLES = {
  increaseLabor: 'D02-TS',
  families: 'PL TVHGD-NLD',
  family: 'PL TVHGD-NLD',
  informations: 'Bảng kê hồ sơ',
  maternityPart1: 'Thai sản - Phần 1',
  maternityPart2: 'Thai sản - Phần 2',
  sicknessesPart1: 'Ốm đau - Phần 1',
  sicknessesPart2: 'Ốm đau - Phần 2',
  healthRecoveryPart1: 'Sức khỏe - Phần 1',
  healthRecoveryPart2: 'Sức khỏe - Phần 2',
  increaselabor601: 'D02-TS Tăng',
  increaselabor600: 'D02-TS Tăng',
  reductionlabor601: 'D02-TS Giảm',
  reductionlabor600a: 'D02-TS Giảm',
  adjustment601: 'D02-TS Điều chỉnh',
  adjustment600b: 'D02-TS Điều chỉnh',
  adjustment601a: 'D02-TS Điều chỉnh',
  family601: 'PL TVHGD-NLD',
  family600: 'PL TVHGD-NLD',
  healthInsuranceCard: 'CLT-KTDTT',
  healthFomError: 'Thông tin kê khai',
  documentList601: 'Bảng kê hồ sơ',
  documentList: 'Bảng kê hồ sơ',
  documentList600: 'Bảng kê hồ sơ',
  documentList600a: 'Bảng kê hồ sơ',
  documentList600b: 'Bảng kê hồ sơ',
  documentList601a: 'Bảng kê hồ sơ',
  generalFomError: 'Thông tin tờ khai',
  documentFomError: 'Danh mục tài liệu',
  pending600c: 'D02-TL',
  documentList600c: 'Bảng kê hồ sơ',
  pendingCovid600d: 'D02-TL',
  documentList600d: 'Bảng kê hồ sơ',
  allocationCard: 'Bảng kê D03-TS',
  reissuehealthinsurancecard610: 'D02-TL',
  registerInsuranceRequired: 'TK1-TS',
  returnPaymentOrganization: 'TK1-TS',
  returnPayment: 'TK1-TS',
  documentList610: 'Bảng kê hồ sơ',
};

@Component({
  selector: 'app-table-editor-errors',
  templateUrl: './table-editor-errors.component.html',
  styleUrls: ['./table-editor-errors.component.less']
})
export class TableEditorErrorsComponent {
  showDetail: boolean = true;
  @Input() errors: any = {};

  keys() {
    return Object.keys(this.errors);
  }

  getTableName(key) {
    return TABLES[key];
  }
  
  showMore() {
    this.showDetail = false;
  }
}
