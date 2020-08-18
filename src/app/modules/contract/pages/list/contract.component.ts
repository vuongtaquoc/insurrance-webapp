import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss', '../../../agencies/pages/agencies/agencies-list/agencies-list.component.less']
})
export class ContractComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  listOfData: any;

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
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    });
    this.listOfData = [
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
  handleFilter(key) {
    this.keyword = this.filter[key];

    //this.getEmployees();
  }


  ngOnDestroy() {
  }

  get form() {
    return this.loginForm.controls;
  }
}

