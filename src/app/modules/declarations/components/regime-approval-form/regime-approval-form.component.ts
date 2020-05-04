import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

import { CategoryService, AuthenticationService } from '@app/core/services';
import { Category } from '@app/core/models';

@Component({
  selector: 'app-regime-approval-form',
  templateUrl: './regime-approval-form.component.html',
  styleUrls: ['./regime-approval-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegimeApprovalFormComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() data: any = {};
  @Output() onFormValuesChanged: EventEmitter<any> = new EventEmitter();
  typeDocumentActtachs: Category[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    const date = new Date();
    this.loadTypeDocumentAttach();
    this.form = this.formBuilder.group({
      batch: ['1'],
      month: [ date.getMonth() + 1, Validators.required ],
      year: [ date.getFullYear(), Validators.required ],
      bankAccount: [''],
      openAddress: [''],
      branch: [''],
      typeDocumentActtach: [''],
      reason: ['']
    });

    this.formChanges();
  }

  ngOnChanges(changes) {
    if (changes.data && !isEmpty(changes.data.currentValue) && this.form) {
      this.form.patchValue({
        openAddress: changes.data.currentValue.openAddress,
        branch: changes.data.currentValue.branch,
        typeDocumentActtach: changes.data.currentValue.typeDocumentActtach,
        reason: changes.data.currentValue.reason
      });
    }
  }

  formChanges() {
    this.form.valueChanges.subscribe(value => {
      this.onFormValuesChanged.emit(value);
    });

    this.onFormValuesChanged.emit(this.form.value);
  }

  private loadTypeDocumentAttach() {
    this.categoryService.getCategories('documentAttached').subscribe((data) => {
      this.typeDocumentActtachs = data;
    });
  }

}
