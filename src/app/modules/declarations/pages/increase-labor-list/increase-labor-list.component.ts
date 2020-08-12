import { Component, OnInit } from '@angular/core';

import { DeclarationService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

import { PAGE_SIZE, DECLARATIONS } from '@app/shared/constant';
import { DocumentFormComponent } from '@app/shared/components';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-increase-labor-list',
  templateUrl: './increase-labor-list.component.html',
  styleUrls: ['./increase-labor-list.component.less']
})
export class IncreaseLaborListComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: Declaration[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  year: any = null;
  declarations: Declaration[] = [];
  total: number;
  skip: number;
  selectedPage: number = 1;
  declarationCode: string = '600';
  declarationName: string;

  constructor(
    private declarationService: DeclarationService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.declarationName = this.getDeclaration(this.declarationCode).value;
    this.getDeclarations();
  }

  getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.declarationService.getDeclarations({
      documentType: this.declarationCode,
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

  pageChange({ skip, page }) {
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

}
