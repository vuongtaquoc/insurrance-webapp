import { Component, OnInit } from '@angular/core';

import { SelectItem } from '@app/core/interfaces';
import { SubmitDeclarationService } from '@app/core/services';
import { PAGE_SIZE, DECLARATIONRESULT} from '@app/shared/constant';

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
  toDate: any;
  status: any = DECLARATIONRESULT;
  constructor(
    private submitDeclarationService: SubmitDeclarationService,
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
}
