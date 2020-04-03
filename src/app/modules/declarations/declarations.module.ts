import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { AuthenticationService, DeclarationService } from '@app/core/services';
import { SharedModule } from '@app/shared/shared.module';
import { DeclarationsRoutingModule } from './declarations-routing.module';

import { IncreaseLaborComponent } from './pages';

import {
  TableEditorComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ScrollPanelModule,
    DeclarationsRoutingModule,
    SharedModule,
  ],
  declarations: [
    IncreaseLaborComponent,
    TableEditorComponent
  ],
  providers: [
    AuthenticationService,
    DeclarationService
  ],
  entryComponents: []
})
export class DeclarationsModule { }
