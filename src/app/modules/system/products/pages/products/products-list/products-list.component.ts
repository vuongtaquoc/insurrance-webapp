import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { PAGE_SIZE, GENDER } from '@app/shared/constant';
import { ProductService } from '@app/core/services';

@Component({
    selector: 'app-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.less']
})
export class ProductsListComponent implements OnInit, OnDestroy {
    selectedPage: number = 1;
    total: number;
    skip: number;
    formSearch: FormGroup;
    products: any[] = [];
    keyword: string = '';
    shortColumn: any = {
        key: '',
        value: ''
    };

    filter: any = {
        productName: '',
        unitCode: '',
        useTime: '',
        productPrice: '',
        status: ''
    };

    constructor(
        private formBuilder: FormBuilder,
        private productService: ProductService,
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

        this.getProducts();


    }


    getProducts(skip = 0, take = PAGE_SIZE) {
        this.productService.getList({
            name: this.keyword,
            dateFrom: this.dateFrom,
            dateTo: this.dateTo,
            skip,
            take,
            orderType: (this.shortColumn.value || ''),
            orderby: (this.shortColumn.key || '')
        }).subscribe(res => {
            this.products = res.data;
            this.total = res.total;
            this.skip = skip;

            if (res.data.length === 0 && this.selectedPage > 1) {
                this.skip -= PAGE_SIZE;
                this.selectedPage -= 1;

                this.getProducts(this.skip);
            }
        });
    }

    handleFilter(key) {
        this.keyword = this.filter[key];
        this.getProducts();
    }


    sort(event) {
        this.shortColumn = event;
        this.getProducts();
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
        this.productService.delete(id).subscribe(() => {
            this.getProducts(this.skip);
        },
            (err) => {
                this.translateService.get(err.message).subscribe(message => {
                    this.messageService.create('error', message);
                });
            });
    }

    handleSearchBox() {
        this.getProducts();
    }

    ngOnDestroy() {

    }
}