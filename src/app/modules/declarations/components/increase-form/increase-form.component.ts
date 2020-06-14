import { Component, OnInit, OnChanges, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import isEmpty from 'lodash/isEmpty';

import { CategoryService, AuthenticationService } from '@app/core/services';
import { Category } from '@app/core/models';
import { REGEX } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-increase-form',
  templateUrl: './increase-form.component.html',
  styleUrls: ['./increase-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class IncreaseFormComponent implements OnInit, OnChanges {
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
    this.handlers = [
      eventEmitter.on('tableEditor:validFrom', ({ tableName }) => {        
          this.validForm();
      })
    ];
    
    this.form = this.formBuilder.group({
      number: [ '1',[Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)] ],
      month: [ date.getMonth() + 1 ],
      year: [ date.getFullYear() ]
    });

    this.formChanges();
  }

  ngOnChanges(changes) {
    if (changes.data && !isEmpty(changes.data.currentValue) && this.form) {
      this.form.patchValue({
        
      });
    }
  }
  validForm() {
    const formError: any[] = [];
    if(this.form.controls.number.errors) {
      formError.push({
        field: 'Số',
        message: 'Kiểm tra lại trường số tờ khai'
      });
    }

    if(this.form.controls.month.errors) {
      formError.push({
        field: 'Tháng',
        message: 'Kiểm tra lại trường số tháng'
      });
    }

    if(this.form.controls.year.errors) {
      formError.push({
        field: 'Năm',
        message: 'Kiểm tra lại trường số năm'
      });
    }

    if(formError.length > 0){
      this.onFormValid.emit({
        tableName: 'validFrom',
        errorMessage: formError
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
