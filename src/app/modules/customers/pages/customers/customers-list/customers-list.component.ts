import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { PAGE_SIZE, STATUS, ACTION, ROLE } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '@app/core/services/customer.service';
import { AcountFormComponent } from '@app/shared/components';
import { NzModalService } from 'ng-zorro-antd/modal';
 

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.less']
})
export class CustomersListComponent implements OnInit, OnDestroy {
  total: number;
  skip: number;
  formSearch: FormGroup;
  sortName: string = '';
  selectedPage: number = 1;
  keyword: string ='';
  status: any = STATUS;
  shortColumn: any = {
    key: '',
    value: ''
  };

  customers: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private modalService: NzModalService,

  ) {
  }
  ngOnInit() {
    this.formSearch = this.formBuilder.group({
      keyword: [''],
      dateFrom: [''],
      dateTo: ['']
    });

    this.getCustomers();
  }

  filter: any = {
    name: '',
    tax: '',
    delegate: '',
    active: ''
  };

  handleFilter(key) {
    this.keyword = this.filter[key];
    this.getCustomers();
  }

  private getCustomers(skip = 0, take = PAGE_SIZE) {
    this.customerService.getCustomers({
      name: this.keyword,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      skip,
      take,
      orderType: (this.shortColumn.value || ''),
      orderby: (this.shortColumn.key || '')

    }).subscribe(res => {
      this.customers = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= PAGE_SIZE;
        this.selectedPage -= 1;
        this.getCustomers(this.skip);
      }
    });
  }

  sort(event) {
    this.shortColumn = event;
    this.getCustomers();
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
    this.customerService.delete(id).subscribe(() => {
      this.getCustomers(this.skip);
    },
      (err) => {
        this.translateService.get(err.message).subscribe(message => {
          this.messageService.create('error', message);
        });
      });
  }

  handleSearchBox() {
    this.getCustomers();
  }

  ngOnDestroy() {
  }

  viewAccount(agency) {
    const accountInfo = {
      ...agency,
      roleLevel: ROLE.CUSTOMER,
    };

    this.showDialogAccountManagement(accountInfo);
  }

  private showDialogAccountManagement(companyInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 760,
      nzWrapClassName: 'account-modal',
      nzTitle: `Tạo tài khoản khách hàng ${ companyInfo.name }`,
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

      }
    });
  }
}
