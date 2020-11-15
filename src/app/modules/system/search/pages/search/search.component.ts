import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_SIZE, GENDER } from '@app/shared/constant';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  previous: string = "<<";

  years: any[] = [2017, 2018, 2019, 2020];
  months: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
  ) { }


  ngOnInit() {

  }
}
