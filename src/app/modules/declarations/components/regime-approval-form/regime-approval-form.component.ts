import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-regime-approval-form',
  templateUrl: './regime-approval-form.component.html',
  styleUrls: ['./regime-approval-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegimeApprovalFormComponent implements OnInit {
  // @Input() initialForm: any;
  @Input() form: FormGroup;
  @Output() onFormValuesChanged: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    const date = new Date();

    this.form = this.formBuilder.group({
      batch: ['1'],
      month: [ date.getMonth() + 1, Validators.required ],
      year: [ date.getFullYear(), Validators.required ],
      accountNumberUnit: [''],
      openAddress: [''],
      branch: [''],
      paperRecord: [''],
      reason: ['']
    });

    this.formChanges();
  }

  formChanges() {
    this.form.valueChanges.subscribe(value => {
      this.onFormValuesChanged.emit(value);
    });

    this.onFormValuesChanged.emit(this.form.value);
  }
}
