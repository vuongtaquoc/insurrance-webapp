import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent } from '@app/shared/components';
@Component({
  selector: 'app-declaration-adjust-edit',
  templateUrl: './adjust-edit.component.html',
  styleUrls: ['./adjust-edit.component.less']
})
export class AdjustEditComponent implements OnInit {
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

  handleSubmit(data) {
    if (data.type === 'saveAndView') {
      this.saveAndViewDocument(data);
    } else if(data.type === 'save') {
      this.save(data);
    }else {
      this.router.navigate(['/declarations/adjust']);
    }
  }

  private save(data: any) {
    this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
      this.router.navigate(['/declarations/adjust']);
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