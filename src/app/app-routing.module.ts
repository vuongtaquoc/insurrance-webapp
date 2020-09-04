import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: './modules/auth/auth.module#AuthModule',
  },
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: './modules/categories/categories.module#CategoriesModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'declarations',
    loadChildren: './modules/declarations/declarations.module#DeclarationsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'company',
    loadChildren: './modules/company/company.module#CompanyModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'contract',
    loadChildren: './modules/contract/contract.module#ContractModule',
    canActivate: [AuthGuard],
  },

  {
    path: 'employees',
    loadChildren: './modules/employees/employees.module#EmployeesModule',
    canActivate: [AuthGuard],
  },

  {
    path: 'agencies',
    loadChildren: './modules/agencies/agencies.module#AgenciesModule',
    canActivate: [AuthGuard],
  },

  {
    path: 'customers',
    loadChildren: './modules/customers/customers.module#CustomersModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'account-management',
    loadChildren: './modules/system/accounts-management/accounts.module#AccountsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'products',
    loadChildren: './modules/system/products/products.module#ProductsModule',
    canActivate: [AuthGuard],
  },
  {
    path: 'emails-notification',
    loadChildren: './modules/system/emails-notification/emails-notification.module#EmailsNotificationModule',
    canActivate: [AuthGuard],
  },
   
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
