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
import { ProductsRoutingModule } from './products-routing.module';
import { ProductsListComponent, ProductsSaveComponent } from './pages';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ProductsRoutingModule,
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
        ProductsListComponent,
        ProductsSaveComponent
    ],
    providers: [
        AuthenticationService
    ],
    entryComponents: []
})
export class ProductsModule { }
