import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticationService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  private handlers: any = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthenticationService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.handlers = [
      eventEmitter.on('loading:open', (isLoading = false) => {
        this.isLoading = isLoading;
      }),
      eventEmitter.on('saveData:loading', (display) => {
        this.isLoading = display;
      }),
      eventEmitter.on('authencation:error', (show) => {
        this.modalService.warning({
          nzTitle: 'Bạn không có quyền truy cập trang này'
        });
      })
    ];
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
