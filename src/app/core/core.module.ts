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
  CityService,
  DistrictService,
  WardsService,
  HospitalService,
  NationalityService,
  PeopleService,
  PlanService,
  PaymentStatusServiced,
  RelationshipService,
  BankService,
  DepartmentService,
  VillageService,
  DocumentListService,
  DeclarationFileService,
  SicknessesService,
  AgencieService,
  CustomerService,
  StaffService,
  ProductService,
  FileUploadEmitter,
  RoleService,
  EmailNotificationService,
  ContractService,
  PriceService,

} from './services';

@NgModule({
  imports: [],
  providers: [
    AuthenticationService,
    DocumentTypeService,
    CompanyService,
    DeclarationService,
    EmployeeService,
    GroupCompanyService,
    SalaryAreaService,
    CityService,
    DistrictService,
    WardsService,
    NavigationService,
    HospitalService,
    NationalityService,
    PeopleService,
    PlanService,
    PaymentStatusServiced,
    RelationshipService,
    BankService,
    DepartmentService,
    VillageService,
    DocumentListService,
    DeclarationFileService,
    SicknessesService,
    AgencieService,
    CustomerService,
    StaffService,
    ProductService,
    FileUploadEmitter,
    RoleService,
    EmailNotificationService,
    ContractService,
    PriceService,
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
