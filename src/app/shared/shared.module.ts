import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TreeModule } from 'primeng/tree';

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
    DropdownModule,
    InputTextModule,
    MenuModule,
    TreeModule
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
