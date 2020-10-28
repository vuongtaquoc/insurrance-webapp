import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { PAGE_SIZE, GENDER, STATUS } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { SubmitDeclarationService, ExternalService } from '@app/core/services';
import { DeclarationResultOfCompanyComponent } from '@app/shared/components';

@Component({
    selector: 'app-research-connection-list',
    templateUrl: './research-connection-list.component.html',
    styleUrls: ['./research-connection-list.component.less']
})
export class ResearchConnectionListComponent implements OnInit, OnDestroy {
    selectedPage: number = 1;
    isSpinning: boolean;
    total: number;
    skip: number;
    status: any = STATUS;
    formSearch: FormGroup;
    submitDeclaration: any[] = [];
    orderby: string = '';
    orderType: string = '';

    filter: any = {};
    param: any = {
        taxCode: '',
        companyName: '',
        documentNo: '',
        description: ''
    };
    constructor(
        private formBuilder: FormBuilder,
        private submitDeclarationService: SubmitDeclarationService,
        private modalService: NzModalService,
        private translateService: TranslateService,
        private externalService: ExternalService) {

    }
    ngOnInit() {

        this.formSearch = this.formBuilder.group({
            dateFrom: [''],
            dateTo: ['']
        });

        this.getSubmitDeclaration();
    }


    getSubmitDeclaration(skip = 0, take = PAGE_SIZE) {
        this.submitDeclarationService.filterResult({
            ...this.filter,
            fromDate: this.dateFrom,
            toDate: this.dateTo,
            orderby: this.orderby,
            orderType: this.orderType,
            skip,       
            take
          }).subscribe(res => {
            this.submitDeclaration = res.data;
            this.total = res.total;
            this.skip = skip;

            if (res.data.length === 0 && this.selectedPage > 1) {
                this.skip -= PAGE_SIZE;
                this.selectedPage -= 1;

                this.getSubmitDeclaration(this.skip);
            }
        });
    }

    handleFilter(key) {

        this.filter[key] = this.param[key];
        this.selectedPage = 1;
        this.getSubmitDeclaration();
    }
    
    sort(event) {
        this.orderby = event.key;
        this.orderType = event.value;
        this.getSubmitDeclaration();
    }

    pageChange({ skip, page }) {
        this.skip = skip;
        this.selectedPage = page;

        this.getSubmitDeclaration(skip);
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

    onChangeDateTime () {
        this.getSubmitDeclaration();
      }

    ngOnDestroy() {

    }

    viewResult(data) {
        this.loadResultOfDeclaration(data);
    }

    private loadResultOfDeclaration(declaration) {
        this.isSpinning = true;
    
        this.externalService.getProcessDeclarationOfCompany(declaration.id).subscribe(data => {
          const modal = this.modalService.create({
            nzWidth: 980,
            nzWrapClassName: 'document-modal',
            nzTitle: 'Kết quả tiếp nhận hồ sơ số : ' + declaration.documentNo,
            nzContent: DeclarationResultOfCompanyComponent,
            nzOnOk: (data) => console.log('Click ok', data),
            nzComponentParams: {
              declarationFileInfo: data,
            }
          });
      
          modal.afterClose.subscribe(result => {
          });
    
          this.isSpinning = false;
    
        });
    }
}