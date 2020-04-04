import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  AuthenticationService,
  DeclarationService,
  EmployeeService,
  NavigationService,
  DocumentTypeService,
  CompanyService,
  GroupCompanyService,
  SalaryAreaService,
  WardsService,
  CityService
} from './services';

@NgModule({
  imports: [],
  providers: [
    AuthenticationService,
    DocumentTypeService,
    CompanyService ,
    DeclarationService,
    EmployeeService,
    GroupCompanyService,
    SalaryAreaService,
    WardsService,
    CityService,
    NavigationService
  ],
  declarations: []
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error('You should import core module only in the root module');
    }
  }
}
