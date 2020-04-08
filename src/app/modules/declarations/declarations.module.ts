import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

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
  IncreaseLaborComponent
} from './pages';

import {
  TableEditorComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzTableModule,
    DeclarationsRoutingModule,
    SharedModule,
  ],
  declarations: [
    IncreaseLaborListComponent,
    IncreaseLaborComponent,
    TableEditorComponent
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
