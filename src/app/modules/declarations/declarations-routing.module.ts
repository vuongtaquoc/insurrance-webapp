import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '@app/shared/layout';
import {
  IncreaseLaborAddComponent,
  IncreaseLaborListComponent,
  IncreaseLaborEditComponent,
  RegimeApprovalListComponent,
  RegimeApprovalAddComponent,
  RegimeApprovalEditComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'increase-labor/add',
        component: IncreaseLaborAddComponent
      },
      {
        path: 'increase-labor/:id/edit',
        component: IncreaseLaborEditComponent
      },
      {
        path: 'increase-labor',
        component: IncreaseLaborListComponent
      },
      {
        path: 'regime-approval',
        component: RegimeApprovalListComponent
      },
      {
        path: 'regime-approval/add',
        component: RegimeApprovalAddComponent
      },
      {
        path: 'regime-approval/:id/edit',
        component: RegimeApprovalEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
