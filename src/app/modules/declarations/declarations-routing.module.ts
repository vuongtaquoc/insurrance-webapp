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
  ReissueHealthCardEditComponent,
  ReissueInsuranceCardListComponent,
  ReissueInsuranceCardAddComponent,
  ReissueInsuranceCardEditComponent,
  HealthRecoveryApprovalListComponent,
  HealthRecoveryApprovalAddComponent,
  HealthRecoveryApprovalEditComponent,
  MaternityApprovalListComponent,
  MaternityApprovalAddComponent,
  MaternityApprovalEditComponent,
  SicknessesApprovalListComponent,
  SicknessesApprovalAddComponent,
  SicknessesApprovalEditComponent,
  PendingRetirementListComponent,
  PendingRetirementAddComponent,
  PendingRetirementEditComponent,
  PendingRetirementCovidListComponent,
  PendingRetirementCovidAddComponent,
  PendingRetirementCovidEditComponent,
  AllocationCardListComponent,
  AllocationCardAddComponent,
  AllocationCardEditComponent,
  RegisterAllocationCardListComponent,
  RegisterAllocationCardAddComponent,
  RegisterAllocationCardEditComponent,
  AdjustmentInsuranceCardAddComponent,
  AdjustmentInsuranceCardEditComponent,
  AdjustmentInsuranceCardListComponent,
  ReissueHealthInsuranceCardAddComponent,
  ReissueHealthInsuranceCardEditComponent,
  ReissueHealthInsuranceCardListComponent,
  InfomationInsuranceCardAddComponent,
  InfomationInsuranceCardEditComponent,
  InfomationInsuranceCardListComponent,
  ReissueInsuranceExpireListComponent,
  ReissueInsuranceExpireAddComponent,
  ReissueInsuranceExpireEditComponent,
  RegisterInsuranceRequiredListComponent,
  RegisterInsuranceRequiredAddComponent,
  RegisterInsuranceRequiredEditComponent,
  ReturnPaymentOrganizationListComponent,
  ReturnPaymentOrganizationAddComponent,
  ReturnPaymentOrganizationEditComponent,
  ReturnPaymentListComponent,
  ReturnPaymentAddComponent,
  ReturnPaymentEditComponent  
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
         // check permission
         canActivate: [ AuthorizeGuard ],
         data: {
           expectedPermission: PERMISSIONS.increase_labor.U
         },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'increase-labor',
        component: IncreaseLaborListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.increase_labor.R
        },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reduction-labor',
        component: ReductionLaborListComponent,
        canActivate: [ AuthorizeGuard ],
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.R
        },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reduction-labor/add',
        component: ReductionLaborAddComponent,
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.C
        },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reduction-labor/:id/edit',
        component: ReductionLaborEditComponent,
        data: {
          expectedPermission: PERMISSIONS.reduction_labor.U
        },
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
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
        component: ArrearsAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'arrears/:id/edit',
        component: ArrearsEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },{
        path: 'adjust',
        component: AdjustListComponent,
      },
      {
        path: 'adjust/add',
        component: AdjustAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'adjust/:id/edit',
        component: AdjustEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },{
        path: 'adjust-general',
        component: AdjustGeneralListComponent
      },
      {
        path: 'adjust-general/add',
        component: AdjustGeneralAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'adjust-general/:id/edit',
        component: AdjustGeneralEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
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
        component: ReissueHealthCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'health-insurance-card/:id/edit',
        component: ReissueHealthCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-insurance-card',
        component: ReissueInsuranceCardListComponent
      },
      {
        path: 'reissue-insurance-card/add',
        component: ReissueInsuranceCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-insurance-card/:id/edit',
        component: ReissueInsuranceCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'sicknesses-approval',
        component: SicknessesApprovalListComponent
      },
      {
        path: 'sicknesses-approval/add',
        component: SicknessesApprovalAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'sicknesses-approval/:id/edit',
        component: SicknessesApprovalEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'health-recovery-approval',
        component: HealthRecoveryApprovalListComponent
      },
      {
        path: 'health-recovery-approval/add',
        component: HealthRecoveryApprovalAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'health-recovery-approval/:id/edit',
        component: HealthRecoveryApprovalEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'maternity-approval',
        component: MaternityApprovalListComponent
      },
      {
        path: 'maternity-approval/add',
        component: MaternityApprovalAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'maternity-approval/:id/edit',
        component: MaternityApprovalEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'pending-retirement',
        component:PendingRetirementListComponent
      },
      {
        path: 'pending-retirement/add',
        component: PendingRetirementAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'pending-retirement/:id/edit',
        component: PendingRetirementEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'pending-retirement-covid',
        component:PendingRetirementCovidListComponent
      },
      {
        path: 'pending-retirement-covid/add',
        component: PendingRetirementCovidAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'pending-retirement-covid/:id/edit',
        component: PendingRetirementCovidEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'allocation-card',
        component:AllocationCardListComponent
      },
      {
        path: 'allocation-card/add',
        component: AllocationCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'allocation-card/:id/edit',
        component: AllocationCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'register-allocation-card',
        component:RegisterAllocationCardListComponent
      },
      {
        path: 'register-allocation-card/add',
        component: RegisterAllocationCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'register-allocation-card/:id/edit',
        component: RegisterAllocationCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'adjustment-insurance-card',
        component: AdjustmentInsuranceCardListComponent
      },
      {
        path: 'adjustment-insurance-card/add',
        component: AdjustmentInsuranceCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'adjustment-insurance-card/:id/edit',
        component: AdjustmentInsuranceCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-health-insurance-card',
        component: ReissueHealthInsuranceCardListComponent
      },
      {
        path: 'reissue-health-insurance-card/add',
        component: ReissueHealthInsuranceCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-health-insurance-card/:id/edit',
        component: ReissueHealthInsuranceCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'infomation-insurance-card',
        component: InfomationInsuranceCardListComponent
      },
      {
        path: 'infomation-insurance-card/add',
        component: InfomationInsuranceCardAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'infomation-insurance-card/:id/edit',
        component: InfomationInsuranceCardEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-insurance-expire',
        component: ReissueInsuranceExpireListComponent
      },
      {
        path: 'reissue-insurance-expire/add',
        component: ReissueInsuranceExpireAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'reissue-insurance-expire/:id/edit',
        component: ReissueInsuranceExpireEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },{
        path: 'register-insurance-required',
        component: RegisterInsuranceRequiredListComponent
      },
      {
        path: 'register-insurance-required/add',
        component: RegisterInsuranceRequiredAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'register-insurance-required/:id/edit',
        component: RegisterInsuranceRequiredEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },{
        path: 'return-payment-organization',
        component: ReturnPaymentOrganizationListComponent
      },
      {
        path: 'return-payment-organization/add',
        component: ReturnPaymentOrganizationAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'return-payment-organization/:id/edit',
        component: ReturnPaymentOrganizationEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },{
        path: 'return-payment',
        component: ReturnPaymentListComponent
      },
      {
        path: 'return-payment/add',
        component: ReturnPaymentAddComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      },
      {
        path: 'return-payment/:id/edit',
        component: ReturnPaymentEditComponent,
        canDeactivate: [ UnsavedChangesGuard, NavigationGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclarationsRoutingModule { }
