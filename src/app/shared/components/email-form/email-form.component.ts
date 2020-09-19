import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { EmailNotificationService } from '@app/core/services';
import { DropdownItem } from '@app/core/interfaces'; 
import { PAGE_SIZE, STATUS, ACTION, ROLE } from '@app/shared/constant';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE } from '@app/shared/constant';

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmailFormComponent implements OnInit {
  @Input() emailInfo: any;
  accountForm: FormGroup;
  content: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private emailNotificationService: EmailNotificationService,
  ) {}

  ngOnInit() {

    this.accountForm = this.formBuilder.group({
      title: [''],
      emailTo: [''],
      createdDate: [''],
      sendtedDate: [''],
      status: [''],

    });

    this.loadEmailActiveInfo();
  }

  save(): void {
    for (const i in this.accountForm.controls) {
      this.accountForm.controls[i].markAsDirty();
      this.accountForm.controls[i].updateValueAndValidity();
    }

    if (this.accountForm.invalid) {
      return;
    }

  }

  dismiss(): void {
    this.modal.destroy();
  }

  private sendEmail() {
    const emailActiveInfo = this.getData();
    this.emailNotificationService.sendEmail(emailActiveInfo.id, emailActiveInfo).subscribe(data => {
      const result = {
        type: 'sendEmail',
        isSuccess: true,
      }
      this.modal.destroy(result);
    });

  }

  get emailContract() {
    return this.accountForm.get('email').value;
  }

  getData() {
    
    const formData = {
      ...this.accountForm.value,
      id: this.emailInfo.id,     
    };

    return formData;
  }
  private loadEmailActiveInfo() {

    this.accountForm.patchValue({
      title: this.emailInfo.title,
      emailTo: this.emailInfo.emailTo,
      createdDate: this.emailInfo.createdDate,
      sendtedDate: this.emailInfo.sendtedDate,
      status: this.emailInfo.status,
    });
    this.content = this.emailInfo.content;

  }
}
