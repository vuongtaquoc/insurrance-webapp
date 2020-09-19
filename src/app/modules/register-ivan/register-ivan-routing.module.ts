import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeGuard } from '@app/core/guards';


import { LayoutComponent } from '@app/shared/layout';
import {
  RegisterIvanComponent
} from './pages';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: RegisterIvanComponent,
        // check permission
        // canActivate: [ AuthorizeGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterIvanRoutingModule { }
