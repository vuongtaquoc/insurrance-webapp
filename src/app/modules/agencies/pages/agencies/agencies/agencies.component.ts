import { Input, Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

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
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private agencieService: AgencieService,
    private modalService: NzModalService,
  ) {
  }

  ngOnInit() {
     
    this.loadForm();
    this.InitializeData();
  }

  InitializeData() {
    
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
      tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER) ]],
      email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      website: ['', Validators.required],
      active: ['1', Validators.required],
    });
  }

  handleSearchTax() {
  
    if (this.tax) {
      this.agencieService.getOrganizationByTax(this.tax).then((data) => {
          if (data['MaSoThue']) {
            this.formAgencies.patchValue({
              name: data['Title'],
              address: data['DiaChiCongTy'],
              delegate: data['GiamDoc'],
              tel:data['NoiNopThue_DienThoai']
            });
          } else {

            this.formAgencies.patchValue({
              name: '',
              address: '',
              delegate: '',
              tel:'',
            });

            this.taxInvalid();
          }
      });
    } else {
      this.taxInvalid();
    }
 
  }
  
  getDetail() {

    this.agencieService.getDetailById(this.agenciesId).subscribe(data => {

      this.formAgencies.patchValue({
        tax: data.tax,
        name: data.name,
        address: data.address,
        delegate: data.delegate,
        tel:data.tel,
        email:data.email,
        website:data.website,
        active:data.active,
      });

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

    this.agencieService.create(this.formAgencies.value).subscribe(data => {
      this.router.navigate(['/agencies/list']);
    });

  }

  update() {

    this.agencieService.update(this.agenciesId, this.formAgencies.value).subscribe(data => {
      this.router.navigate(['/agencies/list']);
    });

  }
}

