import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import {DocumentFormComponent, PageCoreComponent } from '@app/shared/components';
import { DeclarationService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-declaration-register-allocation-card-add',
  templateUrl: './register-allocation-card-add.component.html',
  styleUrls: ['./register-allocation-card-add.component.less']
})
export class RegisterAllocationCardAddComponent extends PageCoreComponent {
  handlers: any[] = [];
  isSpinning = false;

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
      this.router.navigate(['/declarations/register-allocation-card']);
    }
  }

  private save(data: any) {
    this.isSpinning = true;
    this.declarationService.create(data).subscribe(() => {
      this.isSpinning = false;
      this.router.navigate(['/declarations/register-allocation-card']);
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