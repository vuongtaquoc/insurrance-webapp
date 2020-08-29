import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, District } from '@app/core/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
    CityService, IsurranceDepartmentService, SalaryAreaService, CompanyService,
    PaymentMethodServiced, GroupCompanyService, DepartmentService, DistrictService, WardsService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import { REGEX } from '@app/shared/constant';


@Component({
    selector: 'app-manage-unit-form',
    templateUrl: './manage-unit-form.component.html',
    styleUrls: ['./manage-unit-form.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ManageUnitFormComponent implements OnInit, OnDestroy {
    @Input() companyInfo: any = {};

    form: FormGroup;
    cities: City[] = [];
    isurranceDepartments: any;
    registerDistricts: District[] = [];
    departments: any = [];
    salaryAreas: any = [];
    groupCompanies: any = [];
    loading: boolean = false;
    paymentMethods: any = [];
    districts: City[] = [];
    wards: City[] = [];
    private saveTimer;

    constructor(
        private formBuilder: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private cityService: CityService,
        private isurranceDepartmentService: IsurranceDepartmentService,
        private salaryAreaService: SalaryAreaService,
        private paymentMethodServiced: PaymentMethodServiced,
        private groupCompanyService: GroupCompanyService,
        private departmentService: DepartmentService,
        private districtService: DistrictService,
        private wardsService: WardsService,
        private companyService: CompanyService,

    ) { }

    ngOnInit() {
        this.loading = false;
        const companyInfo = this.companyInfo;
        this.departments = companyInfo.departments ? companyInfo.departments : [];
        this.form = this.formBuilder.group({
            cityCode: [companyInfo.cityCode, [Validators.required]],
            isurranceDepartmentId: [companyInfo.isurranceDepartmentId, [Validators.required]],
            salaryAreaCode: [companyInfo.salaryAreaCode, [Validators.required]],
            code: [companyInfo.code, [Validators.required]],
            name: [companyInfo.name, [Validators.required]],
            address: [companyInfo.address, [Validators.required]],
            addressRegister: [companyInfo.addressRegister, [Validators.required]],
            taxCode: [companyInfo.taxCode, [Validators.required]],
            tel: [companyInfo.tel, [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
            delegate: [companyInfo.delegate, [Validators.required]],
            position: [companyInfo.position, [Validators.required]],
            personContact: [companyInfo.personContact, [Validators.required]],
            mobile: [companyInfo.mobile, [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
            emailOfContract: [companyInfo.emailOfContract, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            paymentMethodCode: [companyInfo.paymentMethodCode, [Validators.required]],
            responseResults: [(companyInfo.responseResults || '0').toString(), [Validators.required]],
            privateKey: [companyInfo.privateKey, [Validators.required]],
            vendorToken: [companyInfo.vendorToken, [Validators.required]],
            fromDate: [companyInfo.fromDate, [Validators.required]],
            expired: [companyInfo.expired, [Validators.required]],
            submissionType: [(companyInfo.submissionType || '0').toString(), [Validators.required]],
            groupCode: [companyInfo.groupCode, [Validators.required]],
            wardsCode: [companyInfo.wardsCode],
            districtCode: [companyInfo.districtCode],
            subjectsCard: [(companyInfo.subjectsCard || '0').toString()],
        });

        const jobs = [
            this.cityService.getCities(),
            this.salaryAreaService.getSalaryAreas(),
            this.isurranceDepartmentService.getIsurranceDepartments(companyInfo.cityCode),
            this.groupCompanyService.getGroupCompany(),
            this.paymentMethodServiced.getPaymentMethods(),
            this.districtService.getDistrict(companyInfo.cityCode),
            this.wardsService.getWards(companyInfo.districtCode)
        ];

        forkJoin(jobs).subscribe(([cities, salaryAreas, isurranceDepartments, groupCompanies, paymentMethods, districts, wards]) => {
            this.cities = cities;
            this.salaryAreas = salaryAreas;
            this.isurranceDepartments = isurranceDepartments;
            this.groupCompanies = groupCompanies;
            this.paymentMethods = paymentMethods;
            this.wards = wards;
            this.districts = districts;
        });

        this.loading = true;
    }

    ngOnDestroy() {
        clearTimeout(this.saveTimer);
    }

    save(): void {
        
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }

        if (this.checkDuplicateDepartment()) {
            return;
        }

        if (this.form.invalid) {
            return;
        }

        this.updateCompanyInfo();
    }

    updateCompanyInfo() {
        
        const companyInfo = this.getData();
        this.companyService.update(this.companyInfo.id, this.getData()).subscribe(data => {
            this.modal.destroy(companyInfo);
        });
    }

    getData() {
        const currentCopmanyInfo = {
            ...this.form.value,
            id: this.companyInfo.id,
            companyId: this.companyInfo.companyId,
        }

        if (this.groupCode === '02' || this.groupCode === '05') {
            currentCopmanyInfo.subjectsCard = null;
            currentCopmanyInfo.departments = [];
        } else if (this.groupCode === '03') {
            currentCopmanyInfo.departments = [];
            currentCopmanyInfo.districtCode = null;
            currentCopmanyInfo.wardsCode = null;
        } else if (this.groupCode === '04') {
            currentCopmanyInfo.departments = [];
            currentCopmanyInfo.subjectsCard = null;
            currentCopmanyInfo.wardsCode = null;
        } else {
            currentCopmanyInfo.departments = this.departments;
            currentCopmanyInfo.districtCode = null;
            currentCopmanyInfo.subjectsCard = null;
            currentCopmanyInfo.wardsCode = null;
        }

        return currentCopmanyInfo;
    }

    dismiss(): void {
        this.modal.destroy();
    }


    changeRegisterCity(value) {
        if (!this.loading) {
            return;
        }

        this.districts = [];
        this.isurranceDepartments = [];
        this.wards = [];
        this.form.patchValue({
            isurranceDepartmentId: null,
            districtCode: null,
            wardsCode: null
        });
        this.getIsurranceDepartments(value);
        this.getDistricts(value);
    }


    changeDistricts(value) {

        if (!this.loading) {
            return;
        }
        this.wards = [];
        this.form.patchValue({
            wardsCode: null
        });
        this.getwards(value);
    }

    getDistricts(cityCode) {
        this.districtService.getDistrict(cityCode).subscribe(data => {
            this.districts = data;
        });
    }

    getIsurranceDepartments(cityCode) {
        this.isurranceDepartmentService.getIsurranceDepartments(cityCode).subscribe(data => {
            this.isurranceDepartments = data;
        });
    }


    getCertification() {

    }

    getwards(districtCode) {
        this.wardsService.getWards(districtCode).subscribe(data => {
            this.wards = data;
        });
    }

    get groupCode() {
        return this.form.get('groupCode').value;
    }


    changeGroup(value) {
        if (value === '01' || value === '06' || value === '07') {
            this.form.get('districtCode').clearValidators();
            this.form.get('districtCode').markAsPristine();
            this.form.get('wardsCode').clearValidators();
            this.form.get('wardsCode').markAsPristine();
            this.form.get('subjectsCard').clearValidators();
            this.form.get('subjectsCard').markAsPristine();
        } else if (value === '02' || value === '05') {
            this.form.get('districtCode').setValidators(Validators.required);
            this.form.get('wardsCode').setValidators(Validators.required);

            this.form.get('subjectsCard').clearValidators();
            this.form.get('subjectsCard').markAsPristine();
        } else if (value === '03') {
            this.form.get('subjectsCard').setValidators(Validators.required);

            this.form.get('districtCode').clearValidators();
            this.form.get('districtCode').markAsPristine();
            this.form.get('wardsCode').clearValidators();
            this.form.get('wardsCode').markAsPristine();
        }
        else if (value === '04') {
            this.form.get('districtCode').setValidators(Validators.required);

            this.form.get('wardsCode').clearValidators();
            this.form.get('wardsCode').markAsPristine();
            this.form.get('subjectsCard').clearValidators();
            this.form.get('subjectsCard').markAsPristine();

        }
        else {
            this.form.get('districtCode').clearValidators();
            this.form.get('districtCode').markAsPristine();
            this.form.get('subjectsCard').clearValidators();
            this.form.get('subjectsCard').markAsPristine();
            this.form.get('wardsCode').clearValidators();
            this.form.get('wardsCode').markAsPristine();
        }

    }


    handleUpperCase(key) {
        const value = this.form.value[key];

        this.form.patchValue({
            [key]: value.toUpperCase()
        });
    }


    checkDuplicateDepartment() {
        let isDup = false;
        let code_values = [];

        //iterate the source data
        for (let x of this.departments) {

            if (code_values.indexOf(x.code) != -1) {
                isDup = true;
                break;
            } else {
                code_values.push(x.code)
            }
        }

        return !isDup;
    }
}
