import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '@app/core/services';
import { PAGE_SIZE, STATUS, ACTION, ROLE, CONTRACTSTATUS } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-contract-list',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less']
})
export class ContractListComponent implements OnInit, OnDestroy {

  total: number;
  skip: number;
  formSearch: FormGroup;
  sortName: string = '';
  selectedPage: number = 1;
  keyword: string ='';
  status: any = CONTRACTSTATUS;
  shortColumn: any = {
    key: '',
    value: ''
  };
  isSpinning: boolean = false;

  contracts: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
    this.formSearch = this.formBuilder.group({
      keyword: [''],
      dateFrom: [''],
      dateTo: [''],
    });

    this.getContracts();
  }

  filter: any = {
    name: '',
    tax: '',
    delegate: '',
    active: ''
  };

  handleFilter(key) {
    this.keyword = this.filter[key];
    this.getContracts();
  }

  private getContracts(skip = 0, take = PAGE_SIZE) {
    this.isSpinning = true;
    this.contractService.getList({
      name: this.keyword,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      skip,
      take,
      orderType: (this.shortColumn.value || ''),
      orderby: (this.shortColumn.key || '')

    }).subscribe(res => {
      this.contracts = res.data;
      this.total = res.total;
      this.skip = skip;

      if (res.data.length === 0 && this.selectedPage > 1) {
        this.skip -= PAGE_SIZE;
        this.selectedPage -= 1;
        this.getContracts(this.skip);
      }
    });
    this.isSpinning = false;
  }

  sort(event) {
    this.shortColumn = event;
    this.getContracts();
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
    this.contractService.delete(id).subscribe(() => {
      this.getContracts(this.skip);
    });
  }

  redNew(id) {
    
    this.modalService.confirm({
      nzTitle: 'Bạn có chắc chắn muốn làm mới hơp đồng?',
      nzOkText: 'Làm mới',
      nzCancelText: 'Không',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.contractService.rednew(id).subscribe(data => {
          this.getContracts(this.skip);
        });
      }
    });
   
  }

  handleSearchBox() {
    this.getContracts();
  }

  ngOnDestroy() {

  }

  download(contractId) {
    
  }
}

