import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { DropdownItem } from '@app/core/interfaces';
import { City } from '@app/core/models';

import {
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService,
  SalaryAreaService,
  PaymentMethodServiced,
  PlanService,
  PaymentStatusServiced,
  RelationshipService,
  BankService
} from '@app/core/services';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  cities: City[] = [];
  nationalities: DropdownItem[] = [];
  peoples: DropdownItem[] = [];
  salaryAreas: DropdownItem[] = [];
  districts: DropdownItem[] = [];
  wards: DropdownItem[] = [];
  paymentStatus: DropdownItem[] = [];
  paymentMethods: DropdownItem[] = [];
  relationships: DropdownItem[] = [];
  banks: DropdownItem[] = [];
  processSubject: Subject<string> = new Subject<string>();
  familySubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private cityService: CityService,
    private districtService: DistrictService,
    private declarationService: DeclarationService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private paymentMethodServiced: PaymentMethodServiced,
    private planService: PlanService,
    private paymentStatusServiced: PaymentStatusServiced,
    private relationshipService: RelationshipService,
    private bankService: BankService,
  ) {}

  ngOnInit() {
    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.paymentStatusServiced.getPaymentStatus(),
      this.paymentMethodServiced.getPaymentMethods(),
      this.relationshipService.getRelationships(),
      this.bankService.getBanks()
      
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, paymentStatus,
       paymentMethods,relationships, banks ]) => {
      this.nationalities = nationalities;
      this.peoples = peoples;
      this.salaryAreas = salaryAreas;
      this.cities = cities;
      this.paymentStatus = paymentStatus;
      this.paymentMethods = paymentMethods;
      this.relationships = relationships;
      this.banks = banks;
    });

    this.employeeForm = this.formBuilder.group({
      fullName: [''],
      birthday: [''],
      gender: [''],
      nationalityCode: [''],
      peopleCode: [''],
      code: [''],
      departmentId: [''],
      registerCityCode: [''],
      registerDistrictCode: [''],
      registerWardsCode: [''],
      recipientsCityCode: [''],
      recipientsDistrictCode: [''],
      recipientsWardsCode: [''],
      isurranceCode: [''],
      mobile: [''],
      identityCar: [''],
      familyNo: [''],
      isurranceNo: [''],
      healthNo: [''],
      contractNo: [''],
      dateSign: [''],
      levelWork: [''],
      salary: [''],
      ratio: [''],
      salaryAreaCode: [''],
      paymentMethodCode: [''],
      rate: [''],
      cityFirstRegistCode: [''],
      hospitalFirstRegistCode: [''],
      allowanceLevel: [''],
      allowanceSeniority: [''],
      allowanceSeniorityJob: [''],
      allowanceSalary: [''],
      allowanceAdditional: [''],
      allowanceOther: [''],
      mstncn: [''],
      bankAccount: [''],
      bankId: [''],
      accountHolder: [''],
      paymentStatusCode: [''],
      orders: [''],

    });
  }

  save(): void {
    this.modal.destroy({ data: 'xxx' });
  }

  dismiss(): void {
    this.modal.destroy();
  }

  changeTab({ index }) {
    if (index === 1) {
      this.processSubject.next('ready');
    } else if (index === 2) {
      this.familySubject.next('ready');
    }
  }
}
