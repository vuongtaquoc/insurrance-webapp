import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TreeModule } from 'primeng/tree';

import { AuthenticationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { DeclarationsRoutingModule } from './declarations-routing.module';
import { InCreaseLaborComponent } from './pages';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ScrollPanelModule,
    DeclarationsRoutingModule,
    SharedModule,
    TreeModule
  ],
  declarations: [
    InCreaseLaborComponent
  ],
  providers: [
    AuthenticationService
  ],
  entryComponents: []
})
export class DeclarationsModule { }
