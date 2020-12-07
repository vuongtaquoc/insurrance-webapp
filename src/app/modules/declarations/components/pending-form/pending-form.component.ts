import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

import { CategoryService, AuthenticationService } from '@app/core/services';
import { Category } from '@app/core/models';
import { REGEX } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-pending-form',
  templateUrl: './pending-form.component.html',
  styleUrls: ['./pending-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class PendingFormComponent implements OnInit, OnChanges {
  @Input() form: FormGroup;
  @Input() data: any = {};
  @Input() headerName: string = 'Báo cáo tình hình sử dụng lao động và danh sách tham gia BHXH,BHYT,BHTN';
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
    this.handlers = [
      eventEmitter.on('tableEditor:validFrom', ({ tableName }) => {        
          this.validForm();
      })
    ];
    
    this.form = this.formBuilder.group({
      batch: [ {value:'1', disabled: true },[Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)] ],
      month: [ date.getMonth() + 1 , [Validators.required,Validators.min(1), Validators.max(12), Validators.pattern(REGEX.ONLY_NUMBER)]],
      year: [ date.getFullYear(), [Validators.required,Validators.min(1990), Validators.maxLength(4), Validators.pattern(REGEX.ONLY_NUMBER)]]
    });

    this.formChanges();
  }

  ngOnChanges(changes) {
    if (changes.data && !isEmpty(changes.data.currentValue) && this.form) {
      this.form.patchValue({
        batch: changes.data.currentValue.batch,
        month: changes.data.currentValue.month,
        year: changes.data.currentValue.year,
      });
    }
  }

  validForm() {
    const formError: any[] = [];
    if(this.form.controls.batch.errors) {
      formError.push({
        y: 'Số',
        columnName: 'Kiểm tra lại trường số tờ khai',
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


    this.onFormValid.emit({
      tableName: 'validFrom',
      errorMessage: formError
    });
    
  }
  formChanges() {
    this.form.valueChanges.subscribe(value => {
      this.onFormValuesChanged.emit(value);
    });

    this.onFormValuesChanged.emit(this.form.value);
  }

}
