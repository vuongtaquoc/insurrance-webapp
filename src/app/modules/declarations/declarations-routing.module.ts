import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthorizeGuard, UnsavedChangesGuard, NavigationGuard } from '@app/core/guards';
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
  CompanyChangetListComponent,
  CompanyChangeAddComponent,
  CompanyChangeEditComponent,
  ReissueHealthCardListComponent,
  ReissueHealthCardAddComponent,
  ReissueHealthCardEditComponent
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
        },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'increase-labor/:id/edit',
        component: IncreaseLaborEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
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
        component: RegimeApprovalAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'regime-approval/:id/edit',
        component: RegimeApprovalEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
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
      },
      {
        path: 'company-change',
        component: CompanyChangetListComponent
      },
      {
        path: 'company-change/add',
        component: CompanyChangeAddComponent
      },
      {
        path: 'company-change/:id/edit',
        component: CompanyChangeEditComponent
      },
      {
        path: 'health-insurance-card',
        component: ReissueHealthCardListComponent
      },
      {
        path: 'health-insurance-card/add',
        component: ReissueHealthCardAddComponent
      },
      {
        path: 'health-insurance-card/:id/edit',
        component: ReissueHealthCardEditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
