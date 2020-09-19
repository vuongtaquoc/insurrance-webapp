import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-company-change-add',
  templateUrl: './company-change-add.component.html',
  styleUrls: ['./company-change-add.component.less']
})
export class CompanyChangeAddComponent {
  constructor(
    private router: Router,
  ) {}

}
