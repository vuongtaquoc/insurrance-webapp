import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';

import {
  CityService,
  DistrictService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService,
  SalaryAreaService,
  PaymentMethodServiced,
  PaymentStatusServiced,
  RelationshipService,
  BankService
} from '@app/core/services';

import { DATE_FORMAT } from '@app/shared/constant';

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
  registerDistricts: District[] = [];
  registerWards: Wards[] = [];
  recipientsDistricts: District[] = [];
  recipientsWards: Wards[] = [];
  paymentStatus: DropdownItem[] = [];
  paymentMethods: DropdownItem[] = [];
  relationships: DropdownItem[] = [];
  banks: DropdownItem[] = [];
  hospitals: DropdownItem[] = [];
  families: any[] = [];
  evolutionIsurrances: any[] = [];
  processSubject: Subject<string> = new Subject<string>();
  familySubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private cityService: CityService,
    private districtService: DistrictService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private paymentMethodServiced: PaymentMethodServiced,
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
       paymentMethods, relationships, banks ]) => {
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
      typeBirthday: ['1'],
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
      orders: ['']
    });
  }

  save(): void {
    const formData = {
      ...this.employeeForm.value,
      birthday: this.employeeForm.value.birthday.toString(),
      families: this.families.reduce(
        (combine, current) => {
          if (current.fullName) {
            return [ ...combine, current ];
          }

          return [ ...combine ];
        },
        []
      ),
      evolutionIsurrances: this.evolutionIsurrances.reduce(
        (combine, current) => {
          if (current.fromDate) {
            return [ ...combine, current ];
          }

          return [ ...combine ];
        },
        []
      )
    };

    this.modal.destroy(formData);
  }

  dismiss(): void {
    this.modal.destroy();
  }

  handleChangeFamilyTable({ records, columns }) {
    const families = [];

    records.forEach(record => {
      families.push(this.arrayToProps(record, columns));
    });

    this.families = families;
  }

  handleDeleteFamilyData({ rowNumber, numOfRows }) {
    const families = [ ...this.families ];

    families.splice(rowNumber, numOfRows);

    this.updateOrders(families);

    this.families = families;
  }

  handleChangeProcessTable({ records, columns }) {
    const evolutionIsurrances = [];

    records.forEach(record => {
      evolutionIsurrances.push(this.arrayToProps(record, columns));
    });

    this.evolutionIsurrances = evolutionIsurrances;
  }

  handleDeleteProcessData({ rowNumber, numOfRows }) {
    const evolutionIsurrances = [ ...this.evolutionIsurrances ];

    evolutionIsurrances.splice(rowNumber, numOfRows);

    this.updateOrders(evolutionIsurrances);

    this.evolutionIsurrances = evolutionIsurrances;
  }

  changeTab({ index }) {
    if (index === 1) {
      this.processSubject.next('ready');
    } else if (index === 2) {
      this.familySubject.next('ready');
    }
  }

  changeRegisterCity(value) {
    this.districtService.getDistrict(value).subscribe(data => this.registerDistricts = data);
  }

  changeRegisterDistrict(value) {
    this.wardService.getWards(value).subscribe(data => this.registerWards = data);
  }

  changeRecipientsCity(value) {
    this.districtService.getDistrict(value).subscribe(data => this.recipientsDistricts = data);
  }

  changeRecipientsDistrict(value) {
    this.wardService.getWards(value).subscribe(data => this.recipientsWards = data);
  }

  changeFirstRegisterCity(value) {
    this.hospitalService.getHospitals(value).subscribe(data => this.hospitals = data);
  }

  private arrayToProps(array, columns) {
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];

        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'numberic') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );

    return object;
  }

  private updateOrders(data) {
    const order: { index: 0 } = { index: 0 };

    data.forEach((d, index) => {
      order.index += 1;

      d.orders = order.index;
    });
  }

  get birthdayType() {
    return this.employeeForm.get('typeBirthday').value;
  }

  get fullName() {
    return this.employeeForm.get('fullName').value;
  }

  get birthday() {
    const birthday = this.employeeForm.get('birthday').value;
    const format = this.birthdayType === '1' ? DATE_FORMAT.BIRTHDAY_ONLY_MONTH_YEAR : DATE_FORMAT.BIRTHDAY_ONLY_YEAR;

    return moment(birthday).format(format);
  }

  get insurranceCode() {
    return this.employeeForm.get('isurranceCode').value;
  }
}
