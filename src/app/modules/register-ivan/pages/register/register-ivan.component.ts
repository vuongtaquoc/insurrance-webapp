import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { MustMatch } from "@app/shared/constant";
import { DeclarationService, AuthenticationService, CompanyService, IsurranceDepartmentService, DocumentListService } from '@app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
const TAB_NAMES = {
    1: 'switch',
    2: 'register',
    3: 'adjust'
  };
@Component({
    selector: 'app-register-ivan',
    templateUrl: './register-ivan.component.html',
    styleUrls: ['./register-ivan.component.less']
})
export class RegisterIvanComponent implements OnInit, OnDestroy {
    checked: boolean = false;
    registerForm: FormGroup;
    tabSubject: Subject<any> = new Subject<any>();
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

    handleSelectTab({ index }) {
        this.tabSubject.next({
          type: 'change',
          selected: TAB_NAMES[index]
        });
      }
}
