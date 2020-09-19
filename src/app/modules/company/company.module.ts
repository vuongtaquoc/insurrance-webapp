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
import { NzRadioModule } from 'ng-zorro-antd/radio';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent, CompanyEditComponent } from './pages';

import {
  TableEditorComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzGridModule,
    NzSelectModule,
    NzTableModule,
    NzRadioModule,
    SharedModule,
    NgxMaskModule.forRoot()    
  ],
  declarations: [
    CompanyComponent,
    CompanyEditComponent,
    TableEditorComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class CompanyModule { }
