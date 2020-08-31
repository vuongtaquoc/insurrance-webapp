import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { PAGE_SIZE, GENDER, STATUS } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { AccountService } from '@app/core/services';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.less']
})
export class AccountListComponent implements OnInit, OnDestroy {
    selectedPage: number = 1;
    total: number;
    skip: number;
    status: any = STATUS;
    formSearch: FormGroup;
    accounts: any[] = [];
    keyword: string = '';
    shortColumn: any = {
        key: '',
        value: ''
    };

    filter: any = {
        fullName: '',
        userName: '',
        tel: '',
        email: '',
        status: ''
    };

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private messageService: NzMessageService,
        private translateService: TranslateService) {

    }
    ngOnInit() {

        this.formSearch = this.formBuilder.group({
            keyword: [''],
            dateFrom: [''],
            dateTo: ['']
        });

        this.getAccounts();
    }


    getAccounts(skip = 0, take = PAGE_SIZE) {
        this.accountService.getList({
            name: this.keyword,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            skip,
            take,
            orderType: (this.shortColumn.value || ''),
            orderby: (this.shortColumn.key || '')
        }).subscribe(res => {
            this.accounts = res.data;
            this.total = res.total;
            this.skip = skip;

            if (res.data.length === 0 && this.selectedPage > 1) {
                this.skip -= PAGE_SIZE;
                this.selectedPage -= 1;

                this.getAccounts(this.skip);
            }
        });
    }

    handleFilter(key) {
        this.keyword = this.filter[key];
        this.getAccounts();
    }


    sort(event) {
        this.shortColumn = event;
        this.getAccounts();
    }
 
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
        this.accountService.delete(id).subscribe(() => {
            this.getAccounts(this.skip);
        });
    }

    handleSearchBox() {
        this.getAccounts();
    }

    ngOnDestroy() {

    }
}