import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DeclarationFileService,AuthenticationService, DeclarationFileUploadService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE, schemaSign, PREFIXBYFILEXML } from '@app/shared/constant';

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
    private declarationFileUploadService: DeclarationFileUploadService,
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
    
    if (declarationFileInfo.isFileUpload) {
      this.downloadFileUpload(declarationFileInfo);      
    } else {
      this.downloadDeclartion(declarationFileInfo);
    }
  }

  private downloadDeclartion(declarationFileInfo: any) {

    declarationFileInfo.isDownloading = true;
    this.declarationFileService.downloadDeclarationFile(declarationFileInfo.id).then(response => {
      const subfixFile = this.getSufixFile(declarationFileInfo.xmlFile)
      const fileName =  declarationFileInfo.fullPathFile + subfixFile;
      const mimeType = this.getMimeType(subfixFile);
      download(fileName, response, mimeType);
      declarationFileInfo.isDownloading = false;
    });

  }

  private  downloadFileUpload(declarationFileInfo: any) {
    declarationFileInfo.isDownloading = true;
    this.declarationFileUploadService.downloadDeclarationFile(declarationFileInfo.id).then(response => {
      const fileName =  declarationFileInfo.declaretionName;
      const mimeType = this.getMimeType(declarationFileInfo.xmlFile);
      download(fileName, response, mimeType);
      declarationFileInfo.isDownloading = false;
    });


  }

  getSufixFile(xmlFile: any) {
    const subfix = PREFIXBYFILEXML.find(d =>  d.key === xmlFile);
    if (subfix) {
      return subfix.value;
    }
    return PREFIXBYFILEXML[0].value
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
