import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { CompaniesRoutingModule } from './companies-routing.module';
import { CompaniesComponent, CompanyEidtComponent } from './pages';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompaniesRoutingModule,
    SharedModule,
    CheckboxModule,
    ButtonModule,
    DropdownModule,
    RadioButtonModule
  ],
  declarations: [
    CompaniesComponent,
    CompanyEidtComponent    
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class CompaniesModule { }
