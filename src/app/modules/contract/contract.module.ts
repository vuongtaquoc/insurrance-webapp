import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { ContractRoutingModule } from './contract-routing.module';
import { ContractComponent, ContractEditComponent } from './pages';

import {
  TableEditorComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContractRoutingModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzTableModule,
    NzRadioModule,
    NzIconModule,
    SharedModule     
  ],
  declarations: [
    ContractComponent,
    ContractEditComponent,
    TableEditorComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class ContractModule { }
