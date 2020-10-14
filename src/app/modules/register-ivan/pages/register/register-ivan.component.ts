import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MustMatch } from "@app/shared/constant";
import { DeclarationService, AuthenticationService, CompanyService, IsurranceDepartmentService, DocumentListService } from '@app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-register-ivan',
    templateUrl: './register-ivan.component.html',
    styleUrls: ['./register-ivan.component.less']
})
export class RegisterIvanComponent implements OnInit, OnDestroy {
    checked: boolean = false;
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
    }


    ngOnChanges(changes) {
    }

    ngOnDestroy() {

    }
}
