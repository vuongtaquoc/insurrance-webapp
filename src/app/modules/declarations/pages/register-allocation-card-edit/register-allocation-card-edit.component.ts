import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent, PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-declaration-register-allocation-card',
  templateUrl: './register-allocation-card-edit.component.html',
  styleUrls: ['./register-allocation-card-edit.component.less']
})
export class RegisterAllocationCardEditComponent extends PageCoreComponent implements OnInit {
  declarationId: string;
  handlers: any[] = [];
  isSpinning = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public injector: Injector,
    private declarationService: DeclarationService,
    private modalService: NzModalService
  ) {
    super(injector);
  }


  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
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
    this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
      this.isSpinning = false;
      this.router.navigate(['/declarations/register-allocation-card']);
    });
  }

  private saveAndViewDocument(data: any) {
    this.isSpinning = true;
    this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
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