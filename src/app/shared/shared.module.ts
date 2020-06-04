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
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
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
  WardsService,
  FileUploadEmitter
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
  EmployeeFamilyTableComponent,
  EmployeeHospitalRegisterFormComponent,
  DocumentFormComponent,
  DocumentTableComponent,
  PaginationComponent,
  ButtonDeleteComponent,
  TableEditorErrorsComponent
} from './components';

import {
  CardFullHeightDirective,
  EditorAutoSizeDirective,
  PluploadDirective
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
    NzInputNumberModule,
    NzModalModule,
    NzSelectModule,
    NzSpinModule,
    NzRadioModule,
    NzCheckboxModule,
    NzPaginationModule,
    NzTabsModule,
    NzTreeModule,
    NzTableModule
  ],
  declarations: [
    LayoutComponent,
    AuthLayoutComponent,
    EmployeeFormComponent,
    EmployeeProcessTableComponent,
    EmployeeFamilyTableComponent,
    EmployeeHospitalRegisterFormComponent,
    DocumentFormComponent,
    DocumentTableComponent,
    InputLabelComponent,
    UsersTreeComponent,
    PaginationComponent,
    ButtonDeleteComponent,
    TableEditorErrorsComponent,
    CardFullHeightDirective,
    EditorAutoSizeDirective,
    PluploadDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    EmployeeFormComponent,
    DocumentFormComponent,
    InputLabelComponent,
    UsersTreeComponent,
    PaginationComponent,
    ButtonDeleteComponent,
    TableEditorErrorsComponent,
    CardFullHeightDirective,
    EditorAutoSizeDirective,
    PluploadDirective
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
    WardsService,
    FileUploadEmitter
  ],
  entryComponents: [
    EmployeeFormComponent,
    EmployeeHospitalRegisterFormComponent,
    DocumentFormComponent,
    TableEditorErrorsComponent
  ]
})
export class SharedModule {}
