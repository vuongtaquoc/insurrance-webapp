import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { EmailNotificationService } from '@app/core/services';
import { PAGE_SIZE, GENDER, STATUSENDEMAIL, EMAILTYPE } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { NzModalService } from 'ng-zorro-antd/modal';
import { EmailFormComponent } from '@app/shared/components';

@Component({
    selector: 'app-emails-notification-list',
    templateUrl: './emails-notification-list.component.html',
    styleUrls: ['./emails-notification-list.component.less']
})
export class EmailsNotificationListComponent implements OnInit, OnDestroy {
    notificationEmails: any[] = [];
    selectedPage: number = 1;
    total: number;
    skip: number;
    status: any = STATUSENDEMAIL;
    emailType: any = EMAILTYPE;
    formSearch: FormGroup;
    keyword: string = '';

    shortColumn: any = {
        key: '',
        value: ''
    };

    filter: any = {
        title: '',
        to: '',
        status: '',
        createDate: ''
    };

    constructor(
        private formBuilder: FormBuilder,
        private emailNotificationService: EmailNotificationService,
        private messageService: NzMessageService,
        private translateService: TranslateService,
        private modalService: NzModalService,
    ) {

    }
    ngOnInit() {
        this.formSearch = this.formBuilder.group({
            keyword: [''],
            dateFrom: [''],
            dateTo: ['']
        });

        this.getNotification();


    }


    getNotification(skip = 0, take = PAGE_SIZE) {
        this.emailNotificationService.getList({
            name: this.keyword,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            skip,
            take,
            orderType: (this.shortColumn.value || ''),
            orderby: (this.shortColumn.key || '')
        }).subscribe(res => {
            this.notificationEmails = res.data;
            this.total = res.total;
            this.skip = skip;

            if (res.data.length === 0 && this.selectedPage > 1) {
                this.skip -= PAGE_SIZE;
                this.selectedPage -= 1;

                this.getNotification(this.skip);
            }
        });
    }

    handleFilter(key) {
        this.keyword = this.filter[key];
        // this.getNotification();
    }


    sort(event) {
        this.shortColumn = event;
        this.getNotification();
    }


    // get keyword() {
    //     return this.formSearch.get('keyword').value;
    // }

    get dateTo() {
        const dateTo = this.formSearch.get('dateTo').value;

        if (!dateTo) return '';

        const birth = getBirthDay(dateTo, false, false);

        return birth.format;
    }

    get dateFrom() {
        const dateFrom = this.formSearch.get('dateFrom').value;
        if (!dateFrom) return '';

        const birth = getBirthDay(dateFrom, false, false);

        return birth.format;
    }

    delete(id) {
        this.emailNotificationService.delete(id).subscribe(() => {
            this.getNotification(this.skip);
        });
    }

    handleSearchBox() {
        this.getNotification();
    }

    ngOnDestroy() {

    }

    sendEmail(data) {
        this.showDialogAccountManagement(data);
    }

    private showDialogAccountManagement(emailInfo: any) {
        const modal = this.modalService.create({
          nzWidth: 960,
          nzWrapClassName: 'account-modal',
          nzTitle: `Tiêu đề:  ${ emailInfo.title }`,
          nzContent: EmailFormComponent,
          nzOnOk: (data) => console.log('Click ok', data),
          nzComponentParams: {
            emailInfo
          }
        });
    
        modal.afterClose.subscribe(result => {

          if(result && result.isSuccess) {

            this.modalService.success({
              nzTitle: 'Gửi email thành công'
            });
            this.getNotification();
    
          }
        });      
    }

    
}