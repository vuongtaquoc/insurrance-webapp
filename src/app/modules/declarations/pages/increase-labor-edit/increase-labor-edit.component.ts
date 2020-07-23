import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent, PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-declaration-increase-labor-edit',
  templateUrl: './increase-labor-edit.component.html',
  styleUrls: ['./increase-labor-edit.component.less']
})
export class IncreaseLaborEditComponent extends PageCoreComponent implements OnInit {
  declarationId: string;
  handlers: any[] = [];

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
    this.handlers.push(eventEmitter.on('unsaved-changed', () => this.setIsUnsavedChanges(true)));
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
      this.router.navigate(['/declarations/increase-labor']);
    }
  }

  private save(data: any) {
    this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
      this.router.navigate(['/declarations/increase-labor']);
    });
  }

  private saveAndViewDocument(data: any) {
    this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
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
