import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  AuthenticationService,
  DeclarationService,
  EmployeeService,
  NavigationService
} from './services';

@NgModule({
  imports: [],
  providers: [
    AuthenticationService,
    DeclarationService,
    EmployeeService,
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
