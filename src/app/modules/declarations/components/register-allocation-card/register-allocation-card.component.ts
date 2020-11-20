import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import { validationColumnsPlanCode } from '@app/shared/constant-valid';
import { PLANCODECOUNTBHYT } from '@app/shared/constant-valid';

import { Declaration, DocumentList } from '@app/core/models';
import {
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService,
  SalaryAreaService,
  PlanService,
  DocumentListService,
  AuthenticationService,
  DepartmentService,
  EmployeeService,
  CategoryService,
  RelationshipService,
  BenefitLevelService,
  ExternalService,
  FileUploadEmitter
} from '@app/core/services';
import { DATE_FORMAT, DECLARATIONS, DOCUMENTBYPLANCODE, REGEX } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/resgister-allocation-card.data';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';
import { TableEditorErrorsComponent } from '@app/shared/components';

const TYPES = {
  'I_1': 'Tăng người lao động',
  'I_2': 'Tăng lương',
  'II_1': 'Giảm người lao động',
  'II_2': 'Giảm lương'
};
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // ~ 20MB

@Component({
  selector: 'app-register-allocation-card',
  templateUrl: './register-allocation-card.component.html',
  styleUrls: [ './register-allocation-card.component.less' ]
})
export class RegisterAllocationCardComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  declarationGeneral: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<any> = new Subject<any>();
  familiesSubject: Subject<string> = new Subject<string>();
  documentsSubject: Subject<string> = new Subject<string>();
  validateSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];

  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  families: any[] = [];
  informations: any[] = [];
  declaration: any;
  isHiddenSidebar = false;
  declarationCode: string = '603';
  declarationName: string = '';
  employeeSubject: Subject<any> = new Subject<any>();
  handlers: any[] = [];
  handler;
  isTableValid = false;
  tableErrors = {};
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  totalNumberInsurance: any;
  totalCardInsurance: any;
  isBlinking = false;
  submitType: string;
  files: any[] = [];
  isSpinning: boolean= false;
  benefitLevels:  any;
  status: any;
  timer: any;
  formatterCurrency = (value: number) => typeof value === 'number' ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private districtService: DistrictService,
    private declarationService: DeclarationService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService,
    private planService: PlanService,
    private departmentService: DepartmentService,
    private documentListService: DocumentListService,
    private employeeService: EmployeeService,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private modalService: NzModalService,
    private relationshipService: RelationshipService,
    private benefitLevelService: BenefitLevelService,
    private externalService: ExternalService,
    private fileUploadEmitter: FileUploadEmitter
  ) {
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getPlanByParent = this.getPlanByParent.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRelationshipDistrictsByCityCode = this.getRelationshipDistrictsByCityCode.bind(this);
    this.getRelationshipWardsByDistrictCode = this.getRelationshipWardsByDistrictCode.bind(this);
    this.getDistrictsByCityCode = this.getDistrictsByCityCode.bind(this);
    this.getWardsByDistrictCode = this.getWardsByDistrictCode.bind(this);
    this.getRelationShips = this.getRelationShips.bind(this);
  }

  ngOnInit() {
    const date = new Date();
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.loadBenefitLevel();
    this.form = this.formBuilder.group({
      batch: [{value:'1', disabled: true }, Validators.required],
      month: [ date.getMonth() + 1],
      year: [ date.getFullYear()],
      benefitLevelCode:[null, [Validators.required]],
      benefitLevelName: [''],
      tyleNSNN:['10', [Validators.min(0), Validators.max(99), Validators.pattern(REGEX.ONLY_NUMBER)]],
      tyleTGBHYT:['4.50', [Validators.min(0), Validators.max(99), Validators.pattern(REGEX.ONLY_NUMBER)]],
      resource:[''],
      salaryBase:[1490000, [Validators.min(0), Validators.pattern(REGEX.ONLY_NUMBER)]],
    });
    
    this.documentForm = this.formBuilder.group({
      submitter: [this.currentCredentials.companyInfo.delegate, Validators.required],
      mobile: [this.currentCredentials.companyInfo.mobile,  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      usedocumentDT01:[true],
    });

    this.declarationGeneral = this.formBuilder.group({
      totalNumberInsurance: [''],
    });

    this.declarationName = this.getDeclaration(this.declarationCode).value;

    this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
      this.documentList = documentList;
    });

    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.planService.getPlanShowCode(this.declarationCode),
      this.departmentService.getDepartments(),
      this.categoryService.getCategories('relationshipDocumentType'),
      this.relationshipService.getRelationships()
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, plans, departments, relationshipDocumentTypies, relationShips ]) => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumns, 'nationalityCode', nationalities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'registerCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(this.tableHeaderColumns, 'planCode', plans);
      this.updateSourceToColumn(this.tableHeaderColumns, 'departmentCode', departments);

      //families table
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'cityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipDocumentType', relationshipDocumentTypies);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', relationShips);

      // get filter columns
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'planCode', this.getPlanByParent);
      //families filter columns

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipDistrictCode', this.getRelationshipDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipWardsCode', this.getRelationshipWardsByDistrictCode);

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'districtCode', this.getDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'wardsCode', this.getWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', this.getRelationShips);

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations.documentDetail);
          this.declarations = declarations.documentDetail;
          this.informations = this.fomatInfomation(declarations.informations);
          this.files = declarations.files;
          this.status = declarations.status;

          this.form.patchValue({
            batch: declarations.batch,
            month: declarations.month,
            year: declarations.year,           
            benefitLevelCode: declarations.benefitLevelCode,    
            benefitLevelName: declarations.benefitLevelName,    
            tyleNSNN: declarations.tyleNSNN,    
            tyleTGBHYT: declarations.tyleTGBHYT,    
            resource: declarations.resource,    
            salaryBase: declarations.salaryBase,
          });

          this.declarationGeneral.patchValue({
            totalNumberInsurance: declarations.totalNumberInsurance,
          });   
          
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile
          });

        });

        this.isTableValid = true;
      } else {
        this.declarationService.getDeclarationInitials(this.declarationCode, this.tableHeaderColumns).subscribe(declarations => {
          this.declarations = declarations;
        });
        
        this.declarationService.getHeaderDeclaration(this.declarationCode).subscribe(data => {
          this.form.patchValue({
            batch: data.batch,
            month: data.month,
            year: data.year,
          });
          
        });

        this.documentForm.patchValue({
          submitter: this.currentCredentials.companyInfo.delegate,
          mobile: this.currentCredentials.companyInfo.mobile
        });  
      }
    });
    this.handlers.push(eventEmitter.on('labor-table-editor:validate', ({ name, isValid, errors }) => {
      console.log(name,'name');
      if (name === 'increaseLabor' || name === 'families' || name === 'informations') {
        this.tableErrors[name] = errors;
      }
    }));

    this.handlers.push(eventEmitter.on('labor-family-editor:validate', ({ name, isValid }) => {
      if (name === 'family') {
        this.isTableValid = isValid;
      }
    }));

    this.handler = this.fileUploadEmitter.on('file:uploaded', (file) => {
      this.eventsSubject.next({
        type: this.submitType
      });
      eventEmitter.emit('saveData:loading', false);
    });
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
    this.handler();
  }

  handleAddEmployee(type) {
    if (!this.employeeSelected.length) {
      return this.modalService.warning({
        nzTitle: 'Chưa có nhân viên nào được chọn',
      });
    }

    eventEmitter.emit('unsaved-changed');

    const declarations = [ ...this.declarations ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);
    let isExist = false;

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;

        // replace
        employee.gender = employee.gender === '1';
        employee.workAddress = this.currentCredentials.companyInfo.address;
        employee.planCode = declarations[parentIndex].planDefault;
        employee.registerCityCode = null;
        employee.registerDistrictCode = null;
        employee.registerWardsCode = null;
        employee.recipientsCityCode = null;
        employee.recipientsDistrictCode = null;
        employee.recipientsWardsCode = null;
        employee.recipientsAddress = null;
        employee.motherDayDead = null;
        employee.contractNo = null;
        employee.dateSign = null;
        employee.tyleNSDP = 0;
        employee.toChuCaNhanHTKhac = 0;
        employee.fromDateJoin = null;
        employee.numberMonthJoin = 0;
        employee.salary = 0;
        employee.sumRatio = 0;
        employee.moneyPayment = 0;
        //
        if (accepted) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize data
            declarations.splice(childLastIndex, 1);

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
          }
        } else {
          if (!isExist) {
            isExist = true;
          }
        }
      });

      if (isExist) {
        this.modalService.warning({
          nzTitle: `Nhân viên đã có trong danh sách ${TYPES[type]}`,
        });
      }
      // update orders
      this.updateOrders(declarations);

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
      });

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    }

    this.employeeSubject.next({
      type: 'clean'
    });
    this.employeeSelected.length = 0;
    this.sumCreateBHXH();
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
  }

  handleSort({ direction, source, dist }) {
    const declarations = [ ...this.declarations ];
    const current = declarations[source];

    // remove element
    declarations.splice(source, 1);

    // add element to new position
    declarations.splice(dist, 0, current);

    // update orders
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserAdded({ tableName, y, employee }) {
    if (tableName !== 'increaseLabor') return;

    const declarations = [ ...this.declarations ];
    const row = declarations[y];

    row.origin = {
      ...row.origin,
      ...employee
    };
    row.isInitialize = false;

    this.tableHeaderColumns.forEach((column, index) => {
      if (employee[column.key] !== null && typeof employee[column.key] !== 'undefined') {
        row.data[index] = employee[column.key];
      }
    });
    // update orders
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.sumCreateBHXH();
    this.employeeSubject.next({
      type: 'clean'
    });
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserUpdated(user) {
    const declarations = [ ...this.declarations ];
    const declarationUsers = declarations.filter(d => {
      return d.isLeaf && d.origin && (d.origin.employeeId || d.origin.id) === user.id;
    });
    declarationUsers.forEach(declaration => {
      declaration.origin = {
        ...declaration.origin,
        ...user
      };

      this.tableHeaderColumns.forEach((column, index) => {
        if (user[column.key] !== null && typeof user[column.key] !== 'undefined') {
          declaration.data[index] = user[column.key];
        }
      });
    });

    // update orders
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);

    this.employeeSubject.next({
      type: 'clean'
    });
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserDeleted(user) {
    this.eventsSubject.next({
      type: 'deleteUser',
      user,
      deletedIndexes: []
    });
    eventEmitter.emit('unsaved-changed');
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
  }

  handleFileSelected(files) {
    const totalSize = files.reduce(
      (total, file) => {
        return total + (file.size || 0);
      },
      0
    );

    if (totalSize >= MAX_UPLOAD_SIZE) {
      return this.modalService.error({
        nzTitle: 'Lỗi quá dung lượng',
        nzContent: 'Tổng dung lượng Tài liệu kèm theo phải nhỏ hơn 20MB'
      });
    }

    this.files = files.map(file => ({
      documentName: file.documentName,
      fileName: file.fileName,
      fullPathFile: file.fullPathFile,
      data: file.data,
      size: file.size,
      id: file.id,
      declarationId: this.declarationId,
      declarationCode: this.declarationCode,
      order: file.no
    }));
    eventEmitter.emit('unsaved-changed');
  }

  emitEventToChild(type) {
    if (type === 'back') {
      this.onSubmit.emit({
        type
      });

      return;
    }

    this.tableSubmitErrors = {};
    this.tableSubmitErrorCount = 0;
    const errorDocumentForm = this.validDocumentForm();
    if (errorDocumentForm.length > 0) {
      this.tableErrors['documentFomError'] = errorDocumentForm;
    } else {
      this.tableErrors['documentFomError'] = [];
    }

    const generalFomError = this.validGeneralFomError()
    if(generalFomError.length > 0) {
      this.tableErrors['generalFomError'] = generalFomError;
    } else {
      this.tableErrors['generalFomError'] = [];
    }

    let count = Object.keys(this.tableErrors).reduce(
      (total, key) => {
        const data = this.tableErrors[key];
        console.log(data);
        return total + data.length;
      },
      0
    );

    if (count > 0) {

      this.tableSubmitErrors = Object.keys(this.tableErrors).reduce(
        (combine, key) => {
          const data = this.tableErrors[key];

          return {...combine, [key]: data.length};
        },
        {}
      );

      this.tableSubmitErrorCount = count;
      return this.modalService.error({
        nzTitle: 'Lỗi dữ liệu. Vui lòng sửa!',
        nzContent: TableEditorErrorsComponent,
        nzComponentParams: {         
          errors: this.getColumnErrror()
        }
      });
    }


    // this.eventsSubject.next({type});
    // this.submitType = type;

    // eventEmitter.emit('saveData:loading', true);

    // this.fileUploadEmitter.emit('file:upload');
  }

  handleSubmit(event) {
    const { number, month, year } = this.form.value;

    eventEmitter.emit('unsaved-changed', true);

    this.onSubmit.emit({
      type: event.type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentNo: number,
      createDate: `01/0${ month }/${ year }`,
      documentStatus: 0,
      totalNumberInsurance: this.totalNumberInsurance,
      totalCardInsurance: this.totalCardInsurance,
      documentDetail: event.data,
      informations: this.reformatInformations(),
      families: this.reformatFamilies(),
      files: this.files
    });
  }

  handleChangeDataFamilies({ instance, cell, c, r, records, columns }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumnsFamilies[c];
      if (column.key === 'isMaster') {
        const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);

        if(employeeIsMaster === true) {

          this.employeeService.getEmployeeById(records[r].origin.employeeId).subscribe(emp => {
            this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
            this.updateNextColumns(instance, r, emp.relationshipMobile, [ c + 2]);
            this.updateNextColumns(instance, r, emp.relationshipDocumentType, [ c + 3]);
            this.updateNextColumns(instance, r, emp.relationshipBookNo, [ c + 4]);
            this.updateNextColumns(instance, r, emp.recipientsCityCode, [ c + 5]);
            this.updateNextColumns(instance, r, emp.recipientsDistrictCode, [ c + 6]);
            this.updateNextColumns(instance, r, emp.recipientsWardsCode, [ c + 7]);
            this.updateNextColumns(instance, r, emp.fullName, [ c + 10]);
            this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 11]);
            this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 12]);
            this.updateNextColumns(instance, r, emp.birthday, [ c + 13]);
            this.updateNextColumns(instance, r, emp.gender, [ c + 14]);
            this.updateNextColumns(instance, r, emp.relationshipCityCode, [ c + 16]);
            this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 17]);
            this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 18]);
            this.updateNextColumns(instance, r, '00', [21]);
            this.updateNextColumns(instance, r, emp.identityCar, [c + 20]);
            this.updateSelectedValueDropDow(columns, instance, r);
          });

        }else {
          this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
          c + 10, c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17]);

          const value = instance.jexcel.getValueFromCoords(1, r);
          const numberColumn = this.tableHeaderColumnsFamilies.length;
          this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
        }

      }

      if (column.key === 'sameAddress') {
        const isSameAddress = instance.jexcel.getValueFromCoords(c, r);

        if(isSameAddress === true)
        {
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(7, r), [ c + 1]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(8, r), [ c + 2]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(9, r), [ c + 3]);
          this.updateSelectedValueDropDow(columns, instance, r);

        } else {
          this.updateNextColumns(instance, r, '', [ c + 1]);
          this.updateNextColumns(instance, r, '', [ c + 2]);
          this.updateNextColumns(instance, r, '', [ c + 3]);
        }
      }

      if (column.willBeValid) {
        const value = instance.jexcel.getValueFromCoords(c, r);
        const numberColumn = this.tableHeaderColumnsFamilies.length;
        this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
      }
    }
    //update families
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

    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  private updateSelectedValueDropDow(columns, instance, r) {

      columns.forEach((column, colIndex) => {
        if (column.defaultLoad) {
          instance.jexcel.updateDropdownValue(colIndex, r);
        }
      });
  }

  handleChangeTable({ instance, cell, c, r, records }) {
    eventEmitter.emit('unsaved-changed');
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumns[c];
      if (column.key === "fullName") {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.updateNextColumns(instance, r, '', [c + 2], true);
        }, 10);
      } else if (column.key == "isReductionWhenDead") {

        const isReductionWhenDead = records[r][c];
        if(!isReductionWhenDead) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.updateNextColumns(instance, r, '', [c + 1], true);
          }, 10);
        }
        
      } else if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstCode = cell.innerText.split(' - ').shift();
        if(hospitalFirstCode !== '' && hospitalFirstCode !== undefined)
        {
          this.hospitalService.getById(hospitalFirstCode).subscribe(data => {
            this.updateNextColumns(instance, r,  data.name, [ c + 1 ]);
          });
        } else {
          this.updateNextColumns(instance, r, '', [ c + 1 ]);
        }
      } else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'recipientsCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 5, c + 6 ]);
      } else if( column.key === 'numberMonthJoin') {
        this.calculatorSalary(instance, cell, c, r, records);
      } else if( column.key === 'salary') {
        this.calculatorSalary(instance, cell, c, r, records);
      }  else if(column.key === 'sumRatio') {
        clearTimeout(this.timer);
        const value = records[r][c];
        if(value > 0) {
          this.timer = setTimeout(() => {
            this.updateNextColumns(instance, r, '0', [c - 1], true);
          }, 10);
        }
      } 
    }
    // update declarations
    this.declarations.forEach((declaration: any, index) => {
      const record = records[index];
      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
    });

    const rowChange: any = this.declarations[r];

    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;

    const employeesInDeclaration = this.getEmployeeInDeclaration(records);
    this.setDataToFamilies(employeesInDeclaration);
    this.setDateToInformationList(employeesInDeclaration);
    this.sumCreateBHXH();
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }) {
    const declarations = [ ...this.declarations ];
    let row: any = {};

    const beforeRow: any = declarations[insertBefore ? rowNumber - 1 : rowNumber];
    const afterRow: any = declarations[insertBefore ? rowNumber : rowNumber + 1];

    const data: any = [];

    row.data = data;
    row.isInitialize = true;
    row.isLeaf = true;
    row.origin = origin;
    row.options = options;

    if (beforeRow.isLeaf && !afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
      row.groupObject = beforeRow.groupObject;      
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
      row.groupObject = afterRow.groupObject;
    } else if (beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
      row.groupObject = beforeRow.groupObject;
    }

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {
    const declarations = [ ...this.declarations ];
    let declarationsDeleted = [];

    const beforeRow = records[rowNumber - 1];
    const afterRow = records[rowNumber];

    if (!((beforeRow.options && beforeRow.options.isLeaf) || (afterRow.options && afterRow.options.isLeaf))) {
      const row: any = declarations[rowNumber];
      const origin = { ...row.data.origin };
      const options = { ...row.data.options };
      origin.employeeId = 0;
      origin.id = 0;
      row.data = [];
      row.origin = origin;
      row.options = options;
      row.isInitialize = true;

      if (!(beforeRow.options && beforeRow.options.isLeaf) && !(afterRow.options && afterRow.options.isLeaf)) {
        const nextRow: any = declarations[rowNumber + 1];

        if (nextRow.isLeaf) {
          declarationsDeleted.push(declarations.splice(rowNumber + 1, numOfRows - 1));
        }
      }
    } else {
      declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    }

    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    //this.deleteEmployeeInFamilies(declarationsDeleted);
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleAddMember({ rowNumber, numOfRows, beforeRowIndex, afterRowIndex, options, origin, insertBefore }) {
    const families = [ ...this.families ];
    let row: any = {};

    const beforeRow: any = families[insertBefore ? beforeRowIndex - 1 : beforeRowIndex];
    const afterRow: any = families[afterRowIndex];
    const data: any = [];
    row.data = data;
    row.isMaster = false;

    row.origin = {
      employeeId: beforeRow.origin.employeeId,
      isLeaf: true,
      isMaster: false,
    };
    row.employeeId = beforeRow.employeeId;
    families.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);

    this.families = families;
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleFocus() {
    if (!this.employeeSelected.length) return;

    this.isBlinking = true;

    setTimeout(() => this.isBlinking = false, 5000);
  }

  handleDeleteMember({ rowNumber, numOfRows, records }) {
    const families = [ ...this.families ];

    const familyDeleted = families.splice(rowNumber, numOfRows);
    this.families = families;
    this.eventsSubject.next({type: 'validate'});
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }


  deleteEmployeeInFamilies(declarationsDeleted: any) {
    const employeeIdDeleted = [];
    declarationsDeleted.forEach(itemDeleted => {
      const item = this.declarations.find(d => (d.origin && d.origin.employeeId) === (itemDeleted.origin && itemDeleted.origin.employeeId));

      if(item){
        return;
      }
      employeeIdDeleted.push(itemDeleted.origin.employeeId);
    });
    let families = [...this.families];
    employeeIdDeleted.forEach(id => {
      families = families.filter(fa => fa.employeeId !== id);
    });

    if(families.length === 0) {
      families.push({
        isMaster: false,
      });
    }
    this.families = families;
    eventEmitter.emit('unsaved-changed');
  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }

  handleFormValuesChanged({ data, first }) {
    this.totalNumberInsurance = data.totalNumberInsurance;
    this.totalCardInsurance = data.totalNumberInsurance;

    if (!first) {
      eventEmitter.emit('unsaved-changed');
    }
  }

  handleChangeForm() {
    eventEmitter.emit('unsaved-changed');
  }

  checkInsurranceCode() {

    const declarations = [...this.declarations];
    const INSURRANCE_FULLNAME_INDEX = 1;
    const INSURRANCE_CODE_INDEX = 2;
    const INSURRANCE_STATUS_INDEX = 3;
    const errors = {};
    const leafs = declarations.filter(d => d.isLeaf && d.data[INSURRANCE_CODE_INDEX]);

    //Kiểm tra nếu có dữ liệu cần check thì show loadding
    if(leafs.length > 0) {
      this.isSpinning = true;
    }

    forkJoin(
      leafs.map(item => {
        const code = item.data[INSURRANCE_CODE_INDEX];
        return this.externalService.getEmployeeByIsurranceCode(code);
      })
    ).subscribe(results => {

      declarations.forEach((declaration, rowIndex) => {
        const code = declaration.data[INSURRANCE_CODE_INDEX];
        const fullName = declaration.data[INSURRANCE_FULLNAME_INDEX];
        if (code && declaration.isLeaf) {

            const item = results.find(r => r.isurranceCodeCheck === code);
            if (item.fullName === "" || item.fullName === undefined){
                declaration.data[INSURRANCE_STATUS_INDEX] = `Không tìm thấy Mã số ${ declaration.data[INSURRANCE_CODE_INDEX] }`;
                errors[rowIndex] = {
                  col: INSURRANCE_CODE_INDEX,
                  value: code,
                  valid: false
                };
            } else if (item.fullName !==  fullName)
            {
              declaration.data[INSURRANCE_STATUS_INDEX] = `Sai họ tên. Mã số ${ declaration.data[INSURRANCE_CODE_INDEX] } của ${ item.fullName }`;
              errors[rowIndex] = {
                col: INSURRANCE_CODE_INDEX,
                value: code,
                valid: false
              };

            } else
            {
              declaration.data[INSURRANCE_STATUS_INDEX] = '';
            }
        }

      });

      this.declarations = declarations;
      this.isSpinning = false;
      this.modalService.success({
        nzTitle: 'Quá trình thực hiện thành công'
      });
      setTimeout(() => {
        this.validateSubject.next({
          field: 'isurranceCode',
          errors
        });
      }, 20);
    }, () => {
      this.isSpinning = false;    
     
    });
  }

  private updateOrders(declarations) {
    const order: { index: 0, key: string } = { index: 0, key: '' };

    declarations.forEach((declaration, index) => {
      if (declaration.hasLeaf) {
        order.index = 0;
        order.key = declaration.key;
      }

      if (declaration.isLeaf && declaration.parentKey === order.key) {
        order.index += 1;

        declaration.data[0] = order.index;
      }
    });
  }

  private updateSourceToColumn(tableHeaderColumns, key, sources) {
    const column = tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  private updateFilterToColumn(tableHeaderColumns,key, filterCb) {
    const column = tableHeaderColumns.find(c => c.key === key);
    if (column) {
      column.filter = filterCb;
    }
  }

  private getRegisterDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns,'registerDistrictCode', districts);

      return districts;
    });
  }

  private getRecipientsWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns,'recipientsWardsCode', districts);

      return districts;
    });
  }

  private getRelationshipDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'relationshipDistrictCode', districts);

      return districts;
    });
  }

  private getRegisterWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumns,'registerWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', districts);

      return districts;
    });
  }

  private getDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'districtCode', districts);

      return districts;
    });
  }

  private getWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'wardsCode', wards);
      return wards;
    });
  }

  private getRelationshipWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies,'relationshipWardsCode', wards);
      return wards;
    });
  }

  private getHospitalsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 5, r);

    if (!value) {
      return [];
    }

    return this.hospitalService.getHospitals(value).toPromise();
  }

  private getPlanByParent(instance, cell, c, r, source) {
    // const row = instance.jexcel.getRowFromCoords(r);
    // return source.filter(s => s.type === row.options.planType);
    const row = instance.jexcel.getRowFromCoords(r);
    const planTypes = (row.options.planType || '').split(',');
    return source.filter(s => planTypes.indexOf(s.id) > -1);
  }

  private getRelationShips(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    if (row.origin && row.origin.isMaster) {
      return source;
    }

    return source.filter(s => s.id !== '00');;
  }

  private updateNextColumns(instance, r, value, nextColumns = [], force = false) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
      instance.jexcel.setValue(columnName, value, force);
    });
  }

  get usedocumentDT01() {
    return this.documentForm.get('usedocumentDT01').value;
  }

  handleChangeInfomation({ records, columns }) {

    //update families
    this.informations.forEach((d: any, index) => {
      const record = records[index];
      //update data on Jexcel
      Object.keys(record).forEach(index => {
        d.data[index] = record[index];
      });
      //update data object source
      columns.map((column, index) => {
        d[column.key] = record[index];
      });

    });

    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteInfomation({ rowNumber, numOfRows }) {
    const infomations = [ ...this.informations ];

    const infomaionDeleted = infomations.splice(rowNumber, numOfRows);
    this.informations = infomations;
    this.eventsSubject.next({ type: 'validate' });
    this.familiesSubject.next('validate');
    this.documentsSubject.next('validate');
    eventEmitter.emit('unsaved-changed');
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

  private arrayEmployeeToProps(array, columns, isGetInDeclatation) {
    if(!array.options.isLeaf && isGetInDeclatation) {
      return null;
    }
    const object: any = Object.keys(array).reduce(
      (combine, current) => {
        const column = columns[current];
        if (current === 'origin' || current === 'options' || !column.key) {
          return { ...combine };
        }

        if (column.type === 'numeric') {
          return { ...combine, [ column.key ]: array[current].toString().split(' ').join('') };
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current] };
      },
      {}
    );

    if (!array.origin) {
      return object;
    }

    object.origin = array.origin;
    if (array.origin.employeeId) {
      object.employeeId = array.origin.employeeId;
    }

    return object;
  }

  reformatInformations() {
    const informations = [];
    let informationcopy = [ ...this.informations];
    informationcopy.forEach(information => {
        if(information.fullName) {
          informations.push(information);
        }
    });

    return informations;
  }

  fomatInfomation(infomations) {
    if(!infomations) {
      return [];
    }
    let infomationscopy = [ ...infomations ];
    infomationscopy.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.data.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
      }
    });
    return infomationscopy;
  }

  reformatFamilies() {
    const families = [];
    let familiescopy = [ ...this.families ];
    familiescopy.forEach(family => {
        if(family.fullName) {
          family.isMaster = family.origin.isMaster
          family.id = family.id ? family.id : 0;
          family.gender = family.gender ? 1: 0;

          families.push(family);
        }
    });

    return families;
  }


  private setDataToFamilies(employeesInDeclaration: any)
  {
    const families = [];
    const employees = [];
    const employeesId = [];
    employeesInDeclaration.forEach(emp => {

      const empId = employeesId.find(c => c === emp.employeeId);
      if(empId) {
        return;
      }

      employeesId.push(empId);

      const family = this.families.find(p => p.employeeId === emp.employeeId);

        if (!family) {

          const isContainsEmployee = employees.find(p => p.employeeId === emp.employeeId);
          if(!isContainsEmployee)
          {
            employees.push(emp);
          }

        }else {

          const currentFamilies = this.families.filter(fm => fm.employeeId === emp.employeeId);
          if(currentFamilies){
            currentFamilies.forEach(oldEmp => {
              families.push(oldEmp);
            });
          }

        }
    });

    forkJoin(
      employees.map(emp => {
        return this.employeeService.getEmployeeById(emp.employeeId)
      })
    ).subscribe(emps => {

      emps.forEach(ep => {
        const master = this.getMaster(ep.families);
        master.isMaster = ep.isMaster;
        master.employeeName = ep.fullName;
        master.employeeId = ep.employeeId;
        master.relationshipMobile = ep.relationshipMobile;
        master.relationshipFullName = ep.relationshipFullName;
        master.relationshipBookNo = ep.relationshipBookNo;
        master.relationshipDocumentType =  ep.relationshipDocumentType;
        master.relationshipCityCode = ep.relationshipCityCode;
        master.relationshipDistrictCode = ep.relationshipDistrictCode;
        master.relationshipWardsCode = ep.relationshipWardsCode;
        master.relationshipVillageCode = ep.relationshipVillageCode;
        master.relationshipCode = '00';
        master.conditionValid = ep.relationshipFullName ? ep.relationshipFullName : ep.fullName;
        master.origin = {
          employeeId: ep.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        families.push(master);

        if(ep.families.length > 1) {
          ep.families.forEach(fa => {
            if(fa.relationshipCode === '00') {
              return;
            }

            fa.isMaster = false;
            fa.employeeId = ep.employeeId;
            fa.conditionValid = ep.relationshipFullName;
            fa.origin = {
              employeeId: ep.employeeId,
              isLeaf: true,
              isMaster: false,
            }
            families.push(fa);
          });
        }else {
          // nếu chưa có thông tin của gia đình thì add dòng trống
          families.push(this.fakeEmployeeInFamilies(ep));
          families.push(this.fakeEmployeeInFamilies(ep));
        }

      });

      families.forEach(p => {
        p.data = this.tableHeaderColumnsFamilies.map(column => {
          if (!column.key || !p[column.key]) return '';
          return p[column.key];
        });
        p.data.origin = p.origin;
      });
      this.families = families;
    });
  }

  fakeEmployeeInFamilies(employee) {

    return {
      isMaster:false,
      conditionValid: null, //employee.relationshipFullName,
      employeeId: employee.employeeId,
      origin: {
        employeeId: employee.employeeId,
        isLeaf: true,
        isMaster: false,
      }
    }

  }

  private setDateToInformationList(employeesInDeclaration: any)
  {
    const informations = [];
    employeesInDeclaration.forEach(emp => {
      const documents = this.getDocumentByPlancode(emp.planCode);

      if(!documents) {
        return;
      }

      documents.forEach(doc => {
        let item = {
          fullName: emp.fullName,
          isurranceNo: emp.isurranceNo,
          documentNo: '',
          dateRelease: '',
          isurranceCode: emp.isurranceCode,
          documentType: doc.documentName,
          companyRelease: this.currentCredentials.companyInfo.name,
          documentNote: doc.documentNote,
          documentAppraisal: ('Truy tăng ' + emp.fullName + ' từ ' + emp.fromDate),
          origin: {
            employeeId: emp.employeeId,
            isLeaf: true,
          }
        };
        if(doc.isContract) {
          item.documentNo = emp.contractNo;
          item.dateRelease =  emp.dateSign;
        }else {
          item.documentNo = emp.fromDate;
        }
        informations.push(item);
      });

      informations.forEach(p => {
        p.data = this.tableHeaderColumnsDocuments.map(column => {
          if (!column.key || !p[column.key]) return '';
          return p[column.key];
        });
        p.data.origin = p.origin;
      });

    });

    this.informations = informations;
  }

  private getEmployeeInDeclaration(records: any) {
    const employeesInDeclaration = [];
    records.forEach(record => {
      const employee = this.arrayEmployeeToProps(record, this.tableHeaderColumns, true);
      if(employee && employee.employeeId) {

        employee.origin = {
          employeeId: employee.employeeId,
          isLeaf:true,
          isMaster: false,
        };

        employee.conditionValid = employee.relationshipFullName;
        employeesInDeclaration.push(employee);
      }

    });
    return employeesInDeclaration;
  }
  handleToggleSidebar() {
    this.isHiddenSidebar = !this.isHiddenSidebar;
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });
    return declarations;
  }

  getDocumentByPlancode(planCode: string) {
    if(!planCode) {
      return null;
    }
    const document = _.find(DOCUMENTBYPLANCODE, {
      key: planCode,
    });

    if(document) {
      return document.value;
    }else {
      return null;
    }
  }


  getMaster(families: any) {
    const master = _.find(families, {
      relationshipCode: '00',
    });
    if(master) {
      return master;
    }
    return {};
  }

  handleSelectTab(index) {
    eventEmitter.emit('increase-labor:tab:change', index);
  }

  protected formatNote(str, args) {
    for (let i = 0; i < args.length; i++)
       str = str.replace("{" + i + "}", args[i]);
    return str;
  }

  private loadBenefitLevel() {
    this.benefitLevelService.filter().subscribe(data => {
       this.benefitLevels = data;
    });
  }

  private calculatorSalary(instance, cell, c, r, records) {
      const indexOfNumberMonthJoin = this.tableHeaderColumns.findIndex(c => c.key === 'numberMonthJoin');
      const indexOfSalary = this.tableHeaderColumns.findIndex(c => c.key === 'salary');
      const indexOfSumRatio = this.tableHeaderColumns.findIndex(c => c.key === 'sumRatio');
      const indexOfMoneyPayment = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPayment');
      const numberMonthJoin = records[r][indexOfNumberMonthJoin];
      const salary = records[r][indexOfSalary];
      const sumRatio = records[r][indexOfSumRatio];
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // Nếu người dùng nhập giá trị lương thì set bằng giá trị lương
        if (salary > 0) {
          this.updateNextColumns(instance, r, salary, [indexOfMoneyPayment], true);
          this.updateNextColumns(instance, r, 0, [indexOfSumRatio], true);
        } else if(sumRatio > 0) {
          const total = sumRatio *  (this.salaryBase || 0);
          this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
        }else {
          const total = ((numberMonthJoin *  (this.salaryBase || 0) * 0.7 * (this.tyleTGBHYT || 0)) / 100);
          this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
        }
        
      }, 10);
      
  }

  get tyleTGBHYT() {
    return this.form.get('tyleTGBHYT').value;
  }

  get salaryBase() {
    return this.form.get('salaryBase').value;
  }

  get tyleNSNN() {
    return this.form.get('tyleNSNN').value;
  }

  private sumCreateBHXH() {
    let totalCardInsurance =  0;
    const indexOfPlanCode = this.tableHeaderColumns.findIndex(c => c.key === 'planCode');
    this.declarations.forEach(d => {
        const planCode = d.data[indexOfPlanCode];
        const isSumNumberInsurance = PLANCODECOUNTBHYT.findIndex(p => p === planCode) > -1;
        if(isSumNumberInsurance) {
          totalCardInsurance += 1;
        }
    });

    this.declarationGeneral.patchValue({
      totalNumberInsurance: totalCardInsurance,
    });
  }

  validDocumentForm() { 
    const formError: any[] = [];
    if(this.documentForm.controls.submitter.errors) {
      formError.push({
        y: 'Người nộp',
        columnName: 'Kiểm tra lại trường người nộp',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.documentForm.controls.mobile.errors) {
      formError.push({
        y: 'Số điện thoại',
        columnName: 'Kiểm tra lại trường số điện thoại',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    return formError;
  }


  validGeneralFomError() { 
    const formError: any[] = [];
    if(this.form.controls.batch.errors) {
      formError.push({
        y: 'Số',
        columnName: 'Kiểm tra lại trường số tờ khai',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.month.errors) {
      formError.push({
        y: 'Tháng',
        columnName: 'Kiểm tra lại trường số tháng',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.year.errors) {
      formError.push({
        y: 'Năm',
        columnName: 'Kiểm tra lại trường số năm',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.benefitLevelCode.errors) {
      formError.push({
        y: 'Mã đối tượng',
        columnName: 'Kiểm tra lại mã đối tượn',
        prefix: '',
        subfix: 'Lỗi'
      });
    }
    return formError;
  }

  private getColumnErrror() {
    let tableErrorMessage = Object.keys(this.tableErrors).reduce(
      (combine, key) => {
        if (this.tableErrors[key].length) {
          return { ...combine, [key]: this.tableErrors[key] };
        }

        return { ...combine };
      },
      {}
    );
    return tableErrorMessage;
  }


}
