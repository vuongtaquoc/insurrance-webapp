import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subject } from 'rxjs';
import { MustMatch, HumCommand } from "@app/shared/constant";
import { DeclarationService, AuthenticationService, CompanyService,
     IsurranceDepartmentService, DocumentListService, HubService } from '@app/core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import index from 'resize-observer-polyfill';
import { eventEmitter } from '@app/shared/utils/event-emitter';
const TAB_NAMES = {
    0: 'switch',
    1: 'register',
    2: 'adjust'
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
    tabIndex: number = 1;
    panel: any = {
        general: { active: false },
        attachment: { active: false }
    };
    
    constructor(
        protected declarationService: DeclarationService,
        private formBuilder: FormBuilder,
        private hubService: HubService,
        private modalService: NzModalService,
    ) {
    }

    ngOnInit() {
        this.hubService.connectHub(this.getResultHub.bind(this));
    }

    getResultHub(data) { 
        data.tabIndex = this.tabIndex;
        if (this.tabIndex == 0) {
            this.showMesssageChageIVAN(data);
        } else {
            this.showMessageSign(data);
        }
        eventEmitter.emit("resultHub:sign", data);
    }

    showMesssageChageIVAN(data) {
        let mesage = 'Ký số tờ khai thành công';
        if(!data || !data.status) 
        {
          mesage = 'Ký số tờ khai lỗi, vui lòng liên hệ với quản trị';
        }
    
        this.modalService.success({
          nzTitle: mesage,
        });
    }

    showMessageSign(data) {
        if(data.command === HumCommand.signDocument)  {
            this.modalService.success({
                nzTitle: 'Ký số tờ khai thành công'
            });
        }
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
