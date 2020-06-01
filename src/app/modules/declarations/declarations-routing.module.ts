import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '@app/shared/layout';
import {
  IncreaseLaborAddComponent,
  IncreaseLaborListComponent,
  IncreaseLaborEditComponent,
  RegimeApprovalListComponent,
  RegimeApprovalAddComponent,
  RegimeApprovalEditComponent,
  ReductionLaborListComponent,
  ReductionLaborAddComponent,
  ReductionLaborEditComponent,
  AdjustListComponent,
  AdjustAddComponent,
  AdjustEditComponent,
  ArrearsEditComponent,
  ArrearsAddComponent,
  ArrearsListComponent,
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
        path: 'reduction-labor',
        component: ReductionLaborListComponent
      },
      {
        path: 'reduction-labor/add',
        component: ReductionLaborAddComponent
      },
      {
        path: 'reduction-labor/:id/edit',
        component: ReductionLaborEditComponent
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
      },
      {
        path: 'arrears',
        component: ArrearsListComponent
      },
      {
        path: 'arrears/add',
        component: ArrearsAddComponent
      },
      {
        path: 'arrears/:id/edit',
        component: ArrearsEditComponent
      },{
        path: 'adjust',
        component: AdjustListComponent
      },
      {
        path: 'adjust/add',
        component: AdjustAddComponent
      },
      {
        path: 'adjust/:id/edit',
        component: AdjustEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
