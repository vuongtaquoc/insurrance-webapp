import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { CityService } from '@app/core/services';
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
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.getCities();

    this.form = this.formBuilder.group({
      cityId: ['', Validators.required],
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

    this.modal.destroy();
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
