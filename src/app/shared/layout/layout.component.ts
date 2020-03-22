import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  isSidebarActivated: boolean = false;
  isSidebarStatic: boolean = false;
  menuItems: MenuItem[] = [];

  constructor(private translateService: TranslateService) {
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
          icon: 'pi pi-fw pi-sign-out'
        }
      ];
    });

  }

  handleActiveSidebar(active) {
    this.isSidebarActivated = !!active;
  }

  handleStaticSidebar(event) {
    this.isSidebarStatic = !this.isSidebarStatic;
  }
}
