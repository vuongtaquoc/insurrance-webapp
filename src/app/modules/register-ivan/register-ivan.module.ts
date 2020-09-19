import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { RegisterIvanRoutingModule } from './register-ivan-routing.module';
import {
  RegisterIvanComponent
} from './pages';

import { RegisterIvanProvisoComponent, RegisterIvanRegisterComponent, RegisterIvanStopServiceComponent, RegisterIvanGuideComponent } from "./components";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzTableModule,
    NzFormModule,
    NzDatePickerModule,
    NzInputModule,
    SharedModule,
    RegisterIvanRoutingModule,
    NzTabsModule,
    NzSelectModule,
    NzGridModule,
    NzRadioModule,
    NzCollapseModule,
    NgxMaskModule.forRoot()
  ],
  declarations: [
    RegisterIvanComponent,
    RegisterIvanProvisoComponent,
    RegisterIvanStopServiceComponent,
    RegisterIvanRegisterComponent,
    RegisterIvanGuideComponent,
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class RegisterIvanModule { }
