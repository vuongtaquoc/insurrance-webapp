import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from '@app/shared/layout';
import {
  AuthLoginComponent,
  RequestResetPasswordComponent,
  RequestResetSuccessComponent,
  ResetPasswordComponent,
  ResetSuccessComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: AuthLoginComponent },
      { path: 'forgot', component: RequestResetPasswordComponent },
      { path: 'forgot-success', component: RequestResetSuccessComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: 'reset-success', component: ResetSuccessComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
