import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, SalaryAreaService,} from '@app/core/services';
import { CityService, ContractService, IsurranceDepartmentService } from '@app/core/services';
import { Department, Company, Price } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import format from '@app/shared/utils/format';
import { Subject, forkJoin } from 'rxjs';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less']
})
export class ContractComponent implements OnInit, OnDestroy {
  @Input() contractId: string;
  formContract: FormGroup;
  loading = false;
  groupCompanies: any;
  contract: any = {};
  item: any = {};
  status: number = 0;
  cities: any;
  wards: any;
  districts: any;
  salaryAreas: any;
  paymentMethods: any;
  isurranceDepartments: any;
  isSpinning = false;
  readOnly = true;
  hasToken: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,

    private contractService: ContractService,
    private salaryAreaService: SalaryAreaService,
    private cityService: CityService,
    private authenticationService: AuthenticationService,
    private isurranceDepartmentService: IsurranceDepartmentService,   
  ) {
  }

  ngOnInit() {
    this.loadForm();
    this.InitializeData();
  }

  private loadDetail() {

  }

  InitializeData() {
    this.getDetail();
  }

  loadForm() {

    this.formContract = this.formBuilder.group({
      cityCode: ['', Validators.required],
      isurranceDepartmentCode: ['', Validators.required],
      code: ['', Validators.required],
      salaryAreaCode: ['', Validators.required],
      name: ['', Validators.required],
      address: ['', Validators.required] ,
      delegate: ['', Validators.required],
      tel: ['', Validators.required],
      email: ['', Validators.required],
      website: ['', Validators.required],
      privateKey: ['', Validators.required],
      vendorToken:  ['', Validators.required],
      fromDate:  ['', Validators.required],
      expired: ['', Validators.required],
    });

  }

  ngOnDestroy() {

  }

  getCities() {
    this.cityService.getCities().subscribe(datas => {
      this.cities = datas;
    });
  }

  getDetail() {
    this.isSpinning = true;
    this.contractService.getDetailById(this.contractId).subscribe(data => {
      this.loading = false;
      const fork = [
        this.cityService.getCities(),
        this.salaryAreaService.getSalaryAreas(),
        this.isurranceDepartmentService.getIsurranceDepartments(data.cityCode)
      ];

      forkJoin(fork).subscribe(([cities, salaryAreas, isurranceDepartments]) => {
        this.setDataToForm(data);
        this.contract = data.contractDetail;
        this.cities = cities;
        this.salaryAreas = salaryAreas;
        this.isurranceDepartments = isurranceDepartments;
        this.loading = true;
        this.isSpinning = false;
        this.item = data;
        this.status = data.contractDetail.status;
      });

    });
  }

  setDataToForm(data) {
    this.formContract.patchValue({
      cityCode: data.cityCode,
      isurranceDepartmentCode: data.isurranceDepartmentCode,
      code: data.code,
      salaryAreaCode: data.salaryAreaCode,
      name: data.name,
      address: data.address,
      delegate: data.delegate,
      tel: data.tel,
      email: data.email,
      website: data.website,
      privateKey: data.privateKey,
      vendorToken: data.vendorToken,
      fromDate: data.fromDate,
      expired: data.expired,       
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

  changeCity(item) {

    if(item) {
      this.getIsurranceDepartments(item)
    }

  }

  handleFormValuesChanged(event) {

  }

  cancel() {

    this.isSpinning = true;
    this.contractService.cancel(this.contractId).subscribe(data => {
      this.router.navigate(['/contract/list']);
    }, () => {
      this.isSpinning = false;
    });

  }

  rednew() {
    this.isSpinning = true;
    this.contractService.rednew(this.contractId).subscribe(data => {      
      this.router.navigate(['/contract/list']);
    }, () => {
      this.isSpinning = false;
    });
  }

  getNameOfDropdown(sourceOfDropdown: any, id: string) {
    let name = '';
    const item = sourceOfDropdown.find(r => r.id === id);
    if (item) {
      name = item.name;
    }
    return name;
  }
   
}

