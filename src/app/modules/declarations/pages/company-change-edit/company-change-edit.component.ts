import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent } from '@app/shared/components';
@Component({
  selector: 'app-company-change-edit',
  templateUrl: './company-change-edit.component.html',
  styleUrls: ['./company-change-edit.component.less']
})
export class CompanyChangeEditComponent implements OnInit {
  declarationId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private declarationService: DeclarationService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
  }
}
