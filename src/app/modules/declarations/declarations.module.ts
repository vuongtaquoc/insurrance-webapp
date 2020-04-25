import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
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
  RegimeApprovalListComponent,
  RegimeApprovalAddComponent,
  RegimeApprovalEditComponent
} from './pages';

import {
  TableEditorComponent,
  DocumentTableComponent,
  DocumentListTableComponent,
  DeclarationSidebarComponent,
  IncreaseLaborComponent,
  HealthRecoveryComponent,
  MaternityComponent,
  RegimeApprovalComponent,
  RegimeApprovalFormComponent,
  SicknessesComponent,
  RegimeApprovalEditorComponent
} from './components';

import { RegimeAutoSizeDirective } from './directives';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCollapseModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzPaginationModule,
    NzSelectModule,
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
    DeclarationSidebarComponent,
    IncreaseLaborComponent,
    RegimeApprovalListComponent,
    RegimeApprovalAddComponent,
    RegimeApprovalEditComponent,
    HealthRecoveryComponent,
    MaternityComponent,
    RegimeApprovalComponent,
    RegimeApprovalFormComponent,
    SicknessesComponent,
    RegimeApprovalEditorComponent,
    RegimeAutoSizeDirective
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
