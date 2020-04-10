import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DeclarationService } from '@app/core/services';

@Component({
  selector: 'app-declaration-increase-labor-edit',
  templateUrl: './increase-labor-edit.component.html',
  styleUrls: ['./increase-labor-edit.component.less']
})
export class IncreaseLaborEditComponent implements OnInit {
  declarationId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private declarationService: DeclarationService
  ) {}

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
  }

  handleSubmit(data) {
    this.declarationService.update(this.declarationId, data).subscribe(() => {
      this.router.navigate(['/declarations/increase-labor']);
    });
  }
}
