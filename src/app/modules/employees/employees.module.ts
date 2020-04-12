import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

import { AuthenticationService, EmployeeService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import {
  EmployeeListComponent
} from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzTableModule,
    SharedModule,
    EmployeesRoutingModule,
  ],
  declarations: [
    EmployeeListComponent
  ],
  providers: [
    AuthenticationService,
    EmployeeService
  ],
  entryComponents: []
})
export class EmployeesModule { }
