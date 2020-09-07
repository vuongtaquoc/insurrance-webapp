import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DataRegisterIvan, MustMatch } from "@app/shared/constant";
import { DeclarationService, AuthenticationService, CompanyService, IsurranceDepartmentService, DocumentListService } from '@app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-ivan',
    templateUrl: './register-ivan.component.html',
    styleUrls: ['./register-ivan.component.less']
})
export class RegisterIvanComponent implements OnInit, OnDestroy {
    checked: boolean = false;
    registerIvanData: any[] = [];
    registerForm: FormGroup;

    panel: any = {
        general: { active: false },
        attachment: { active: false }
    };

    constructor(
        protected declarationService: DeclarationService,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.registerIvanData = DataRegisterIvan;
        this.registerForm = this.formBuilder.group({
          registerCityCode: ['', [Validators.required]],
          registerMethod: [''],//, [Validators.required]],
          registerCompany: [''],//, [Validators.required]],
          groupCode: [''],//, [Validators.required]],
          groupCompany: [''],//, [Validators.required]],
          salaryAreaCode: [''],//, [Validators.required]],
          taxCode: [''],//, [Validators.required]],
          code: [''],//, [Validators.required]],
          name: [''],//, [Validators.required]],
          address: [''],//, [Validators.required]],
          addressRegister: [''],//, [Validators.required]],
          delegate: [''],//, [Validators.required]],
          position: [''],//, [Validators.required]],
          delegatePage: [''],
          checked: [''],
          isHasCertificate: [''],
          dateFrom: [''],
          tel: [''],//, [Validators.pattern(REGEX.PHONE_NUMBER)]],
          personContact: [''],//, [Validators.required]],
          mobile: [''],//, [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
          emailOfContract: [''],//, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
          emailOfContractConfirm: [''],//, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
          paymentMethodCode: [''],//, [Validators.required]],
          responseResults: [''],//, [Validators.required]],
          privateKey: [''],//, [Validators.required]],
          vendorToken: [''],//, [Validators.required]],
          fromDate: [''],//, [Validators.required]],
          expired: [''],//, [Validators.required]],
        })
    }


    ngOnChanges(changes) {
    }

    ngOnDestroy() {
    }

    handleUpperCase(key) {
        const value = this.registerForm.value[key];
    
        this.registerForm.patchValue({
          [key]: value.toUpperCase()
        });
      }
    
      save() {
        console.log(this.registerForm, 'this.registerForm');
        for (const i in this.registerForm.controls) {
          this.registerForm.controls[i].markAsDirty();
          this.registerForm.controls[i].updateValueAndValidity();
        }
    
        // if (this.registerForm.invalid) {
        //   return;
        // }
      }
}
