import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NotificationService } from '@app/core/services';
import { PAGE_SIZE, GENDER } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';

@Component({
    selector: 'app-notification-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: [
        './notifications-list.component.less',
        '../../../../../agencies/pages/agencies/agencies-list/agencies-list.component.less'
    ]
})
export class NotificationsListComponent implements OnInit, OnDestroy {
    notifications: any[] = [];
    selectedPage: number = 1;
    total: number;
    skip: number;
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
        private notificationService: NotificationService,
        private messageService: NzMessageService,
        private translateService: TranslateService
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
        this.notificationService.gets({
            name: this.keyword,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            skip,
            take,
            orderType: (this.shortColumn.value || ''),
            orderby: (this.shortColumn.key || '')
        }).subscribe(res => {
            this.notifications = res.data;
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
        this.getNotification();
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
        this.notificationService.delete(id).subscribe(() => {
            this.getNotification(this.skip);
        },
            (err) => {
                this.translateService.get(err.message).subscribe(message => {
                    this.messageService.create('error', message);
                });
            });
    }

    handleSearchBox() {
        this.getNotification();
    }

    ngOnDestroy() {

    }
}