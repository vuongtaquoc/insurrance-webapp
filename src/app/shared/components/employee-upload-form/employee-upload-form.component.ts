import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { EmailNotificationService, EmployeeService, DeclarationService } from '@app/core/services';
import { DropdownItem } from '@app/core/interfaces'; 
import { PAGE_SIZE, STATUS, ACTION, ROLE } from '@app/shared/constant';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE, PREFIXBYFILEXML } from '@app/shared/constant';

@Component({
  selector: 'app-employee-upload-form',
  templateUrl: './employee-upload-form.component.html',
  styleUrls: ['./employee-upload-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeUploadFormComponent implements OnInit {
  @Input() uploadData: any;
  accountForm: FormGroup;
  content: string = '';
  isDownloading : boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private employeeService: EmployeeService,
    private declarationService: DeclarationService,
  ) {}

  ngOnInit() {
    this.accountForm = this.formBuilder.group({
      fileName: [''],
      file: '',
    });
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

  handleFileSelected(data) {
    this.accountForm.patchValue({
      fileName: data.metadata.name,
      file: data.file
    });
  }

  dismiss(): void {
    this.modal.destroy();
  }

  uploadFile() {
    this.isDownloading = true;
    const fileUpload = this.getData();
    this.employeeService.upload(fileUpload).subscribe(response => {
      this.isDownloading = true;
      this.modal.destroy(response);
    });
  }

  downloadFileTemplate() {
    this.declarationService.downloadFileTemplate(this.uploadData.declarationCode).then(response => {
      const subfixFile = '.xlsx';
      const fileName =  `Nhansu_FIleMau${ subfixFile }`;
      const mimeType = this.getMimeType(subfixFile);
      download(fileName, response, mimeType);
    });
  }

  getData() {
    
    const formData = {
      ...this.accountForm.value,
      declarationCode: this.uploadData.declarationCode
    };

    return formData;
  }

  getMimeType(subfixFile: string) {
    const mimeType = _.find(MIME_TYPE, {
        key: subfixFile,
    });
    if (mimeType) {
      return mimeType.value;
    }
    return MIME_TYPE[0].value
  }
}
