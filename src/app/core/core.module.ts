import { NgModule, Optional, SkipSelf } from '@angular/core';
import {
  AuthenticationService,
  NavigationService,
  DocumentTypeService,
  CompaniesService
} from './services';

@NgModule({
  imports: [],
  providers: [
    AuthenticationService,
    NavigationService,
    DocumentTypeService,
    CompaniesService
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
