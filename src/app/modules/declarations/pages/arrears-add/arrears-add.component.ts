import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-declaration-arrears-add',
  templateUrl: './arrears-add.component.html',
  styleUrls: ['./arrears-add.component.less']
})
export class ArrearsAddComponent {
  constructor(
    private router: Router,
    private declarationService: DeclarationService,
    private modalService: NzModalService
  ) {}

  handleSubmit(data) {
    if (data.type === 'saveAndView') {
      this.saveAndViewDocument(data);
    } else if(data.type === 'save') {
      this.save(data);
    }else {
      this.router.navigate(['/declarations/arrears']);
    }
  }

  private save(data: any) {
    this.declarationService.create(data).subscribe(() => {
      this.router.navigate(['/declarations/arrears']);
    });
  }

  private saveAndViewDocument(data: any) {
    this.declarationService.create(data).subscribe((declarationResult) => {
      this.viewDocument(declarationResult);
    });
  }

  viewDocument(declarationInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Thông tin biểu mẫu, tờ khai đã xuất',
      nzContent: DocumentFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        declarationInfo
      }
    });

    modal.afterClose.subscribe(result => {
    });
  }
}
