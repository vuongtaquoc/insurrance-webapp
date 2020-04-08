import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DeclarationService } from '@app/core/services';

@Component({
  selector: 'app-declaration-increase-labor-add',
  templateUrl: './increase-labor-add.component.html',
  styleUrls: ['./increase-labor-add.component.less']
})
export class IncreaseLaborAddComponent {
  constructor(
    private router: Router,
    private declarationService: DeclarationService
  ) {}

  handleSubmit(data) {
    this.declarationService.create(data).subscribe(() => {
      this.router.navigate(['/declarations/increase-labor']);
    });
  }
}
