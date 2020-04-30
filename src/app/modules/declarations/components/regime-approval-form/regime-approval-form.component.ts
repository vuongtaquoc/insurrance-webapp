import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService, AuthenticationService } from '@app/core/services';
import { Category } from '@app/core/models';

@Component({
  selector: 'app-regime-approval-form',
  templateUrl: './regime-approval-form.component.html',
  styleUrls: ['./regime-approval-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class RegimeApprovalFormComponent implements OnInit {
  @Input() form: FormGroup;
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
      accountNumberUnit: [''],
      openAddress: [''],
      branch: [''],
      typeDocumentActtach: [''],
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

  private loadTypeDocumentAttach() {
      this.categoryService.getCategories("documentAttached").subscribe((data) => 
      {
        this.typeDocumentActtachs = data;
      });
  }

}
