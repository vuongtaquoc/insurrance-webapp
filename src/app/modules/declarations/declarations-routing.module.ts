import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizeGuard } from '@app/core/guards';
import { PERMISSIONS } from '@app/shared/constant';
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
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.increase_labor.C
        }
      },
      {
        path: 'increase-labor/:id/edit',
        component: IncreaseLaborEditComponent
      },
      {
        path: 'increase-labor',
        component: IncreaseLaborListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.R
        }
      },
      {
        path: 'reduction-labor',
        component: ReductionLaborListComponent
      },
      {
        path: 'reduction-labor/add',
        component: ReductionLaborAddComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.C
        }
      },
      {
        path: 'reduction-labor/:id/edit',
        component: ReductionLaborEditComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.U
        }
      },
      {
        path: 'regime-approval',
        component: RegimeApprovalListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.regime_approval.R
        }
      },
      {
        path: 'regime-approval/add',
        component: RegimeApprovalAddComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.regime_approval.C
        }
      },
      {
        path: 'regime-approval/:id/edit',
        component: RegimeApprovalEditComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.regime_approval.U
        }
      },
      {
        path: 'arrears',
        component: ArrearsListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.R
        }
      },
      {
        path: 'arrears/add',
        component: ArrearsAddComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.C
        }
      },
      {
        path: 'arrears/:id/edit',
        component: ArrearsEditComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.U
        }
      },{
        path: 'adjust',
        component: AdjustListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.R
        }
      },
      {
        path: 'adjust/add',
        component: AdjustAddComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.C
        }
      },
      {
        path: 'adjust/:id/edit',
        component: AdjustEditComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.arrears.U
        }
      },{
        path: 'adjust-general',
        component: AdjustGeneralListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.adjust_general.R
        }
      },
      {
        path: 'adjust-general/add',
        component: AdjustGeneralAddComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.adjust_general.C
        }
      },
      {
        path: 'adjust-general/:id/edit',
        component: AdjustGeneralEditComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.adjust_general.U
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
