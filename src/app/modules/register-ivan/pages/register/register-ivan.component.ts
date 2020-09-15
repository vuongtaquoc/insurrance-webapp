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
        for (const i in this.registerForm.controls) {
          this.registerForm.controls[i].markAsDirty();
          this.registerForm.controls[i].updateValueAndValidity();
        }
    
        // if (this.registerForm.invalid) {
        //   return;
        // }
      }
}
