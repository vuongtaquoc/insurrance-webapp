import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationService } from '@app/core/services';
import { DocumentFormComponent } from '@app/shared/components';
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
    private declarationService: DeclarationService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
  }

  handleSubmit(data) {
    console.log('aaaa', data);
    if (data.type === 'export') {
      console.log('xxx', data);
    }
    const declarationInfo = {
      id: 4027,
      fileName: 'Tờ khai tham gia điều chỉnh thông tin BHXH, BHYT(Mẫu TK1 - TS)',
    };
    this.viewDocument(declarationInfo);
    // this.declarationService.update(this.declarationId, data).subscribe((declarationResult) => {
    //   this.viewDocument(declarationResult);
    //   //this.router.navigate(['/declarations/increase-labor']);
    // });
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
