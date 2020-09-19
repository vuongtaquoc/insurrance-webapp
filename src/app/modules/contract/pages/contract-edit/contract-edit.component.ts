import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, SalaryAreaService,} from '@app/core/services';
import { CityService, ContractService, IsurranceDepartmentService,
ProductService, PriceService } from '@app/core/services';
import { Department, Company, Price } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import format from '@app/shared/utils/format';

@Component({
  selector: 'app-contract-edit',
  templateUrl: './contract-edit.component.html',
  styleUrls: ['./contract-edit.component.less']
})
export class ContractEditComponent implements OnInit, OnDestroy {
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
  blockServiceIVAN: any;
  blockServiceCKS: any;
  
  amountIVAN: number;
  dataStandardIVAN: string;
  useDateIVAN: string;
  dataBonusIVAN: string;

  amountCKS: number;
  dataStandardCKS: string;
  useDateCKS: string;
  dataBonusCKS: string;
  totalAmount?: number;

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
      productCKS: ['', Validators.required],
      blockServiceIVAN: ['',  Validators.required],
      blockServiceCKS: ['']
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
    this.productService.getList().subscribe(products => {
      this.productIVAN = this.getProductByType(products, 'IVAN');
      this.productCKS = this.getProductByType(products, 'CKS');
    });
  }

  private getProductByType(products, type) {

    return products.data.filter(d => {
      return d.type === type;
    });

  }

  private changeProductIVAN(productId) {
    this.blockServiceIVAN = [];
    this.formContract.patchValue({
      blockServiceIVAN: ''
    });
    this.priceService.getList({
      productId
    }).subscribe(prices => {
      this.blockServiceIVAN = prices.data;
    });

  }
  private changeProductCKS(productId) {
    this.blockServiceCKS = [];
    this.formContract.patchValue({
      blockServiceCKS: ''
    });
    this.priceService.getList({
      productId
    }).subscribe(prices => {
      this.blockServiceCKS = prices.data;
    });

  }


  private changeBlockServiceIVAN(id) {
     this.priceService.getById(id).subscribe(data => {
        this.amountIVAN = format.currency(data.amount);
        this.dataStandardIVAN = data.dataStandard;
        this.useDateIVAN = data.useDate;
        this.dataBonusIVAN = data.dataBonus;
        this.getTotalAmount();
     });
  }

  private changeBlockServiceCKS(id) {
    this.priceService.getById(id).subscribe(data => {
       this.amountCKS = format.currency(data.amount);
       this.dataStandardCKS = data.dataStandard;
       this.useDateCKS = data.useDate;
       this.dataBonusCKS= data.dataBonus;
       this.getTotalAmount();
    });
 }

 private getTotalAmount() {
   this.totalAmount = (this.amountCKS || 0) + ((this.amountIVAN || 0));
 }

  changeCity(item) {

    if(item) {
      this.getIsurranceDepartments(item)
    }

  }
   
}

