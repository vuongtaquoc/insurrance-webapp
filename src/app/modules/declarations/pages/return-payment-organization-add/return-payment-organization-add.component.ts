import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent, PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-return-payment-organization-add',
  templateUrl: './return-payment-organization-add.component.html',
  styleUrls: ['./return-payment-organization-add.component.less']
})
export class ReturnPaymentOrganizationAddComponent extends PageCoreComponent {
  handlers: any[] = [];

  constructor(
    private router: Router,
    private declarationService: DeclarationService,
    private modalService: NzModalService,
    public injector: Injector
  ) {
    super(injector);
  }
  
  isSpinning = false;

  ngOnInit() {
    this.handlers.push(eventEmitter.on('unsaved-changed', (isSubmit) => this.setIsUnsavedChanges(!isSubmit)));
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }

  handleSubmit(data) {
    if (data.type === 'saveAndView') {
      this.saveAndViewDocument(data);
    } else if(data.type === 'save') {
      this.save(data);
    }else {
      this.router.navigate(['/declarations/return-payment-organization']);
    }
  }

  private save(data: any) {
    this.isSpinning = true;
    this.declarationService.create(data).subscribe(() => {
      this.isSpinning = false;
      this.router.navigate(['/declarations/return-payment-organization']);
    });
  }

  private saveAndViewDocument(data: any) {
    this.isSpinning = true;
    this.declarationService.create(data).subscribe((declarationResult) => {
      this.isSpinning = false;
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
