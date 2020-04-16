import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-button-delete',
  templateUrl: './button-delete.component.html',
  styleUrls: ['./button-delete.component.less']
})
export class ButtonDeleteComponent {
  @Input() id: any;
  @Output() delete: EventEmitter<any> = new EventEmitter();

  constructor(private modalService: NzModalService) {}

  handleDelete() {
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
      nzOkText: 'Xóa',
      nzCancelText: 'Không',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.delete.emit(this.id);
      }
    });
  }
}
