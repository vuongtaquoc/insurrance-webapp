import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DeclarationFileService,AuthenticationService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE, schemaSign } from '@app/shared/constant';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent implements OnInit {
  @Input() declarationInfo: any;
  declarationFiles: any[] = [];
  categoryCode?: string;
  categoryName?: string;
  createdDate?: string;
  documentForm: FormGroup;
  authenticationToken: string;
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private declarationFileService: DeclarationFileService,
    private authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.loadDeclarationFiles();
    this.buildShemaURL();
  }

  signDeclaration(): void {
    const link = document.createElement('a');
    link.href = this.shemaUrl;
    link.click();

    setTimeout(() => {
      this.modal.destroy();
    }, 500);
    
  }

  private buildShemaURL() {
    this.authenticationToken = this.authenticationService.currentCredentials.token;
    let shemaSign = window['schemaSign'] || schemaSign;
    shemaSign = shemaSign.replace('token', this.authenticationToken);
    this.shemaUrl = shemaSign.replace('declarationId', this.declarationInfo.id);
  }

  dismiss(): void {
    this.modal.destroy();
  }

  private loadDeclarationFiles() {
    this.declarationFileService.getDeclarationFiles(this.declarationInfo.id).subscribe(declarationFiles => {
      this.declarationFiles = declarationFiles;
    });
  }

  downloadFile(declarationFileInfo: any) {
    declarationFileInfo.isDownloading = true;

    this.declarationFileService.downloadDeclarationFile(declarationFileInfo.id).then(response => {
      const fileName = this.getItemInArray(declarationFileInfo.fullPathFile.split("."), 0);
      const subfixFile = this.getItemInArray(declarationFileInfo.fullPathFile.split("."), 1);
      const mimeType = this.getMimeType(subfixFile);
      download(fileName, response, mimeType);

      declarationFileInfo.isDownloading = false;
    });
  }

  getItemInArray(stringArray: any, index: number) {
    const numberItem = stringArray.length;
    if(numberItem > index) {
      return stringArray[index];
    }
    return "";
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
