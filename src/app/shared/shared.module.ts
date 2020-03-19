import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  LayoutComponent
} from './layout';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    // FormsModule,
    // ReactiveFormsModule
  ],
  declarations: [
    LayoutComponent
  ],
  exports: [
    // FormsModule,
    // ReactiveFormsModule
  ],
  entryComponents: []
})
export class SharedModule {}
