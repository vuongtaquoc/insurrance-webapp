import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '@app/core/guards';
import { PERMISSIONS } from '@app/shared/constant';

import { LayoutComponent } from '@app/shared/layout';
import {
  EmployeeListComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: EmployeeListComponent,
        // check permission
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.employees.R
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule { }
