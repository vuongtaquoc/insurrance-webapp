import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from '@app/core/interfaces';
import { SubmitDeclarationService, ExternalService } from '@app/core/services';
import { PAGE_SIZE, PAGE_LIST, DECLARATIONRESULT} from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeclarationResultComponent, DeclarationResultOfCompanyComponent } from '@app/shared/components';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  total: number;
  skip: number;
  selectedPage: number = 1;
  declarations: any[] = [];
  pageNumbers: any = PAGE_LIST;
  pageSizeForm: FormGroup;
  declarationCode: string = '';
  fromDate: any;
  isSpinning: boolean;
  toDate: any;
  pageSize: number = PAGE_SIZE;
  status: any = DECLARATIONRESULT;
  constructor(
    private submitDeclarationService: SubmitDeclarationService,
    private modalService: NzModalService,
    private externalService: ExternalService,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.getDeclarations(this.skip, this.pageSize);
    this.fromBuild();
  }

  private getDeclarations(skip = 0, take = PAGE_SIZE) {
    this.isSpinning = true;
    this.submitDeclarationService.filter({
      declarationCode: this.declarationCode,
      fromDate: this.fromDate,
      toDate: this.toDate,
      skip,
      take
    }).subscribe(res => {
      this.declarations = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= this.pageSize;
        this.selectedPage -= 1;
        this.getDeclarations(this.skip);
      }
      this.isSpinning = false;
    });
  }

  handleFormSearch(data) {

    this.declarationCode = data.declarationCode;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.getDeclarations(this.skip);
  }

  viewResult(data) {
    this.loadDeclarationFiles(data);
  }

  private loadDeclarationFiles(declaration) {

      if (declaration.declarationCode === '04_ĐK-IVAN' || declaration.declarationCode === '05_SĐ-IVAN' || declaration.declarationCode === '06_NG-IVAN') {
        this.loadResultOfDeclarationOfCompany(declaration);
      } else {
        this.loadResultOfDeclaration(declaration);
      }
      
  }

  private fromBuild() {
    this.pageSizeForm = this.formBuilder.group({
      pageSize: this.pageSize,
    });
  }

  private loadResultOfDeclaration(declaration) {
    this.isSpinning = true;
    this.externalService.getProcessDeclaration(declaration.id).subscribe(data => {
      const modal = this.modalService.create({
        nzWidth: 980,
        nzWrapClassName: 'document-modal',
        nzTitle: 'Kết quả xử lý hồ sơ số: ' + data.documentNo,
        nzContent: DeclarationResultComponent,
        nzOnOk: (data) => console.log('Click ok', data),
        nzComponentParams: {
          declarationFileInfo: data,
        }
      });
  
      modal.afterClose.subscribe(result => {
      });

      this.isSpinning = false;

    });
  }

  private loadResultOfDeclarationOfCompany(declaration) {
    this.isSpinning = true;

    this.externalService.getProcessDeclarationOfCompany(declaration.id).subscribe(data => {
      const modal = this.modalService.create({
        nzWidth: 980,
        nzWrapClassName: 'document-modal',
        nzTitle: 'Kết quả tiếp nhận hồ sơ số : ' + declaration.documentNo,
        nzContent: DeclarationResultOfCompanyComponent,
        nzOnOk: (data) => console.log('Click ok', data),
        nzComponentParams: {
          declarationFileInfo: data,
        }
      });
  
      modal.afterClose.subscribe(result => {
      });

      this.isSpinning = false;

    });
  }

  private pageChange(page){

  }
  private changePageNumbers(page) {
    this.getDeclarations(this.skip, page);
    this.pageSize = page;
  }
}
