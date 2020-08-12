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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { StaffsRoutingModule } from './staffs-routing.module';
import { StaffsListComponent, StaffsSaveComponent, StaffsPersmissonComponent } from './pages';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StaffsRoutingModule,
        NzButtonModule,
        NzDatePickerModule,
        NzFormModule,
        NzInputModule,
        NzGridModule,
        NzSelectModule,
        NzTableModule,
        NzRadioModule,
        NzIconModule,
        NzCheckboxModule,
        SharedModule,
        NgxMaskModule.forRoot()
    ],
    declarations: [
        StaffsListComponent,
        StaffsSaveComponent,
        StaffsPersmissonComponent
    ],
    providers: [
        AuthenticationService
    ],
    entryComponents: []
})
export class StaffsModule { }
