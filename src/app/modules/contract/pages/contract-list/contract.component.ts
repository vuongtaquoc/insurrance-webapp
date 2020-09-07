import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContractService } from '@app/core/services';
import { PAGE_SIZE, STATUS, ACTION, ROLE } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less']
})
export class ContractComponent implements OnInit, OnDestroy {

  total: number;
  skip: number;
  formSearch: FormGroup;
  sortName: string = '';
  selectedPage: number = 1;
  status: any = STATUS;
  loading = false;
  contracts: any;

  shortColumn: any = {
    key: '',
    value: ''
  };
  
  filter: any = {
    company: '',
    contractNo: '',
    numberMonth: '',
    contractType: '',
    createDate: '',
  };

  keyword: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
  ) {
  }

  ngOnInit() {
    this.formSearch = this.formBuilder.group({
      keyword: [''],
      dateFrom: [''],
      dateTo: [''],
      type: [''],
    });
    
    this.contracts = [
      {
        company: 'CÔNG TY TNHH MỘT THÀNH VIÊN TỔNG CÔNG TY TRUYỀN HÌNH CÁP VIỆT NAM',
        contractNo: 'MBXH-00002',
        numberMonth: '1 tháng',
        contractType: 'I_VAN',
        createDate: '02/05/2020'
      },
      {
        company: 'CÔNG TY TNHH MỘT THÀNH VIÊN TỔNG CÔNG TY TRUYỀN HÌNH CÁP VIỆT NAM',
        contractNo: 'MBXH-00002',
        numberMonth: '1 tháng',
        contractType: 'I_VAN',
        createDate: '02/05/2020'
      },
      {
        company: 'CÔNG TY CỔ PHẦN TƯ VẤN THIẾT KẾ VÀ ĐẦU TƯ XÂY DỰNG THIÊN SƠN',
        contractNo: 'MBXH-00003',
        numberMonth: '1 tháng',
        contractType: 'I_VAN',
        createDate: '02/05/2020'
      }, {
        company: 'CÔNG TY CỔ PHẦN SURFACE VIỆT',
        contractNo: 'MBXH-00004',
        numberMonth: '1 tháng',
        contractType: 'I_VAN',
        createDate: '02/05/2020'
      },
      {
        company: 'CÔNG TY TNHH MTV CƠ KHÍ TÂN XUÂN HOÀNG',
        contractNo: 'MBXH-00005',
        numberMonth: '1 tháng',
        contractType: 'I_VAN',
        createDate: '02/05/2020'
      }
    ];
  }

  handleSearchBox() {
    this.getContracts();
  }

  private getContracts(skip = 0, take = PAGE_SIZE) {
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
  }
   
  handleFilter(key) {
    this.keyword = this.filter[key];

    this.getContracts();
  }


  ngOnDestroy() {
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

  download(contractId) {
    
  }
}

