import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { CompanyRoutingModule } from './company-routing.module';
import { CompanyComponent, CompanyEditComponent } from './pages';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompanyRoutingModule,
    SharedModule,
    CheckboxModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule
  ],
  declarations: [
    CompanyComponent,
    CompanyEditComponent    
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class CompanyModule { }
