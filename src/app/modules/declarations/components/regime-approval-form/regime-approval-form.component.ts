import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-regime-approval-form',
  templateUrl: './regime-approval-form.component.html',
  styleUrls: ['./regime-approval-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegimeApprovalFormComponent implements OnInit {
  form: FormGroup;

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
  }
}
