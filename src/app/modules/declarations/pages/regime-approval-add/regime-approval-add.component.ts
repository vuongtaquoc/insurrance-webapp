import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DeclarationService } from '@app/core/services';

@Component({
  selector: 'app-declaration-regime-approval-add',
  templateUrl: './regime-approval-add.component.html',
  styleUrls: ['./regime-approval-add.component.less']
})
export class RegimeApprovalAddComponent {
  constructor(
    private router: Router,
    private declarationService: DeclarationService
  ) {}

  handleSubmit(data) {
    this.declarationService.create(data).subscribe(() => {
      this.router.navigate(['/declarations/regime-approval']);
    });
  }
}
