import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent } from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompaniesRoutingModule,
    SharedModule
  ],
  declarations: [
    CompaniesComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class CompaniesModule { }
