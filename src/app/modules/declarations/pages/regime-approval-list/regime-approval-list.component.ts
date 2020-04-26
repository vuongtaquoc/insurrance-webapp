import { Component, OnInit } from '@angular/core';

import { DeclarationService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

import { PAGE_SIZE } from '@app/shared/constant';

@Component({
  selector: 'app-regime-approval-list',
  templateUrl: './regime-approval-list.component.html',
  styleUrls: ['./regime-approval-list.component.less']
})
export class RegimeApprovalListComponent implements OnInit {
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
    private declarationService: DeclarationService
  ) {}

  ngOnInit() {
    this.getDeclarations();
  }

  getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.declarationService.getDeclarations({
      documentType: '630',
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
}
