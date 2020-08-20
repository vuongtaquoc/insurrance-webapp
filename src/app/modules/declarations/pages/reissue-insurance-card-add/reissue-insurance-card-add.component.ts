import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent, PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-reissue-insurance-card-add',
  templateUrl: './reissue-insurance-card-add.component.html',
  styleUrls: ['./reissue-insurance-card-add.component.less']
})
export class ReissueInsuranceCardAddComponent extends PageCoreComponent {
  handlers: any[] = [];

  constructor(
    private router: Router,
    private declarationService: DeclarationService,
    private modalService: NzModalService,
    public injector: Injector
  ) {
    super(injector);
  }

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
      this.router.navigate(['/declarations/reissue-insurance-card']);
    }
  }

  private save(data: any) {
    this.declarationService.create(data).subscribe(() => {
      this.router.navigate(['/declarations/reissue-insurance-card']);
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
