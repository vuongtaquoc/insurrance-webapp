import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService, CustomerService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.less']
})
export class AgenciesComponent implements OnInit, OnDestroy {
  @Input() agenciesId: string;
  item: Company;
  formAgencies: FormGroup;
  loading = false;
  private handlers: any;
  isSpinning: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private agencieService: AgencieService,
    private customerService: CustomerService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
     
    this.loadForm();
    this.initializeData();
    this.handlers = [
      eventEmitter.on("saveData:error", () => {
         this.isSpinning = false;
      }),
    ];
  }

  initializeData() {
    if (this.agenciesId) {
      this.getDetail();
    }  
  }

  ngOnDestroy() {

  }

  private loadForm() {
    this.formAgencies = this.formBuilder.group({
      tax: ['', Validators.required],      
      name: ['', Validators.required],
      address: ['',Validators.required],
      delegate: ['', Validators.required],
      saleCode: ['', Validators.required],
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER) ]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      website: [''],
      active: ['1', Validators.required],
    });
  }

  handleSearchTax() {
  
    if (this.tax) {
      this.isSpinning = true;
      this.customerService.getOrganizationByTax(this.tax).then((data) => {
          if (data['ma_so_thue']) {
            this.formAgencies.patchValue({
              name: data['ten_cty'],
              address: data['dia_chi'],
              delegate: data['nguoi_dai_dien'],
              active: true,
            });
          } else {

            this.formAgencies.patchValue({
              name: '',
              address: '',
              delegate: '',
              tel:'',
              active: false,
            });

            this.taxInvalid();
          }
      });
    } else {
      this.taxInvalid();
    }

   this.isSpinning = false;
 
  }
  
  getDetail() {
    this.isSpinning = true;
    this.agencieService.getDetailById(this.agenciesId).subscribe(data => {

      this.formAgencies.patchValue({
        tax: data.tax,
        name: data.name,
        saleCode: data.saleCode,
        address: data.address,
        delegate: data.delegate,
        tel:data.tel,
        email:data.email,
        website:data.website,
        active:data.active,
      });
      this.isSpinning = false;
    });

  }


  taxInvalid() {
    this.modalService.warning({
      nzTitle: 'Không tìm thấy mã số thuế cần tìm'
    });
  }         
  
  get tax() {
    return this.formAgencies.get('tax').value;
  }
  
  private save() {
    
    for (const i in this.formAgencies.controls) {
      this.formAgencies.controls[i].markAsDirty();
      this.formAgencies.controls[i].updateValueAndValidity();
    }
    
    if (this.formAgencies.invalid) {
      return;
    }
    
    if (this.agenciesId) {
      this.update();
    } else {
      this.create();
    }  

  }

  create() {
    this.isSpinning = true;
    this.agencieService.create(this.formAgencies.value).subscribe(data => {
      this.isSpinning = false;
      this.router.navigate(['/agencies/list']);
    });

  }

  update() {
    this.isSpinning = true;
    this.agencieService.update(this.agenciesId, this.formAgencies.value).subscribe(data => {
      this.isSpinning = false;
      this.router.navigate(['/agencies/list']);
    });

  }
}

