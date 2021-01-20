import { Component, Input } from '@angular/core';

const TABLES = {
  increaseLabor: 'D02-LT',
  families: 'TK1-TS',
  family: 'TK1-TS',
  informations: 'D01-TS',
  maternityPart1: 'Thai sản - Phần 1',
  maternityPart2: 'Thai sản - Phần 2',
  sicknessesPart1: 'Ốm đau - Phần 1',
  sicknessesPart2: 'Ốm đau - Phần 2',
  healthRecoveryPart1: 'Sức khỏe - Phần 1',
  healthRecoveryPart2: 'Sức khỏe - Phần 2',
  increaselabor601: 'D02-LT Tăng',
  increaselabor600: 'D02-LT Tăng',
  reductionlabor601: 'D02-LT Giảm',
  reductionlabor600a: 'D02-LT',
  adjustment601: 'D02-LT',
  adjustment600b: 'D02-LT',
  adjustment601a: 'D02-LT',
  family601: 'TK1-TS',
  family600: 'TK1-TS',
  healthInsuranceCard: 'TK1-TS',
  healthFomError: 'Thông tin kê khai',
  documentList601: 'D01-TS',
  documentList: 'D01-TS',
  documentList600: 'D01-TS',
  documentList600a: 'D01-TS',
  documentList600b: 'D01-TS',
  documentList601a: 'D01-TS',
  generalFomError: 'Thông tin tờ khai',
  documentFomError: 'Danh mục tài liệu',
  pending600c: 'D02-TL',
  documentList600c: 'D01-TS',
  pendingCovid600d: 'D02-TL',
  documentList600d: 'D01-TS',
  allocationCard: 'D03-TS',
  reissuehealthinsurancecard610: 'D02-TL',
  registerInsuranceRequired: 'TK1-TS',
  returnPaymentOrganization: 'TK1-TS',
  returnPayment: 'TK1-TS',
  documentList610: 'D01-TS',
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
