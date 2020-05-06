import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';

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
  BankService,
  EmployeeService,
  DepartmentService,
  VillageService
} from '@app/core/services';

import { DATE_FORMAT } from '@app/shared/constant';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: any = {};

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
  relationshipCities: District[] = [];
  relationshipDistricts: District[] = [];
  relationshipWards: Wards[] = [];
  departments: DropdownItem[] = [];
  relationshipVillages: DropdownItem[] = [];
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
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private villageService: VillageService,
  ) {}

  ngOnInit() {
    const employee = this.employee;
    const jobs = [
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.paymentStatusServiced.getPaymentStatus(),
      this.paymentMethodServiced.getPaymentMethods(),
      this.relationshipService.getRelationships(),
      this.bankService.getBanks(),
      this.departmentService.getDepartments(),
    ];

    if (employee.registerCityCode) jobs.push(this.districtService.getDistrict(employee.registerCityCode));
    if (employee.registerDistrictCode) jobs.push(this.wardService.getWards(employee.registerDistrictCode));
    if (employee.recipientsCityCode) jobs.push(this.districtService.getDistrict(employee.recipientsCityCode));
    if (employee.recipientsDistrictCode) jobs.push(this.wardService.getWards(employee.recipientsDistrictCode));
    if (employee.cityFirstRegistCode) jobs.push(this.hospitalService.getHospitals(employee.cityFirstRegistCode));
    if (employee.relationshipCityCode) jobs.push(this.districtService.getDistrict(employee.relationshipCityCode));
    if (employee.relationshipDistrictCode) jobs.push(this.wardService.getWards(employee.relationshipDistrictCode));
    if (employee.relationshipWardsCode) jobs.push(this.villageService.getVillage(employee.relationshipWardsCode));

    forkJoin(jobs).subscribe(([ cities, nationalities, peoples, salaryAreas, paymentStatus,
       paymentMethods, relationships, banks, departments,
       registerDistricts, registerWards, recipientsDistricts, recipientsWards, hospitals, relationshipDistricts, relationshipWards, relationshipVillages ]) => {
      this.nationalities = nationalities;
      this.peoples = peoples;
      this.salaryAreas = salaryAreas;
      this.cities = cities;
      this.paymentStatus = paymentStatus;
      this.paymentMethods = paymentMethods;
      this.relationships = relationships;
      this.banks = banks;
      this.departments = departments;

      if (registerDistricts) this.registerDistricts = registerDistricts;
      if (registerWards) this.registerWards = registerWards;
      if (recipientsDistricts) this.recipientsDistricts = recipientsDistricts;
      if (recipientsWards) this.recipientsWards = recipientsWards;
      if (hospitals) this.hospitals = hospitals;
      if (relationshipDistricts) this.relationshipDistricts = relationshipDistricts;
      if (relationshipWards) this.relationshipWards = relationshipWards;
      if (relationshipVillages) this.relationshipVillages = relationshipVillages;
    });

    const dateFormat = employee.typeBirthday === '1' ? DATE_FORMAT.ONLY_MONTH_YEAR : DATE_FORMAT.ONLY_YEAR;
    const birthday = employee.birthday ? moment(employee.birthday, dateFormat) : '';
    const dateSign = employee.dateSign ? moment(employee.dateSign, DATE_FORMAT.FULL) : '';

    this.employeeForm = this.formBuilder.group({
      fullName: [employee.fullName, Validators.required],
      birthday: [birthday ? new Date(birthday.valueOf()) : '', Validators.required],
      typeBirthday: [employee.typeBirthday || '1'],
      gender: [employee.gender, Validators.required],
      nationalityCode: [employee.nationalityCode, Validators.required],
      peopleCode: [employee.peopleCode, Validators.required],
      code: [employee.code, Validators.required],
      departmentId: [employee.departmentId ? Number(employee.departmentId) : ''],
      registerCityCode: [employee.registerCityCode, Validators.required],
      registerDistrictCode: [employee.registerDistrictCode, Validators.required],
      registerWardsCode: [employee.registerWardsCode, Validators.required],
      recipientsCityCode: [employee.recipientsCityCode, Validators.required],
      recipientsDistrictCode: [employee.recipientsDistrictCode, Validators.required],
      recipientsWardsCode: [employee.recipientsWardsCode, Validators.required],
      recipientsAddress: [employee.recipientsAddress, Validators.required],
      isurranceCode: [employee.isurranceCode],
      mobile: [employee.mobile],
      identityCar: [employee.identityCar, Validators.required],
      familyNo: [employee.familyNo],
      isurranceNo: [employee.isurranceNo],
      healthNo: [employee.healthNo],
      contractNo: [employee.contractNo, Validators.required],
      dateSign: [employee.dateSign ? new Date(dateSign.valueOf()) : '', Validators.required],
      levelWork: [employee.levelWork, Validators.required],
      salary: [employee.salary, Validators.required],
      ratio: [employee.ratio, Validators.required],
      salaryAreaCode: [employee.salaryAreaCode, Validators.required],
      paymentMethodCode: [employee.paymentMethodCode],
      rate: [employee.rate, Validators.required],
      cityFirstRegistCode: [employee.cityFirstRegistCode, Validators.required],
      hospitalFirstRegistCode: [employee.hospitalFirstRegistCode, Validators.required],
      allowanceLevel: [employee.allowanceLevel],
      allowanceSeniority: [employee.allowanceSeniority],
      allowanceSeniorityJob: [employee.allowanceSeniorityJob],
      allowanceSalary: [employee.allowanceSalary],
      allowanceAdditional: [employee.allowanceAdditional],
      allowanceOther: [employee.allowanceOther],
      mstncn: [employee.mstncn],
      bankAccount: [employee.bankAccount],
      bankId: [employee.bankId ? employee.bankId.toString() : ''],
      accountHolder: [employee.accountHolder],
      paymentStatusCode: [employee.paymentStatusCode],
      orders: [employee.orders],
      relationshipFullName: [employee.relationshipFullName, Validators.required],
      relationshipDocumentType:[employee.relationshipDocumentType ? Number(employee.relationshipDocumentType) : ''],
      relationshipBookNo: [employee.relationshipBookNo],
      relationshipCityCode: [employee.relationshipCityCode, Validators.required],
      relationshipDistrictCode: [employee.relationshipDistrictCode, Validators.required],
      relationshipWardsCode: [employee.relationshipWardsCode, Validators.required],
      relationshipVillageCode: [employee.relationshipVillageCode],
      relationshipMobile: [employee.relationshipMobile]
    });

    // update table data
    if (employee.families) {
      this.families = employee.families;
    }

    if (employee.evolutionIsurrances) {
      this.evolutionIsurrances = employee.evolutionIsurrances;
    }
  }

  save(): void {
    for (const i in this.employeeForm.controls) {
      this.employeeForm.controls[i].markAsDirty();
      this.employeeForm.controls[i].updateValueAndValidity();
    }

    if (this.employeeForm.invalid) {
      return;
    }

    const formData = this.getData();

    if (this.employee.id) {
      this.employeeService.update(this.employee.id, formData).subscribe(() => {
        this.modal.destroy(formData);
      });
    } else {
      this.employeeService.create(formData).subscribe(() => {
        this.modal.destroy(formData);
      });
    }
  }

  getData() {
    const formData = {
      ...this.employeeForm.value,
      birthday: this.birthday,
      dateSign: this.dateSign,
      nationalityName: this.getNameOfDropdown(this.nationalities , this.employeeForm.value.nationalityCode),
      hospitalFirstRegistName: this.getNameOfDropdown(this.hospitals , this.employeeForm.value.hospitalFirstRegistCode),
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
    return formData;
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

  changeRelationshipWards(value) {
    this.villageService.getVillage(value).subscribe(data => this.relationshipVillages = data);
  }

  changeRelationshipCities(value) {
    this.districtService.getDistrict(value).subscribe(data => this.relationshipDistricts = data);
  }

  changeRelationshipDistrict(value) {
    this.wardService.getWards(value).subscribe(data => this.relationshipWards = data);
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

    if (!birthday) return '';

    const format = this.birthdayType === '1' ? DATE_FORMAT.ONLY_MONTH_YEAR : DATE_FORMAT.ONLY_YEAR;

    return moment(birthday).format(format);
  }

  get insurranceCode() {
    return this.employeeForm.get('isurranceCode').value;
  }

  get dateSign() {
    const dateSign = this.employeeForm.get('dateSign').value;

    if (!dateSign) return '';

    return moment(dateSign).format(DATE_FORMAT.FULL);
  }

  getNameOfDropdown(sourceOfDropdown: any, id: string) {
    let name = '';
    const item = _.find(sourceOfDropdown, {
      id: id,
    });

    if (item) {
      name = item.name;
    }
    return name;
  }

}
