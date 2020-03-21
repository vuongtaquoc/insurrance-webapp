import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { DocumentListComponent } from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CategoriesRoutingModule,
    SharedModule
  ],
  declarations: [
    DocumentListComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class CategoriesModule { }
