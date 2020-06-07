import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';

import { EmployeeService } from '@app/core/services';

@Component({
  selector: 'app-sidebar-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DeclarationSidebarSearchComponent implements OnInit, OnDestroy {
  searchType: string = '1';
  text: string = '';

  constructor(private modal: NzModalRef) {}

  ngOnInit() {

  }

  ngOnDestroy() {

  }

  dismiss() {
    this.modal.destroy();
  }

  search() {
    this.modal.destroy({
      searchType: this.searchType,
      keywords: this.text.split('\n')
    });
  }
}
