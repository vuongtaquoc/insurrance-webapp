import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { AuthenticationService, EmployeeService } from '@app/core/services';

import {
  LayoutComponent,
  AuthLayoutComponent
} from './layout';

import {
  InputLabelComponent,
  UsersTreeComponent
} from './components';

import {
  CardFullHeightDirective,
  PageSplitFullHeightDirective
} from './directives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NzDropDownModule,
    NzIconModule,
    NzInputModule,
    NzTreeModule
  ],
  declarations: [
    LayoutComponent,
    AuthLayoutComponent,
    InputLabelComponent,
    UsersTreeComponent,
    CardFullHeightDirective,
    PageSplitFullHeightDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputLabelComponent,
    UsersTreeComponent,
    CardFullHeightDirective,
    PageSplitFullHeightDirective
  ],
  providers: [
    AuthenticationService,
    EmployeeService
  ],
  entryComponents: []
})
export class SharedModule {}
