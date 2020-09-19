import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
 
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './pages';
import {
  DashboardSearchComponent,
  DashboardIvanComponent,
  DashboardNewsComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzTableModule,
    DashboardRoutingModule,
    SharedModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    DashboardSearchComponent,
    DashboardIvanComponent,
    DashboardNewsComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class DashboardModule { }
