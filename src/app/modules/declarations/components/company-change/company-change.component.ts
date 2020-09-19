import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { DeclarationService, AuthenticationService, CompanyService, IsurranceDepartmentService, DocumentListService } from '@app/core/services';
import { Subject, forkJoin } from 'rxjs';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { log } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX, DECLARATIONS } from '@app/shared/constant';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { DocumentFormComponent } from '@app/shared/components';
import { Declaration, DocumentList } from '@app/core/models';

@Component({
  selector: 'app-company-change',
  templateUrl: './company-change.component.html',
  styleUrls: ['./company-change.component.less']
})
export class CompanyChangeComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;

  documentForm: FormGroup;
  companyForm: FormGroup;
  declarationCode: string = '604'
  declarationName: string = ''
  currentCredentials: any;
  documentList: DocumentList[] = [];
  status = 0;
  files: any[] = [];
 
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };

  constructor(
    protected declarationService: DeclarationService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private companyService: CompanyService,
    private formBuilder: FormBuilder,
    private formCompanyBuilder: FormBuilder,
    private modalService: NzModalService,
    private documentListService: DocumentListService,
  ) {
  }

  ngOnInit() {

    const date = new Date();
    this.declarationName = this.getDeclaration(this.declarationCode).value;
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });

    this.documentForm = this.formBuilder.group({
      submitter: [this.currentCredentials.companyInfo.delegate,Validators.required ],
      mobile: [this.currentCredentials.companyInfo.mobile,  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
    });
    
    this.loadFromDefault();
    if(this.declarationId) {
      this.getDeclarationDetail();
    }else {
      this.getCompanyInfo();
    }
    
  }
   
  loadFromDefault() {
    this.companyForm = this.formCompanyBuilder.group({
      isurranceDepartmentName: ['', Validators.required],
      companyName: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      taxCode: ['', Validators.required],
      address: ['', Validators.required],
      addressRegister: ['', Validators.required],
      careers: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      license: ['', Validators.required],
      issued: ['', Validators.required],
      paymentMethodCode:  ['', Validators.required],
      note:  ['', Validators.required],
      documentAttached: [''],
    });
  }

  getCompanyInfo() {
    const companyId = this.currentCredentials.companyInfo.id;
    this.companyService.getDetailById(companyId).subscribe(data => {
      this.getIsurranceDepartment(data.isurranceDepartmentId);
      this.companyForm.patchValue({
        isurranceDepartmentId: data.isurranceDepartmentId,
        companyName: data.name,
        name: data.name,
        code: data.code,
        taxCode: data.taxCode,
        address: data.address,
        addressRegister: data.addressRegister,
        careers: data.careers,
        license: data.license,
        issued: data.issued,
        mobile: data.mobile,
        email: data.emailOfContract,
        paymentMethodCode: data.paymentMethodCode,
      });
    })
  }

  getDeclarationDetail() {
    this.declarationService.getDeclarationsChangeCompanyById(this.declarationId).subscribe(data => {
      this.files = data.files;
      this.documentForm.patchValue({
        submitter: data.submitter,
        mobile: data.mobile
      });
      this.status = data.status;
      this.companyForm.patchValue({
        isurranceDepartmentName: data.changeCompanyInfo.isurranceDepartmentName,
        companyName: data.changeCompanyInfo.name,
        name: data.changeCompanyInfo.name,
        code: data.changeCompanyInfo.code,
        taxCode: data.changeCompanyInfo.taxCode,
        address: data.changeCompanyInfo.address,
        addressRegister: data.changeCompanyInfo.addressRegister,
        careers: data.changeCompanyInfo.careers,
        license: data.changeCompanyInfo.license,
        issued: data.changeCompanyInfo.issued,
        mobile: data.changeCompanyInfo.mobile,
        email: data.changeCompanyInfo.email,
        paymentMethodCode: data.changeCompanyInfo.paymentMethodCode,
        note: data.changeCompanyInfo.note,
        documentAttached: data.changeCompanyInfo.documentAttached,
      });

    });
  }

  getIsurranceDepartment(isurranceDepartmentId) {
    this.isurranceDepartmentService.getDetailById(isurranceDepartmentId).subscribe(data => {
      this.companyForm.patchValue({
        isurranceDepartmentCode: data.code,
        isurranceDepartmentName: data.name,
      });
    });
  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleSelectTab(index) {
    eventEmitter.emit('increase-labor:tab:change', index);
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
  }

   

  ngOnChanges(changes) {
  }

  ngOnDestroy() {
  }

  saveAndView() {
    for (const i in this.companyForm.controls) {
      this.companyForm.controls[i].markAsDirty();
      this.companyForm.controls[i].updateValueAndValidity();
    }
    
    if (this.companyForm.invalid) {
      return;
    }

    if (this.declarationId) {
      this.update('saveAndView');
    } else {
      this.create('saveAndView');
    }

  }

  save() {
    if (this.declarationId) {
      this.update('save');
    } else {
      this.create('save');
    }

  }

  private update(type: any) {
    this.declarationService.updateChangeCompany(this.declarationId, {
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(type),
      submitter: this.submitter,
      mobile: this.mobile,
      changeCompanyInfo: this.companyForm.value,
      flies: this.files,
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/company-change']);
      }
    });
  }

  private create(type: any) {
    this.declarationService.createChangeCompany({
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      status: type === 'saveAndView' ? 1: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      changeCompanyInfo: this.companyForm.value,
      flies: this.files,
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else{
        this.router.navigate(['/declarations/company-change']);
      }
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

  private getStatus(type) {
    if(this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }

  rollback() {
    this.modalService.confirm({
      nzTitle: 'Bạn có muốn lưu lại thông tin thay đổi',
      nzOkText: 'Có',
      nzCancelText: 'Không',
      nzOnOk: () => {
        if (this.declarationId) {
          this.update('save');
        } else {
          this.create('save');
        }
      },
      nzOnCancel: () => {
        this.router.navigate(['/declarations/company-change']);
      }
    });      
  }

  get submitter() {
    return this.documentForm.get('submitter').value;
  }

  get mobile() {
    return this.documentForm.get('mobile').value;
  }
}
