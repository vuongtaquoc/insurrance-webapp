import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import {
  AuthenticationService,
  CityService,
  DistrictService,
  DeclarationService,
  EmployeeService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService
} from '@app/core/services';

import {
  LayoutComponent,
  AuthLayoutComponent
} from './layout';

import {
  InputLabelComponent,
  UsersTreeComponent,
  EmployeeFormComponent,
  EmployeeProcessTableComponent,
  EmployeeFamilyTableComponent
} from './components';

import {
  CardFullHeightDirective,
  EditorAutoSizeDirective
} from './directives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzButtonModule,
    NzDatePickerModule,
    NzDropDownModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
    NzSelectModule,
    NzRadioModule,
    NzTabsModule,
    NzTreeModule
  ],
  declarations: [
    LayoutComponent,
    AuthLayoutComponent,
    EmployeeFormComponent,
    EmployeeProcessTableComponent,
    EmployeeFamilyTableComponent,
    InputLabelComponent,
    UsersTreeComponent,
    CardFullHeightDirective,
    EditorAutoSizeDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EmployeeFormComponent,
    InputLabelComponent,
    UsersTreeComponent,
    CardFullHeightDirective,
    EditorAutoSizeDirective
  ],
  providers: [
    AuthenticationService,
    CityService,
    DistrictService,
    DeclarationService,
    EmployeeService,
    HospitalService,
    NationalityService,
    PeopleService,
    WardsService
  ],
  entryComponents: [
    EmployeeFormComponent
  ]
})
export class SharedModule {}
