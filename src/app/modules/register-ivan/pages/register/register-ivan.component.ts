import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { MustMatch } from "@app/shared/constant";
import { DeclarationService, AuthenticationService, CompanyService,
     IsurranceDepartmentService, DocumentListService, HubService } from '@app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import index from 'resize-observer-polyfill';
import { eventEmitter } from '@app/shared/utils/event-emitter';
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
    tabIndex: number = 2;
    panel: any = {
        general: { active: false },
        attachment: { active: false }
    };
    
    constructor(
        protected declarationService: DeclarationService,
        private formBuilder: FormBuilder,
        private hubService: HubService,
    ) {
    }

    ngOnInit() {
        this.hubService.connectHub(this.getResultHub.bind(this));
    }

    getResultHub(data) { 
        data.tabIndex = this.tabIndex;
        eventEmitter.emit("resultHub:sign", data);
    }

    ngOnChanges(changes) {
        
    }

    ngOnDestroy() {

    }

    handleSelectTab({ index }) {
        this.tabIndex = index;
        this.tabSubject.next({
          type: 'change',
          selected: TAB_NAMES[index]
        });
      }
}
