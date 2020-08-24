import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { City, District } from '@app/core/models';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { CityService, DistrictService } from '@app/core/services';
import { forkJoin } from 'rxjs';
import { REGEX } from '@app/shared/constant';


@Component({
    selector: 'app-manage-unit-form',
    templateUrl: './manage-unit-form.component.html',
    styleUrls: ['./manage-unit-form.component.less'],
    encapsulation: ViewEncapsulation.None
})
export class ManageUnitFormComponent implements OnInit, OnDestroy {
    @Input() manageUnit: any = {};

    form: FormGroup;
    cities: City[] = [];
    registerDistricts: District[] = [];
    departments: any = [];
    private saveTimer;

    constructor(
        private formBuilder: FormBuilder,
        private modal: NzModalRef,
        private modalService: NzModalService,
        private cityService: CityService,
        private districtService: DistrictService,
    ) { }

    ngOnInit() {
        const manageUnit = this.manageUnit;

        this.form = this.formBuilder.group({
            registerCityCode: [manageUnit.registerCityCode, [Validators.required]],
            registerDistrictCode: [manageUnit.registerDistrictCode, [Validators.required]],
            manageUnitCode: [manageUnit.manageUnitCode, [Validators.required]],
            region: [manageUnit.region, [Validators.required]],
            manageUnitName: [manageUnit.manageUnitName, [Validators.required]],
            address: [manageUnit.address, [Validators.required]],
            tradingAddress: [manageUnit.tradingAddress, [Validators.required]],
            taxCode: [manageUnit.taxCode, [Validators.required]],
            landlinePhone: [manageUnit.landlinePhone, [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
            representation: [manageUnit.representation, [Validators.required]],
            position: [manageUnit.position, [Validators.required]],
            transactor: [manageUnit.transactor, [Validators.required]],
            mobilePhone: [manageUnit.mobilePhone, [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
            to: [manageUnit.to, [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            paymentMethod: [manageUnit.paymentMethod, [Validators.required]],
            registerResult: [manageUnit.registerResult, [Validators.required]],
            tokenSerial: [manageUnit.tokenSerial, [Validators.required]],
            issuer: [manageUnit.issuer, [Validators.required]],
            fromDate: [manageUnit.fromDate, [Validators.required]],
            toDate: [manageUnit.toDate, [Validators.required]],
            signProcess: [manageUnit.signProcess, [Validators.required]],
            userGroup: [manageUnit.userGroup, [Validators.required]],
        });

        const jobs = [
            this.cityService.getCities(),

        ];

        if (manageUnit.registerCityCode) jobs.push(this.districtService.getDistrict(manageUnit.registerCityCode));

        forkJoin(jobs).subscribe(([cities, registerDistricts,]) => {
            this.cities = cities;
        });
    }

    ngOnDestroy() {
        clearTimeout(this.saveTimer);
    }

    save(): void {
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }

        if (this.form.invalid) {
            return;
        }
    }

    dismiss(): void {
        this.modal.destroy();
    }


    changeRegisterCity(value) {
        if (!value) {
            return;
        }
        this.districtService.getDistrict(value).subscribe(data => this.registerDistricts = data);
        this.form.patchValue({
            recipientsCityCode: value
        });

    }

}
