import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { CityService, HospitalService } from '@app/core/services';

import { City } from '@app/core/models';

@Component({
  selector: 'app-hospital-register-form',
  templateUrl: './hospital-register-form.component.html',
  styleUrls: ['./hospital-register-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeHospitalRegisterFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() data: any = {};
  @Output() onFormValuesChanged: EventEmitter<any> = new EventEmitter();

  cities: City[] = [];

  constructor(
    private modal: NzModalRef,
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private hospitalService: HospitalService
  ) {}

  ngOnInit() {
    this.getCities();
    console.log(this.data,'XXXXX');
    this.form = this.formBuilder.group({
      cityCode: [this.data.cityCode, Validators.required],
      name: [ '', Validators.required ],
      id: [ '', Validators.required ]
    });
  }

  save() {
    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
    }

    if (this.form.invalid) {
      return;
    }
    
    this.hospitalService.create(this.form.value).subscribe(() => {
      this.modal.destroy(this.form.value);
    });
  }

  dismiss() {
    this.modal.destroy();
  }

  private getCities() {
    return this.cityService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }
}
