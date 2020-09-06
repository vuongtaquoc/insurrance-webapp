import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, SalaryAreaService,} from '@app/core/services';
import { CityService, ContractService, IsurranceDepartmentService,
ProductService, PriceService } from '@app/core/services';
import { Department, Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.less']
})
export class ContractEditComponent implements OnInit, OnDestroy {
  item: Company;
  formContract: FormGroup;
  loading = false;
  groupCompanies: any;
  contractId: any;
  cities: any;
  wards: any;
  districts: any;
  salaryAreas: any;
  paymentMethods: any;
  isurranceDepartments: any;
  productIVAN: any;
  productCKS: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,

    private contractService: ContractService,
    private salaryAreaService: SalaryAreaService,
    private cityService: CityService,
    private authenticationService: AuthenticationService,
    private isurranceDepartmentService: IsurranceDepartmentService,
    private productService: ProductService,
    private priceService: PriceService,
  ) {
  }

  ngOnInit() {

    this.loadForm();
    this.contractId = this.route.snapshot.params.id;
    this.InitializeData();
    
  }

  private loadDetail() {

  }

  InitializeData() {
    this.getProducts();
    this.getCities();
    this.getSalaryAreas();
  }

  loadForm() {

    this.formContract = this.formBuilder.group({
      cityCode: ['', Validators.required],
      isurranceDepartmentId: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreaCode: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required] ,
      delegate: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required],
      paymentMethod: ['0', Validators.required],
      productIVAN: ['', Validators.required],
      productCKS: ['', Validators.required]
    });

  }
  ngOnDestroy() {

  }

  getCities() {
    this.cityService.getCities().subscribe(datas => {
      this.cities = datas;
    });
  }

  getSalaryAreas() {
    this.salaryAreaService.getSalaryAreas().subscribe(datas => {
      this.salaryAreas = datas;
    });
  }
   
  getIsurranceDepartments(cityId: string) {
    this.isurranceDepartmentService.getIsurranceDepartments(cityId).subscribe(datas => {
      this.isurranceDepartments = datas;
    });
  }

  private getProducts() {
    this.productService.getList().subscribe(data => {
      this.productIVAN = this.getProductByType(data, 'IVAN');
      this.productCKS = this.getProductByType(data, 'CKS');
    });
  }

  private getProductByType(data, type) {
    console.log(data, type);
    return data.filter(d => {
      return d.type === type;
    });
  }

  changeCity(item) {

    if(item) {
      this.getIsurranceDepartments(item)
    }

  }
   
}

