import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgencieService } from '@app/core/services';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGE_SIZE, STATUS, ACTION, ROLE } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AcountFormComponent } from '@app/shared/components';

@Component({
  selector: 'app-agencies-list',
  templateUrl: './agencies-list.component.html',
  styleUrls: ['./agencies-list.component.less']
})
export class AgenciesListComponent implements OnInit, OnDestroy {
  total: number;
  skip: number;
  formSearch: FormGroup;
  sortName: string = '';
  selectedPage: number = 1;
  status: any = STATUS;
  shortColumn: any = {
    key: '',
    value: ''
  };

 
  filter: any = {
    name: '',
    tax: '',
    delegate: '',
    active: ''
  };

  keyword: string = '';

  agencies: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private agencieService: AgencieService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private modalService: NzModalService
  ) {
  }
  ngOnInit() {
    this.formSearch = this.formBuilder.group({
      keyword: [''],
      dateFrom: [''],
      dateTo: ['']
    });

    this.getAgenCies();
  }

  private getAgenCies(skip = 0, take = PAGE_SIZE) {
    this.agencieService.getAgencies({
      name: this.keyword,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      skip,
      take,
      orderType: (this.shortColumn.value || ''),
      orderby: (this.shortColumn.key || '')

    }).subscribe(res => {
      this.agencies = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= PAGE_SIZE;
        this.selectedPage -= 1;
        this.getAgenCies(this.skip);
      }
    });
  }

  handleFilter(key) {
    this.keyword = this.filter[key];
    this.getAgenCies();
  }

  sort(event) {
    this.shortColumn = event;
    this.getAgenCies();
  }

  get dateTo() {
    const dateTo = this.formSearch.get('dateTo').value;

    if (!dateTo) return '';

    const birth = getBirthDay(dateTo, false, false);

    return birth.format;
  }

  get dateFrom() {
    const dateFrom = this.formSearch.get('dateFrom').value;
    if (!dateFrom) return '';

    const birth = getBirthDay(dateFrom, false, false);

    return birth.format;
  }

  delete(id) {
    this.agencieService.delete(id).subscribe(() => {
      this.getAgenCies(this.skip);
    },
      (err) => {
        this.translateService.get(err.message).subscribe(message => {
          this.messageService.create('error', message);
        });
      });
  }

  handleSearchBox() {
    this.getAgenCies();
  }

  ngOnDestroy() {

  }

  viewAccount(agency) {
    const accountInfo = {
      ...agency,
      roleLevel: ROLE.SALE,
    };

    this.showDialogAccountManagement(accountInfo);
  }

  private showDialogAccountManagement(companyInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 760,
      nzWrapClassName: 'account-modal',
      nzTitle: `Tạo tài khoản đại lý ${ companyInfo.name }`,
      nzContent: AcountFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        companyInfo
      }
    });

    modal.afterClose.subscribe(result => {
      if(result && result.isSuccess) {
        
        let message = 'Tạo tài khoản thành công';
        if(result.type === 'sendEmail') {
          message = 'Gửi email thành công';
        }

        this.modalService.success({
          nzTitle: message
        });

        this.getAgenCies();
      }
    });
  }
}
