import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PAGE_SIZE } from '@app/shared/constant';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent {
  @Input() total: number;
  @Input() selected: number = 1;
  @Output() onPageChange: EventEmitter<any> = new EventEmitter();

  pageChange(page) {
    const skip = page === 1 ? 0 : (page - 1) * PAGE_SIZE;

    this.onPageChange.emit({
      skip,
      page
    });
  }
}
