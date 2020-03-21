import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isSidebarActivated: boolean = false;
  isSidebarStatic: boolean = false;

  handleActiveSidebar(active) {
    this.isSidebarActivated = !!active;
  }

  handleStaticSidebar(event) {
    this.isSidebarStatic = !this.isSidebarStatic;
  }
}
