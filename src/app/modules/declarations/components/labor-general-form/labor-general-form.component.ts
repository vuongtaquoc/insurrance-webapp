import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

@Component({
  selector: 'app-labor-general-form',
  templateUrl: './labor-general-form.component.html',
  styleUrls: ['./labor-general-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LaborGeneralFormComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() data: any = {};
  @Output() onFormValuesChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      insuranceBookNumber: [''],
      insuranceCardNumber: ['']
    });

    this.formChanges();
  }

  ngOnChanges(changes) {
    if (changes.data && !isEmpty(changes.data.currentValue) && this.form) {
      this.form.patchValue({
        insuranceBookNumber: changes.data.currentValue.insuranceBookNumber,
        insuranceCardNumber: changes.data.currentValue.insuranceCardNumber,
      });
    }
  }

  formChanges() {
    this.form.valueChanges.subscribe(value => {
      this.onFormValuesChanged.emit(value);
    });

    this.onFormValuesChanged.emit(this.form.value);
  }
}
