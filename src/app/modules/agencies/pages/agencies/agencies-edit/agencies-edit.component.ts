import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, AgencieService} from '@app/core/services';
import {Company } from '@app/core/models';
import { Router, ActivatedRoute } from '@angular/router';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-agencies-edit',
  templateUrl: './agencies-edit.component.html',
  styleUrls: ['./agencies-edit.component.less']
})
export class AgenciesEditComponent implements OnInit, OnDestroy {

  item: Company;
  companyAgencies: FormGroup;
  id: number;
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
    this.id = this.route.snapshot.params.id;
    this.loadForm();
    this.getDetail(this.id);
  }

  ngOnDestroy() {

  }

  private loadForm() {
    this.companyAgencies = this.formBuilder.group({
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
            this.companyAgencies.patchValue({
              name: data['Title'],
              address: data['DiaChiCongTy'],
              delegate: data['GiamDoc'],
              tel:data['NoiNopThue_DienThoai']
            });
          } else {

            this.companyAgencies.patchValue({
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
  
  getDetail(id) {

    this.agencieService.getDetailById(id).subscribe(data => {

      this.companyAgencies.patchValue({
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
    return this.companyAgencies.get('tax').value;
  }
  
  private save() {
    
    for (const i in this.companyAgencies.controls) {
      this.companyAgencies.controls[i].markAsDirty();
      this.companyAgencies.controls[i].updateValueAndValidity();
    }
    
    if (this.companyAgencies.invalid) {
      return;
    }
    
    this.agencieService.update(this.id, this.companyAgencies.value).subscribe(data => {
      this.router.navigate(['/agencies/list']);
    });    
  }
}

