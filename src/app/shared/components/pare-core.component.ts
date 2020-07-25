import { HostListener, Injector } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

declare var window: any;

export class PageCoreComponent {
  private isUnsavedChanges = false;

  constructor(
    public injector: Injector,
  ) {
  }

  @HostListener('window:beforeunload', ['$event'])
  unload($event: any) {
    if (this.isUnsavedChanges) {
      $event.returnValue = true;
    }
  }

  canDeactivate(): Promise<any> | boolean {
    if (this.isUnsavedChanges) {
      return this.confirm();
    }

    return true;
  }

  setIsUnsavedChanges(isUnsavedChanges: boolean) {
    this.isUnsavedChanges = isUnsavedChanges;
  }

  private async confirm() {
    return new Promise((resolve, reject) => {
      const modalService = this.injector.get(NzModalService);

      modalService.confirm({
        nzTitle: 'Bạn chắc chắc muốn rời khỏi trang?',
        nzContent: 'Bạn có 1 vài thay đổi chưa được lưu lại',
        nzOkText: 'Có',
        nzCancelText: 'Không',
        nzOnCancel: () => {
          resolve(false);
        },
        nzOnOk: () => {
          resolve(true);
        }
      });
    });
  }
}
