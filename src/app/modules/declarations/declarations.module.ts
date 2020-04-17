import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import {
  AuthenticationService,
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService
} from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { DeclarationsRoutingModule } from './declarations-routing.module';

import {
  IncreaseLaborListComponent,
  IncreaseLaborAddComponent,
  IncreaseLaborEditComponent,
  RegimeApprovalListComponent
} from './pages';

import {
  TableEditorComponent,
  DocumentTableComponent,
  DocumentListTableComponent,
  IncreaseLaborComponent,
  HealthRecoveryComponent,
  MaternityComponent,
  RegimeApprovalComponent,
  SicknessesComponent,
  DeclarationSidebarComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzPaginationModule,
    NzSpinModule,
    NzTableModule,
    NzTabsModule,
    NzGridModule,
    NzCheckboxModule,
    DeclarationsRoutingModule,
    SharedModule,
  ],
  declarations: [
    IncreaseLaborListComponent,
    IncreaseLaborAddComponent,
    IncreaseLaborEditComponent,
    TableEditorComponent,
    DocumentTableComponent,
    DocumentListTableComponent,
    IncreaseLaborComponent,
    RegimeApprovalListComponent,
    HealthRecoveryComponent,
    MaternityComponent,
    RegimeApprovalComponent,
    SicknessesComponent,
    DeclarationSidebarComponent
  ],
  providers: [
    AuthenticationService,
    CityService,
    DistrictService,
    DeclarationService,
    HospitalService,
    NationalityService,
    PeopleService,
    WardsService
  ],
  entryComponents: []
})
export class DeclarationsModule { }
