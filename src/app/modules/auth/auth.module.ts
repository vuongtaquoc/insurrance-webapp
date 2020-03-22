import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

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
    ButtonModule,
    CardModule,
    CheckboxModule,
    DropdownModule,
    InputTextModule,
    PasswordModule,
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
