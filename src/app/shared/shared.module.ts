import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';

import {
  LayoutComponent,
  AuthLayoutComponent
} from './layout';

import { InputLabelComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    InputTextModule,
    MenuModule
  ],
  declarations: [
    LayoutComponent,
    AuthLayoutComponent,
    InputLabelComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputLabelComponent
  ],
  entryComponents: []
})
export class SharedModule {}
