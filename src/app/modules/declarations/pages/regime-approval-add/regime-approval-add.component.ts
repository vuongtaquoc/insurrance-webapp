import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-declaration-regime-approval-add',
  templateUrl: './regime-approval-add.component.html',
  styleUrls: ['./regime-approval-add.component.less']
})
export class RegimeApprovalAddComponent {
  constructor(
    private router: Router
  ) {}
}
