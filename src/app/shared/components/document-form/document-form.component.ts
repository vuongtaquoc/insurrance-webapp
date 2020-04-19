import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';
import { DeclarationFileService } from '@app/core/services';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import { DATE_FORMAT } from '@app/shared/constant';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentFormComponent implements OnInit {
  @Input() declarationInfo: any;
  declarationFiles: any[] = [];
  documentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private declarationFileService: DeclarationFileService,
  ) {}

  ngOnInit() {
    this.loadDeclarationFiles();
  }

  save(): void {
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
    this.declarationFileService.downloadDeclarationFile(declarationFileInfo.id).subscribe(declarationFiles => {
      console.log(declarationFiles)
    });
  }
}
