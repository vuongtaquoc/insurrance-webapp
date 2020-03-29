import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

import { AuthenticationService } from '@app/core/services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  menuItems: MenuItem[] = [];

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    this.translateService.get([
      'common.headerMenu.setting',
      'common.headerMenu.logout'
    ]).subscribe(text => {
      this.menuItems = [
        {
          label: text['common.headerMenu.setting'],
          icon: 'pi pi-fw pi-cog'
        }, {
          label: text['common.headerMenu.logout'],
          icon: 'pi pi-fw pi-sign-out',
          command: (event) => {
            event.originalEvent.preventDefault();

            this.authService.logout();
            this.router.navigate(['/auth/login'], { replaceUrl: true });
          }
        }
      ];
    });

  }
}
