import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    DashboardRoutingModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class DashboardModule { }
