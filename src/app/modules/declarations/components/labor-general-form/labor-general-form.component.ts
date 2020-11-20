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
      totalNumberInsurance: [''],
      totalCardInsurance: ['']
    });

    this.formChanges();
  }

  ngOnChanges(changes) {
    if (changes.data && !isEmpty(changes.data.currentValue) && this.form) {
      this.form.patchValue({
        totalNumberInsurance: changes.data.currentValue.totalNumberInsurance,
        totalCardInsurance: changes.data.currentValue.totalCardInsurance,
      });
      // if (changes.data.currentValue.totalNumberInsurance || changes.data.currentValue.totalCardInsurance) {
      //   this.form.patchValue({
      //     totalNumberInsurance: changes.data.currentValue.totalNumberInsurance,
      //     totalCardInsurance: changes.data.currentValue.totalCardInsurance,
      //   });
      // }
    }
  }

  formChanges() {
    this.form.valueChanges.subscribe(value => {
      this.onFormValuesChanged.emit({
        data: value
      });
    });

    this.onFormValuesChanged.emit({
      data: this.form.value,
      first: true
    });
  }

}
