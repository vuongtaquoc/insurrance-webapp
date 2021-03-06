import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { errorMessages } from '@app/shared/constant';
 
@Component({
  selector: 'app-import-errors',
  templateUrl: './import-errors.component.html',
  styleUrls: ['./import-errors.component.less']
})

export class TableInportErrorsComponent implements OnInit {
  showDetail: boolean = true;
  data: any = [];
  @Input() errors: any = {};

  ngOnInit() {
    this.buildData();
  }
  buildData() {
    this.errors.rowError.forEach(item => {
      this.data.push({
        column: item.column,
        order: item.row,
        errorMessages: errorMessages[item.errorCode]
      });
    });
  }
  showMore() {
    this.showDetail = false;
  }
}
