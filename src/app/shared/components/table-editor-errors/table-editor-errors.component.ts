import { Component, Input } from '@angular/core';

const TABLES = {
  increaseLabor: 'D02-TS',
  families: 'PL TVHGD-NLD',
  informations: 'Bảng kê hồ sơ',
  maternityPart1: 'Thai sản - Phần 1',
  maternityPart2: 'Thai sản - Phần 2',
  sicknessesPart1: 'Ốm đau - Phần 1',
  sicknessesPart2: 'Ốm đau - Phần 2',
  healthRecoveryPart1: 'Sức khỏe - Phần 1',
  healthRecoveryPart2: 'Sức khỏe - Phần 2',
  increaselabor601: 'D02-TS Tăng',
  reductionlabor601: 'D02-TS Giảm',
  adjustment601: 'D02-TS Điều chỉnh',
  family601: 'PL TVHGD-NLD',
  documentList601: 'Bảng kê hồ sơ',
};

@Component({
  selector: 'app-table-editor-errors',
  templateUrl: './table-editor-errors.component.html',
  styleUrls: ['./table-editor-errors.component.less']
})
export class TableEditorErrorsComponent {
  @Input() errors: any = {};

  keys() {
    return Object.keys(this.errors);
  }

  getTableName(key) {
    return TABLES[key];
  }
}
