import { Component, OnInit } from '@angular/core';

import { DeclarationService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE } from '@app/shared/constant';
import { DocumentFormComponent } from '@app/shared/components';

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

  constructor(
    private declarationService: DeclarationService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    this.getDeclarations();
  }

  getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.declarationService.getDeclarations({
      documentType: 600,
      skip,
      take
    }).subscribe(res => {
      this.declarations = res.data;
      this.total = res.total;
      this.skip = skip;

      // this.listOfDisplayData = [ ...declarations ];
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

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  onChange(value) {
    console.log(value)
  }

  delete(id) {
    this.declarationService.delete(id).subscribe(() => {
      this.getDeclarations(this.skip);
    });
  }

  viewDocument(declarationInfo: any) {
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
}
