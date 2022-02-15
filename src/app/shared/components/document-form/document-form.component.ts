import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { HubService } from '@app/core/services';
import { DeclarationFileService,AuthenticationService, DeclarationFileUploadService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';
import { NzModalService } from 'ng-zorro-antd/modal';
import { download } from '@app/shared/utils/download-file';
import { DATE_FORMAT, MIME_TYPE, schemaSign, PREFIXBYFILEXML, HumCommand } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

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
  isSpinning: boolean;
  private hubProxy: any;
  private handlers;
  shemaUrl: any;
  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private declarationFileService: DeclarationFileService,
    private declarationFileUploadService: DeclarationFileUploadService,
    private authenticationService: AuthenticationService,
    private hubService: HubService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {

    this.hubService.connectHub(this.getResultHub.bind(this));
    this.loadDeclarationFiles();
    this.handlers = [
      eventEmitter.on("saveData:error", () => {
         this.isSpinning = false;
      })
    ];
  }

  getResultHub(data) {
    console.log(data);
    this.isSpinning = false;
    if(!data || !data.status) 
    {
      return;
    }

    this.modal.destroy();
    eventEmitter.emit("loadDeclaration:sign");
    this.modalService.success({
      nzTitle: 'Ký số tờ khai thành công'
    });
  }

  signDeclaration(): void {
    this.isSpinning = true;
    this.hubProxy = this.hubService.getHubProxy();
    if (this.hubProxy == null || this.hubProxy.connection.state !== 1) {
      this.startAppSign();
    } else {
      this.signDeclarationHub();
    }
  }

  private signDeclarationHub() {   
    const argum = `${ this.authenticationService.currentCredentials.token },${ this.declarationInfo.id },${ HumCommand.signDocument },${ HumCommand.rootAPI }`;
    this.hubProxy.invoke("processMessage", argum).done(() => {
    }).fail((error) => {
      this.isSpinning = false;
    });
  }

  private startAppSign() 
  {
    this.authenticationToken = this.authenticationService.currentCredentials.token;
    let shemaSign = window['schemaSign'] || schemaSign;
    shemaSign = shemaSign.replace('token', this.authenticationToken);
    const link = document.createElement('a');
    link.href = shemaSign.replace('declarationId', this.declarationInfo.id);
    link.click();
  }

  dismiss(): void {
    this.modal.destroy();
  }

  private loadDeclarationFiles() {
    this.declarationFileService.getDeclarationFiles(this.declarationInfo.id).subscribe(declarationFiles => {
      this.declarationFiles = declarationFiles;
    });
  }

  downloadFile(declarationFileInfo: any, type: any) {
    if (declarationFileInfo.isFileUpload) {
      this.downloadFileUpload(declarationFileInfo);      
    } else {
      this.downloadDeclartion(declarationFileInfo, type);
    }
  }

  private downloadDeclartion(declarationFileInfo: any, type: any) {
    if (type === '.pdf') {
      this.downloadDeclarationFileConvertPdf(declarationFileInfo, type);
    } else {
      this.downloadDeclarationFile(declarationFileInfo, type);
    }
  }

  private downloadDeclarationFile(declarationFileInfo: any, type: any) {
    declarationFileInfo.isDownloading = true;
    this.declarationFileService.downloadDeclarationFile(declarationFileInfo.id, type).then(response => {
      const subfixFile = this.getSufixFile(declarationFileInfo.xmlFile)
      const fileName =  declarationFileInfo.fullPathFile + subfixFile;
      const mimeType = this.getMimeType(subfixFile);
      download(fileName, response, mimeType);
      declarationFileInfo.isDownloading = false;
    });
  }

  private downloadDeclarationFileConvertPdf(declarationFileInfo: any, type: any) {
    declarationFileInfo.isDownloading = true;
    this.declarationFileService.downloadDeclarationFile(declarationFileInfo.id, type).then(response => {
      const subfixFile = '.pdf'
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
