import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DropdownItem } from '@app/core/interfaces';
import { City, District, Wards } from '@app/core/models';
import { EmployeeHospitalRegisterFormComponent } from './hospital-register-form.component';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from './family-table.data';
import { TABLE_PROCESS_NESTED_HEADERS, TABLE_PROCESS_HEADER_COLUMNS } from './process-table.data';
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
  VillageService,
  CategoryService
} from '@app/core/services';

import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { validateLessThanEqualNow } from '@app/shared/utils/custom-validation';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeFormComponent implements OnInit {
  @Input() employee: any = {};
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  tableNestedHeadersProcess: any[] = TABLE_PROCESS_NESTED_HEADERS;
  tableHeaderColumnsProcess: any[] = TABLE_PROCESS_HEADER_COLUMNS;
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
  relationshipDocumentTypies: DropdownItem[] = [];
  families: any[] = [];
  evolutionIsurrances: any[] = [];
  relationshipCities: District[] = [];
  relationshipDistricts: District[] = [];
  relationshipWards: Wards[] = [];
  departments: DropdownItem[] = [];
  typeBirthdays: DropdownItem[] = [];
  relationshipVillages: DropdownItem[] = [];
  processSubject: Subject<string> = new Subject<string>();
  familySubject: Subject<any> = new Subject<any>();
  flagChangeMaster: boolean = false;
  formatterCurrency = (value: number) => typeof value === 'number' ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  private timer;

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private modalService: NzModalService,
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
    private categoryService: CategoryService
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
      this.categoryService.getCategories('relationshipDocumentType'),
      this.categoryService.getCategories('typeBirthday')
    ];

    if (employee.registerCityCode) jobs.push(this.districtService.getDistrict(employee.registerCityCode));
    if (employee.registerDistrictCode) jobs.push(this.wardService.getWards(employee.registerDistrictCode));
    if (employee.recipientsCityCode) jobs.push(this.districtService.getDistrict(employee.recipientsCityCode));
    if (employee.recipientsDistrictCode) jobs.push(this.wardService.getWards(employee.recipientsDistrictCode));
    if (employee.cityFirstRegistCode) jobs.push(this.hospitalService.searchHospital(employee.cityFirstRegistCode,''));
    if (employee.relationshipCityCode) jobs.push(this.districtService.getDistrict(employee.relationshipCityCode));
    if (employee.relationshipDistrictCode) jobs.push(this.wardService.getWards(employee.relationshipDistrictCode));
    if (employee.relationshipWardsCode) jobs.push(this.villageService.getVillage(employee.relationshipWardsCode));

    forkJoin(jobs).subscribe(([ cities, nationalities, peoples, salaryAreas, paymentStatus,
       paymentMethods, relationships, banks, departments,relationshipDocumentTypies, typeBirthdays,
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
      this.relationshipDocumentTypies = relationshipDocumentTypies;
      this.typeBirthdays = typeBirthdays;

      if (registerDistricts) this.registerDistricts = registerDistricts;
      if (registerWards) this.registerWards = registerWards;
      if (recipientsDistricts) this.recipientsDistricts = recipientsDistricts;
      if (recipientsWards) this.recipientsWards = recipientsWards;
      if (hospitals) this.hospitals = hospitals;
      if (relationshipDistricts) this.relationshipDistricts = relationshipDistricts;
      if (relationshipWards) this.relationshipWards = relationshipWards;
      if (relationshipVillages) this.relationshipVillages = relationshipVillages;
    });

    const dateFormat = employee.typeBirthday === '01' ? DATE_FORMAT.ONLY_MONTH_YEAR : DATE_FORMAT.ONLY_YEAR;
    const birthday = employee.birthday ? moment(employee.birthday, dateFormat) : '';
    const dateSign = employee.dateSign ? moment(employee.dateSign, DATE_FORMAT.FULL) : '';

    this.employeeForm = this.formBuilder.group({
      fullName: [employee.fullName, Validators.required],
      birthday: [birthday ? new Date(birthday.valueOf()) : '', [Validators.required, validateLessThanEqualNow]],
      typeBirthday: [employee.typeBirthday || '1'],
      gender: [employee.gender, Validators.required],
      nationalityCode: [employee.nationalityCode, Validators.required],
      peopleCode: [employee.peopleCode, Validators.required],
      code: [employee.code, [ Validators.required, Validators.maxLength(50), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER) ]],
      departmentId: [employee.departmentId ? Number(employee.departmentId) : ''],
      registerCityCode: [employee.registerCityCode, Validators.required],
      registerDistrictCode: [employee.registerDistrictCode, Validators.required],
      registerWardsCode: [employee.registerWardsCode, Validators.required],
      recipientsCityCode: [employee.recipientsCityCode, Validators.required],
      recipientsDistrictCode: [employee.recipientsDistrictCode, Validators.required],
      recipientsWardsCode: [employee.recipientsWardsCode, Validators.required],
      recipientsAddress: [employee.recipientsAddress, Validators.required],
      isurranceCode: [employee.isurranceCode, [Validators.maxLength(50), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      mobile: [employee.mobile, [ Validators.maxLength(15), Validators.pattern(REGEX.ONLY_NUMBER) ]],
      identityCar: [employee.identityCar, [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      familyNo: [employee.familyNo],
      isurranceNo: [employee.isurranceNo, [ Validators.maxLength(15), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER) ]],
      healthNo: [employee.healthNo, [ Validators.maxLength(15), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER) ]],
      contractNo: [employee.contractNo, [Validators.required, Validators.maxLength(50), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      dateSign: [employee.dateSign ? new Date(dateSign.valueOf()) : '', [Validators.required, validateLessThanEqualNow]],
      levelWork: [employee.levelWork, Validators.required],
      salary: [employee.salary, [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      ratio: [employee.ratio, [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      salaryAreaCode: [employee.salaryAreaCode, Validators.required],
      paymentMethodCode: [employee.paymentMethodCode],
      rate: [employee.rate, [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)]],
      cityFirstRegistCode: [employee.cityFirstRegistCode, Validators.required],
      hospitalFirstRegistCode: [employee.hospitalFirstRegistCode, Validators.required],
      allowanceLevel: [employee.allowanceLevel],
      allowanceSeniority: [employee.allowanceSeniority, [Validators.min(0), Validators.max(100), Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)]],
      allowanceSeniorityJob: [employee.allowanceSeniorityJob, [Validators.min(0), Validators.max(100), Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)]],
      allowanceSalary: [employee.allowanceSalary, [Validators.pattern(REGEX.ONLY_NUMBER)]],
      allowanceAdditional: [employee.allowanceAdditional],
      allowanceOther: [employee.allowanceOther, [Validators.pattern(REGEX.ONLY_NUMBER)]],
      mstncn: [employee.mstncn, [Validators.pattern(REGEX.ONLY_NUMBER)]],
      bankAccount: [employee.bankAccount, [Validators.pattern(REGEX.ONLY_NUMBER)]],
      bankId: [employee.bankId ? employee.bankId.toString() : ''],
      accountHolder: [employee.accountHolder],
      status: [employee.status],
      orders: [employee.orders, [Validators.pattern(REGEX.ONLY_NUMBER)]],
      relationshipFullName: [employee.relationshipFullName, Validators.required],
      relationshipDocumentType:[employee.relationshipDocumentType],
      relationshipBookNo: [employee.relationshipBookNo, [Validators.maxLength(50), Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      relationshipCityCode: [employee.relationshipCityCode, Validators.required],
      relationshipDistrictCode: [employee.relationshipDistrictCode, Validators.required],
      relationshipWardsCode: [employee.relationshipWardsCode, Validators.required],
      relationshipVillageCode: [employee.relationshipVillageCode],
      relationshipMobile: [employee.relationshipMobile, [ Validators.maxLength(15), Validators.pattern(REGEX.ONLY_NUMBER) ]],
      isMaster: [employee.isMaster],
      isDuplicateAddress: [false],
      birthTypeOnlyYearMonth: [employee.typeBirthday === '1'],
      birthTypeOnlyYear: [employee.typeBirthday === '2']
    });

    this.families = this.formatFamilies(employee.families);
    this.evolutionIsurrances = this.formatEvolutionIsurrances(employee.evolutionIsurrances);
  }

  formatFamilies(families) {
    if(!families) {
      families = this.createObjectsBlank([], this.tableHeaderColumnsFamilies, 15);
    }

    let familiescopy = [ ...families ];
    familiescopy = this.createObjectsBlank(familiescopy, this.tableHeaderColumnsFamilies, 15);
    // fomat dữ liệu cho jexcel;
    familiescopy.forEach(p => {
      p.data = this.tableHeaderColumnsFamilies.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.data.origin = {
        employeeId: p.employeeId,
      }
    });

    return familiescopy;
  }

  createObjectsBlank(objects, tableHeaderColumns, numberItem) {
    if (objects.length < numberItem) {
      const length = numberItem - objects.length;
      for (let i = 1; i <= length; i++) {
        const item = {};
        tableHeaderColumns.map(column => {
          if(length === numberItem && column.key === 'relationshipCode' && i === 1) {
            item[column.key] =  '00';
          }else {
            item[column.key] =  null;
          }
        });
        objects.push(item);
      }
    }

    return objects;
  }

  formatEvolutionIsurrances(evolutionIsurrances) {
    if(!evolutionIsurrances) {
      return this.createObjectsBlank([], this.tableHeaderColumnsProcess, 15);
    }

    let evolutionIsurrancesCopy = [ ...evolutionIsurrances ];
    //Tạo dữ liệu trống
    evolutionIsurrancesCopy = this.createObjectsBlank(evolutionIsurrancesCopy, this.tableHeaderColumnsProcess, 15);
    evolutionIsurrancesCopy.forEach(p => {
      p.data = this.tableHeaderColumnsProcess.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.data.origin = {
        employeeId: p.employeeId,
      }
    });
    return evolutionIsurrancesCopy;
  }

  save(): void {
    console.log(this.employeeForm)
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
            current.gender = current.gender ? 1 : 0;
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

    if (this.employeeForm.get('birthTypeOnlyYearMonth')) {
      formData.typeBirthday = '1';
    } else if (this.employeeForm.get('birthTypeOnlyYear')) {
      formData.typeBirthday = '2';
    } else {
      formData.typeBirthday = '3';
    }

    if (formData.allowanceSalary) {
      formData.allowanceSalary = formData.allowanceSalary.toString().split(',').join('');
    }

    if (formData.allowanceOther) {
      formData.allowanceOther = formData.allowanceOther.toString().split(',').join('');
    }

    if (this.employee) {
      formData.id = this.employee.employeeId || this.employee.id;
    }

    return formData;
  }

  changeBirthType(value, type) {
    if (value && type === 'birthTypeOnlyYearMonth') {
      this.employeeForm.patchValue({
        'birthTypeOnlyYear': false
      });
    } else if (value && type === 'birthTypeOnlyYear') {
      this.employeeForm.patchValue({
        'birthTypeOnlyYearMonth': false
      });
    }
  }

  dismiss(): void {
    this.modal.destroy();
  }

  handleChangeFamilyTable({ instance, cell, c, r, records, columns  }) {
    if (c !== null && c !== undefined) {
      this.updateSelectedValueDropDown(columns, instance, r);
    }
    // update families
    this.families.forEach((family: any, index) => {
      const record = records[index];
      //update data on Jexcel
      Object.keys(record).forEach(index => {
        family.data[index] = record[index];
      });
      //update data object source
      columns.map((column, index) => {
          family[column.key] = record[index];
      });

    });
  }

  private updateSelectedValueDropDown(columns, instance, r) {

    columns.forEach((column, colIndex) => {
      if (column.defaultLoad) {
        instance.jexcel.updateDropdownValue(colIndex, r);
      }
    });
}

  handleDeleteFamilyData({ rowNumber, numOfRows }) {
    const families = [ ...this.families ];

    families.splice(rowNumber, numOfRows);

    this.updateOrders(families);

    this.families = families;
  }

  handleChangeProcessTable({ instance, cell, c, r, records, columns  }) {
    //update evolutionIsurrances
    this.evolutionIsurrances.forEach((evolutionIsurrance: any, index) => {
      const record = records[index];
      //update data on Jexcel
      Object.keys(record).forEach(dindex => {
        evolutionIsurrance.data[dindex] = record[dindex];
      });
      //update data object source
      columns.map((column, cIndex) => {
        evolutionIsurrance[column.key] = record[cIndex];
      });

    });
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
      this.familySubject.next({
        type: 'ready',
      });
    }
  }

  changeRegisterCity(value) {
    if(!value) {
      return;
    }
    this.districtService.getDistrict(value).subscribe(data => this.registerDistricts = data);

    if(this.isDuplicateAddress) {
      this.employeeForm.patchValue({
        recipientsCityCode: value
      });
    }

  }

  changeRegisterDistrict(value) {
    if(!value) {
      return;
    }
    this.wardService.getWards(value).subscribe(data => this.registerWards = data);
    if(this.isDuplicateAddress) {
      this.employeeForm.patchValue({
        recipientsDistrictCode: value
      });
    }
  }

  changeRegisterWardsCode(value) {

    if(this.isDuplicateAddress) {
      this.employeeForm.patchValue({
        recipientsWardsCode: value
      });
    }

  }

  isSameAddress(value) {
    if(!value) {
      this.employeeForm.patchValue({
        recipientsCityCode: null,
        recipientsDistrictCode: null,
        recipientsWardsCode: null
      });
    }else {
      this.employeeForm.patchValue({
        recipientsCityCode: this.registerCityCode,
        recipientsDistrictCode: this.registerDistrictCode,
        recipientsWardsCode: this.registerWardsCode
      });
    }
  }

  changeRecipientsCity(value) {
    this.districtService.getDistrict(value).subscribe(data => this.recipientsDistricts = data);
    this.employeeForm.patchValue({
      recipientsDistrictCode: null,
      recipientsWardsCode: null
    });
  }

  changeRecipientsDistrict(value) {
    this.employeeForm.patchValue({
      recipientsWardsCode: null
    });

    if(!value) {
      return;
    }
    this.wardService.getWards(value).subscribe(data => this.recipientsWards = data);
  }

  changeRelationshipCities(value) {
    if(!value) {
      return '';
    }
    this.districtService.getDistrict(value).subscribe(data => this.relationshipDistricts = data);
    this.bindingDataToGirdFamilies('cityCode');
  }

  changeRelationshipDistrict(value) {
    if(!value) {
      return '';
    }
    this.wardService.getWards(value).subscribe(data => this.relationshipWards = data);
    this.bindingDataToGirdFamilies('districtCode');
  }

  changeRelationshipWards(value) {
    if(!value) {
      return '';
    }
    this.villageService.getVillage(value).subscribe(data => this.relationshipVillages = data);
    this.bindingDataToGirdFamilies('wardsCode');
  }

  changeRelationshipFullName(value) {
    this.bindingDataToGirdFamilies('fullName');
  }

  bindingDataToGirdFamilies(columnName) {
    if(!this.isMaster) {
      return '';
    }

    const familiescopy = [... this.families];
    let master = familiescopy.find(f => f.relationshipCode === '00');
    if (!master)
    {
      const index = familiescopy.findIndex(f => f.relationshipCode === '00');
      const indexOf = index > -1 ? index : 0;
      master = familiescopy[indexOf];
      master.relationshipCode = '00';
    }

    master.cityCode = this.relationshipCityCode;
    master.districtCode = this.relationshipDistrictCode;
    master.wardsCode = this.relationshipWardsCode;
    master.fullName = this.relationshipFullName;
    master.data = this.tableHeaderColumnsFamilies.map(column => {
        if (!column.key || !master[column.key]) return '';
        return master[column.key];
    });

   const index = familiescopy.findIndex(f => f.relationshipCode === '00');
   this.familySubject.next({
      type:"familyMaster",
      data: master,
      columName: columnName,
      index: index,
    });
  }

  addHospitalFirstRegistCode() {
    const data = {
      cityCode: this.cityFirstRegistCode,
    };
    const modal = this.modalService.create({
      nzWidth: 500,
      nzWrapClassName: 'add-hospital-modal',
      nzTitle: 'Thông tin đơn vị KCB',
      nzContent: EmployeeHospitalRegisterFormComponent,
	  nzComponentParams: {
        data
      }
    });

    modal.afterClose.subscribe(result => {
      if (!result) return;

      this.hospitalService.searchHospital(this.cityFirstRegistCode, result.id).subscribe(data => {
        this.hospitals = data;
        this.employeeForm.patchValue({
          hospitalFirstRegistCode: result.id,
        });
      });
    });
  }

  changeMaster(value) {
    if(value) {
      this.employeeForm.patchValue({
        relationshipFullName: this.fullName,
        relationshipCityCode: this.registerCityCode,
        relationshipDistrictCode: this.registerDistrictCode,
        relationshipWardsCode: this.registerWardsCode
      });
    } else {
      this.employeeForm.patchValue({
        relationshipFullName: null,
        relationshipCityCode: null,
        relationshipDistrictCode: null,
        relationshipWardsCode: null
      });
    }
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


  get registerCityCode() {
    return this.employeeForm.get('registerCityCode').value;
  }

  get registerDistrictCode() {
    return this.employeeForm.get('registerDistrictCode').value;
  }

  get registerWardsCode() {
    return this.employeeForm.get('registerWardsCode').value;
  }

  get relationshipFullName() {
    return this.employeeForm.get('relationshipFullName').value;
  }

  get relationshipCityCode() {
    return this.employeeForm.get('relationshipCityCode').value;
  }

  get relationshipDistrictCode() {
    return this.employeeForm.get('relationshipDistrictCode').value;
  }

  get relationshipWardsCode() {
    return this.employeeForm.get('relationshipWardsCode').value;
  }

  get cityFirstRegistCode() {
    return this.employeeForm.get('cityFirstRegistCode').value;
  }

  get isDuplicateAddress() {
    return this.employeeForm.get('isDuplicateAddress').value;
  }

  get isMaster() {
    return this.employeeForm.get('isMaster').value;
  }

  get birthTypeOnlyYearMonth() {
    return this.employeeForm.get('birthTypeOnlyYearMonth').value;
  }

  get birthTypeOnlyYear() {
    return this.employeeForm.get('birthTypeOnlyYear').value;
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

  searchHospitalFirstRegistCode(value: string): void {
    clearTimeout(this.timer);

    if (!this.cityFirstRegistCode || !value) {
      return;
    }

    this.timer = setTimeout(() => {
      this.hospitalService.searchHospital(this.cityFirstRegistCode, value).subscribe(data => {
        this.hospitals = data;
      });
    }, 200);
  }
}
