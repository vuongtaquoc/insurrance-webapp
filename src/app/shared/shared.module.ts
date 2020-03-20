import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import {
  LayoutComponent,
  AuthLayoutComponent
} from './layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClarityModule
  ],
  declarations: [
    LayoutComponent,
    AuthLayoutComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ClarityModule
  ],
  entryComponents: []
})
export class SharedModule {}
