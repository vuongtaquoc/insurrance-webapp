import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthenticationService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { PERMISSIONS } from '@app/shared/constant';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isLoading = false;
  private permissions: any = {};
  private handlers: any = [];
  pmsConf = PERMISSIONS;

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
      }),
      eventEmitter.on('saveData:error', (message) => {
        this.modalService.warning({
          nzTitle: message
        });
      })

    ];

    this.setPermissions();
  }

  setPermissions() {
    const authServiceOfUser = this.authService.currentCredentials.role;
    if (authServiceOfUser) {
        const userPermissions = authServiceOfUser.permission;

        this.permissions = {};
        userPermissions.forEach((screenName) => {
            this.permissions[screenName] = true;
        });
    }
  }
  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/auth/login'], { replaceUrl: true });
  }
}
