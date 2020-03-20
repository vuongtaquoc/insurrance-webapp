import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

import {
  AuthLoginComponent,
  RequestResetPasswordComponent,
  RequestResetSuccessComponent,
  ResetPasswordComponent,
  ResetSuccessComponent
} from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule
  ],
  declarations: [
    AuthLoginComponent,
    RequestResetPasswordComponent,
    RequestResetSuccessComponent,
    ResetPasswordComponent,
    ResetSuccessComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class AuthModule { }
