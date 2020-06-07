import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

import { AuthenticationService, EmployeeService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { EmployeesRoutingModule } from './employees-routing.module';
import {
  EmployeeListComponent
} from './pages';
import { NzDemoDatePickerFormatComponent} from './pages/month-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzDatePickerModule,
    SharedModule,
    EmployeesRoutingModule,
  ],
  declarations: [
    EmployeeListComponent,
    NzDemoDatePickerFormatComponent
  ],
  providers: [
    AuthenticationService,
    EmployeeService
  ],
  entryComponents: []
})
export class EmployeesModule { }
