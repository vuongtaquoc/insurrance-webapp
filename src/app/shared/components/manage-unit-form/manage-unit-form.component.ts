import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, District } from '@app/core/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
    CityService, IsurranceDepartmentService, SalaryAreaService, CompanyService,
    PaymentMethodServiced, GroupCompanyService, DepartmentService, DistrictService, WardsService,
    AuthenticationService, CoefficientService,
    CategoryService, BenefitLevelService
} from '@app/core/services';
import { forkJoin } from 'rxjs';
import { REGEX, CRON_TIMES, schemaSign } from '@app/shared/constant';


@Component({
    selector: 'app-manage-unit-form',
    templateUrl: './manage-unit-form.component.html',
    styleUrls: ['./manage-unit-form.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ManageUnitFormComponent implements OnInit, OnDestroy {
    @Input() companyInfo: any = {};
    isShowObjectType: any = true;
    isShowCalculationType: any = true;
    isShowCoefficient: any = true;

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
    authenticationToken: string;
    shemaUrl: any;
    times: any[] = [];
    timer: any;
    loaddingToken: boolean = false;
    benefitLevels: any;
    coefficients: any;
    calculationTypes: any;

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
        private authenticationService: AuthenticationService,
        private benefitLevelService: BenefitLevelService,
        private coefficientService: CoefficientService,
        private categoryService: CategoryService,

    ) { }

    ngOnInit() {
        this.loading = false;
        const companyInfo = this.companyInfo;
        this.departments = companyInfo.departments ? companyInfo.departments : [];
        this.form = this.formBuilder.group({
            cityCode: [{ value: companyInfo.cityCode, disabled: true }, [Validators.required]],
            isurranceDepartmentCode: [{ value: companyInfo.isurranceDepartmentCode, disabled: true }, [Validators.required]],
            salaryAreaCode: [companyInfo.salaryAreaCode, [Validators.required]],
            isurranceCode: [{ value: companyInfo.isurranceCode, disabled: true }, [Validators.required]],
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
            interestCalculation: [(companyInfo.interestCalculation || '0').toString(), [Validators.required]],
            groupCode: [companyInfo.groupCode, [Validators.required]],
            objectType: [companyInfo.objectType, [Validators.required]],
            calculationType: [(companyInfo.calculationType || '0').toString(), [Validators.required]],
            coefficient: [(companyInfo.coefficient || '0').toString(), [Validators.required]],
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
            this.wardsService.getWards(companyInfo.districtCode),
            this.benefitLevelService.filter(),
            this.coefficientService.filter(),
            this.categoryService.getCategories('calculationtype')
        ];

        forkJoin(jobs).subscribe(([cities, salaryAreas, isurranceDepartments, groupCompanies, paymentMethods, districts, wards, benefitLevels, coefficients, calculationTypes]) => {
            this.cities = cities;
            this.salaryAreas = salaryAreas;
            this.isurranceDepartments = isurranceDepartments;
            this.groupCompanies = groupCompanies;
            this.paymentMethods = paymentMethods;
            this.wards = wards;
            this.districts = districts;
            this.benefitLevels = benefitLevels;
            this.coefficients = coefficients;
            this.calculationTypes = calculationTypes;
        });

        this.loading = true;
        this.buildShemaURL();
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
            ...this.form.getRawValue(),
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
            isurranceDepartmentCode: null,
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
        const link = document.createElement('a');
        link.href = this.shemaUrl;
        link.click();
        this.loaddingToken = true;
        this.cronJob();
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

        this.hideControl(value);

    }

    hideControl(value) {
        switch (value) {
            case "01":
            case "07":
                this.isShowObjectType = this.isShowCalculationType = this.isShowCoefficient = false;
                break;

            case "05":
                this.isShowCoefficient = false;
                this.isShowObjectType = this.isShowCalculationType = true;
                break;
            case "06":
                this.isShowObjectType = this.isShowCalculationType = false;
                this.isShowCoefficient = true;
                break;
            default:
                this.isShowObjectType = this.isShowCalculationType = this.isShowCoefficient = true;
                break;
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

            if (x.id != "") {
                if (code_values.indexOf(x.id) != -1) {
                    isDup = true;
                    break;
                } else {
                    code_values.push(x.id)
                }
            }

        }

        return isDup;
    }

    private buildShemaURL() {
        this.authenticationToken = this.authenticationService.currentCredentials.token;
        let shemaSign = window['schemaSign'] || schemaSign;
        shemaSign = shemaSign.replace('token', this.authenticationToken);
        this.shemaUrl = shemaSign.replace('declarationId', 'sign');
    }

    cronJob() {

        if (this.loaddingToken) {

            this.timer = setTimeout(() => {
                this.getTokenInfo();
                this.cronJob();

            }, CRON_TIMES);

        } else {
            clearTimeout(this.timer);
        }
    }

    private getTokenInfo() {

        const companyId = this.authenticationService.currentCredentials.companyInfo.id;
        this.companyService.getCompanyInfo(companyId).subscribe(data => {
            this.form.patchValue({
                privateKey: data.privateKey,
                vendorToken: data.vendorToken,
                fromDate: data.fromDate,
                expired: data.expired,
            });

            this.loaddingToken = false;
        });

    }
}
