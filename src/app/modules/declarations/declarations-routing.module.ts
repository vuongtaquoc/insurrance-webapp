import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizeGuard } from '@app/core/guards';

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
  AdjustGeneralListComponent,
  AdjustGeneralAddComponent,
  AdjustGeneralEditComponent,
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'increase-labor/add',
        component: IncreaseLaborAddComponent,
        // check permission
        // canActivate: [ AuthorizeGuard ],
        data: {
          // expectedPermission: 'substituteInvoice_U'
        }
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
      },{
        path: 'adjust-general',
        component: AdjustGeneralListComponent
      },
      {
        path: 'adjust-general/add',
        component: AdjustGeneralAddComponent
      },
      {
        path: 'adjust-general/:id/edit',
        component: AdjustGeneralEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
