import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

import { CategoryService, AuthenticationService } from '@app/core/services';
import { Category } from '@app/core/models';
import { REGEX } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

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
  @Output() onFormValid: EventEmitter<any> = new EventEmitter();
  typeDocumentActtachs: Category[] = [];
  private handlers: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    const date = new Date();
    this.loadTypeDocumentAttach();
    this.form = this.formBuilder.group({
      batch: ['1', Validators.required],
      month: [ date.getMonth() + 1, [Validators.required,Validators.min(0), Validators.max(12), Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)] ],
      year: [ date.getFullYear(), [Validators.required,Validators.min(1000), Validators.maxLength(4),Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)] ],
      bankAccount: [''],
      openAddress: [''],
      branch: [''],
      typeDocumentActtach: ['', Validators.required],
      reason: ['', Validators.required]
    });

    this.handlers = [
      eventEmitter.on('tableEditor:validFrom', ({ tableName }) => {
          this.validForm();
      })
    ];

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


  validForm() {
    const formError: any[] = [];
    if(this.form.controls.batch.errors) {
      formError.push({
        y: 'Đợt',
        columnName: 'Kiểm tra lại trường đợt kê khai',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.month.errors) {
      formError.push({
        y: 'Tháng',
        columnName: 'Kiểm tra lại trường số tháng',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.year.errors) {
      formError.push({
        y: 'Năm',
        columnName: 'Kiểm tra lại trường số năm',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.typeDocumentActtach.errors) {
      formError.push({
        y: 'Gửi kèm hồ sơ giấy',
        columnName: 'Kiểm tra lại Gửi kèm hồ sơ giấy',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.reason.errors) {
      formError.push({
        y: 'Lý do giải trình',
        columnName: 'Kiểm tra lại lý do giải trình',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    this.onFormValid.emit({
      tableName: 'validFrom',
      errorMessage: formError
    });

  }

  private loadTypeDocumentAttach() {
    this.categoryService.getCategories('documentAttached').subscribe((data) => {
      this.typeDocumentActtachs = data;
    });
  }

  handleTrimValue(key) {
    const value = this.form.value[key] || '';

    this.form.patchValue({
      [key]: value.trim()
    });
  }
}
