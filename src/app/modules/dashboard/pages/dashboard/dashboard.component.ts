import { Component, OnInit } from '@angular/core';

import { SelectItem } from '@app/core/interfaces';
import { SubmitDeclarationService, ExternalService } from '@app/core/services';
import { PAGE_SIZE, DECLARATIONRESULT} from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationResultComponent } from '@app/shared/components';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  total: number;
  skip: number;
  selectedPage: number = 1;
  declarations: any[] = [];
  pageNumbers: SelectItem[];
  declarationCode: string = '';
  fromDate: any;
  isSpinning: boolean;
  toDate: any;
  status: any = DECLARATIONRESULT;
  constructor(
    private submitDeclarationService: SubmitDeclarationService,
    private modalService: NzModalService,
    private externalService: ExternalService,
  ) {
  }

  ngOnInit() {
    this.pageNumbers = [{
      label: '5',
      value: 5
    }, {
      label: '10',
      value: 10
    }, {
      label: '15',
      value: 15
    }];
    
    this.getDeclarations(this.skip);
  }

  private getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.submitDeclarationService.filter({
      declarationCode: this.declarationCode,
      fromDate: this.fromDate,
      toDate: this.toDate,
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

  handleFormSearch(data) {

    this.declarationCode = data.declarationCode;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.getDeclarations(this.skip);
  }

  viewResult(data) {
    this.loadDeclarationFiles(data);
  }

  private loadDeclarationFiles(declaration) {
    this.isSpinning = true;

    this.externalService.getProcessDeclaration(declaration.id).subscribe(data => {
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

      this.isSpinning = false;

    });
  }
}
