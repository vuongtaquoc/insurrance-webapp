import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import { validationColumnsPlanCode603, RatioFamily } from '@app/shared/constant-valid';
import { PLANCODECOUNTBHYT } from '@app/shared/constant-valid';
import { UploadFormComponent } from '@app/shared/components';
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
  DeclarationConfigService,
  FileUploadEmitter,
  AppConfigService,
  GroupBenefitLevelService,

} from '@app/core/services';
import { DATE_FORMAT, DOCUMENTBYPLANCODE, REGEX } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TABLE_NESTED_HEADERS, TABLE_NESTED_HEADERS_TYPE, TABLE_HEADER_COLUMNS, TABLE_HEADER_COLUMNS_TYPE } from '@app/modules/declarations/data/resgister-allocation-card.data';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/tk1.data';
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
  @Input() isSpinning: boolean;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  declarationGeneral: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = [];
  tableHeaderColumns: any[] = [];
  tableNestedHeadersFamilies: any[] = TABLE_FAMILIES_NESTED_HEADERS;
  tableHeaderColumnsFamilies: any[] = TABLE_FAMILIES_HEADER_COLUMNS;
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  tableSubject: Subject<any> = new Subject<any>();
  eventsSubject: Subject<any> = new Subject<any>();
  validateSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];

  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  salaryAreas: any;
  families: any[] = [];
  informations: any[] = [];
  declaration: any;
  isHiddenSidebar = false;
  readOnlySalary = false;
  readOnlyRatio = false;
  defaultValueRatio = 0;
  declarationCode: string = '603';
  declarationName: string = '';
  autoCreateDocumentList: boolean;
  autoCreateFamilies: boolean;
  allowAttachFile: boolean;
  isCheckIsuranceCode: boolean;
  employeeSubject: Subject<any> = new Subject<any>();
  handlers: any[] = [];
  handler;
  isTableValid = false;
  parentKeyNotCaculator = 'II_1';
  allInitialize: any = {};
  tableErrors = {};
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  
  totalCardInsurance: any;
  isBlinking = false;
  submitType: string;
  files: any[] = [];   
  status: any;
  timer: any;
  ratioPayment = 0;
  objectType = '';
  calculationType = 0;
  tyleTGBHYT = 0;
  salaryBase = 0;
  level = 0;
  tyleNSNN = 0;
  formatterCurrency = (value: number) => typeof value === 'number' ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  eventValidData = 'adjust-general:validate';

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
    private declarationConfigService: DeclarationConfigService,
    private fileUploadEmitter: FileUploadEmitter,
    private appConfigService: AppConfigService,
    private groupBenefitLevelService: GroupBenefitLevelService,
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
    this.calculationType = this.currentCredentials.companyInfo.calculationType;
    const objectType = this.currentCredentials.companyInfo.objectType;
    if (this.calculationType === 1 && objectType === 'GD'){
      this.tableNestedHeaders = TABLE_NESTED_HEADERS_TYPE;
      this.tableHeaderColumns = TABLE_HEADER_COLUMNS_TYPE;
    } else {
      this.tableNestedHeaders = TABLE_NESTED_HEADERS;
      this.tableHeaderColumns = TABLE_HEADER_COLUMNS;
    }
    
    console.log(this.calculationType, this.currentCredentials.companyInfo.objectType);
    this.objectType = this.currentCredentials.companyInfo.objectType;
    this.loadAppConfig((data) => {
      this.loadBenefitLevel(data, this.objectType);
    });
    this.loadDeclarationConfig();
    this.form = this.formBuilder.group({
      batch: [{value:'1', disabled: true }, Validators.required],
      month: [ date.getMonth() + 1],
      year: [ date.getFullYear()],
      benefitLevelName: [''],
      resource:[''],
    });
    
    this.documentForm = this.formBuilder.group({
      submitter: [this.currentCredentials.companyInfo.delegate, Validators.required],
      mobile: [this.currentCredentials.companyInfo.mobile,  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      usedocumentDT01:[true],
    });

    this.declarationGeneral = this.formBuilder.group({
      totalCardInsurance: [''],
    });

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
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'nationalityCode', nationalities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'declarationPeopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'declarationNationalityCode', nationalities);

      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'registerCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'recipientsCityCode', cities);

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode)
      
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
          this.families = this.fomatFamilies(declarations.families);
          this.files = declarations.files;
          this.status = declarations.status;
          this.form.patchValue({
            batch: declarations.batch,
            month: declarations.month,
            year: declarations.year,           
            benefitLevelName: declarations.benefitLevelName,    
            resource: declarations.resource,    
          });

          this.declarationGeneral.patchValue({
            totalCardInsurance: declarations.totalCardInsurance,
          });   
          
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile
          });

        });

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
        this.informations = this.loadDefaultInformations();
      }
    });
     
    this.handler = eventEmitter.on(this.eventValidData, ({ name, isValid, leaf, initialize, errors }) => {
        if (leaf === undefined) {
          return;
        }

        this.tableErrors[name] = errors;
        this.allInitialize[name] = leaf.length === initialize.length;
        this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;   
    });

    this.handlers.push(eventEmitter.on('tree-declaration:deleteUser', (data) => {
        this.handlersDeleteUseOnTree(data.employee);
    }));

    this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
        this.updateEmployeeInFamily(data.employee);
         this.updateEmployeeInInfomation(data.employee);     
    }));

    this.handler = this.fileUploadEmitter.on('file:uploaded', (file) => {
      this.tableSubject.next({
        type: this.submitType
      });
      eventEmitter.emit('saveData:loading', false);
    });   
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
    eventEmitter.destroy(this.handler);
    this.tableSubject.unsubscribe();
    this.eventsSubject.unsubscribe();
    this.validateSubject.unsubscribe();
    if (this.timer) clearTimeout(this.timer);
  }

  private loadDeclarationConfig() {
    this.declarationConfigService.getDetailByCode(this.declarationCode).subscribe(data => {
       this.declarationName = data.declarationName;
       this.autoCreateDocumentList = data.autoCreateDocumentList;
       this.autoCreateFamilies = data.autoCreateFamilies;
       this.allowAttachFile = data.allowAttachFile;
    });
  }

  addEmployeeImport(dataImport) {
    const declarations = [ ...this.declarations ];
    // console.log(this.declarations,'xxxxx');
    let categoryCodeTempl = '';
    let employeeFirst = {};
    dataImport.forEach(employee => {

      if (categoryCodeTempl !== employee.categoryCode) {
        categoryCodeTempl = employee.categoryCode;
        employeeFirst = this.getFistEmployeeInDeclaration(this.declarations, categoryCodeTempl);
      }

      const employeeExists = declarations.filter(d => d.parentKey === employee.categoryCode);
      const accepted = employeeExists.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;
      const parentIndex = findIndex(declarations, d => d.key === employee.categoryCode);
      const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === employee.categoryCode);
      
      if (typeof(employee.gender) !== 'boolean') {
        employee.gender = employee.gender === 1;
      }
      
      if (employee.planCode && employee.reason === '') {
        const planConfigInfo = validationColumnsPlanCode603[employee.planCode] || {note:{argsColumn: [], message: ''}};
        const argsColumn = planConfigInfo.note.argsColumn || [] ;
        const argsMessgae = [];
        argsColumn.forEach(column => {
          const firstColumn = column.split('$').shift();
          let messageBuilder = '';
          if(employee[firstColumn] !== undefined && employee[firstColumn] !== '') {
            messageBuilder =  column.split('$')[1] || '';
            messageBuilder = messageBuilder + employee[firstColumn];
          }
          argsMessgae.push(messageBuilder);
        });

        if (this.level === 4) {
          employee.tyleNSDP = 0;
        }else {
          employee.tyleNSDP = null;
        }

        if (this.readOnlySalary) {
          employee.salary = 0;
        }

        employee.sumRatio = this.defaultValueRatio;
        employee.moneyPayment = 0;
        
        if (this.parentKeyNotCaculator !== employee.categoryCode) {
          this.getCaculatorByLevelUpload(employeeFirst, employee);
        }
        
        employee.reason = this.formatNote(planConfigInfo.note.message, argsMessgae);
      }

      if (accepted) {
        if (declarations[childLastIndex].isInitialize) {
          // remove initialize data
          declarations.splice(childLastIndex, 1);

          declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
        } else {
          declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
        }
      }
    });

    this.updateOrders(declarations);
    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.sumCreateBHXH();
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    eventEmitter.emit('unsaved-changed');
  }

  private getCaculatorByLevelUpload(employeeFirst, employee) {
    if(this.level === 1) {
      this.calculatorSalaryLevel1Upload(employee);
    } else if(this.level === 2 || this.level === 3 || this.level === 4) {
       this.calculatorSalaryLevel234Upload(employee);
    } else {
      if (this.calculationType === 1) {
         this.calculatorSalaryOption1Upload(employee, employeeFirst);
      } else {
        this.calculatorSalaryOption2Upload(employee, employeeFirst);
      }
    }
  }

  private calculatorSalaryLevel1Upload(employee) {
      let total = 0;
      let soTienNSDP = 0;
      let moneyPersion = 0;

      if (employee.salary > 0) {
        total = (((employee.salary || 0)  * this.tyleTGBHYT ) / 100) * Number(employee.numberMonthJoin);
        moneyPersion = (employee.salary || 0);
      } else {
        total = ((employee.sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(employee.numberMonthJoin);
        moneyPersion = (this.salaryBase * employee.sumRatio);
      }

      employee.moneyPayment = total;
      employee.soTienNSDP = 0;
      employee.tyleNSDP = 0;
      employee.moneyPersion = moneyPersion;
  }

  private calculatorSalaryLevel234Upload(employee) {
      let total = 0;
      let soTienNSDP = 0;
      let moneyPersion = 0;

      if (employee.salary > 0) {
        total = ((((employee.salary || 0)  * this.tyleTGBHYT * (100 - this.tyleNSNN)) / 100) * Number(employee.numberMonthJoin)) /100;
        moneyPersion = (employee.salary || 0);
        soTienNSDP =  (((employee.salary * employee.tyleNSDP * this.tyleTGBHYT) / 100) * Number(employee.numberMonthJoin)) / 100;
      } else {
        total = (((employee.sumRatio * this.salaryBase * this.tyleTGBHYT * (100 - this.tyleNSNN)) / 100) * Number(employee.numberMonthJoin)) / 100;
        moneyPersion = (this.salaryBase * employee.sumRatio);
        soTienNSDP = (((this.salaryBase * employee.tyleNSDP * this.tyleTGBHYT) / 100) * Number(employee.numberMonthJoin)) / 100;
      }

      employee.moneyPayment = total;
      employee.soTienNSDP = soTienNSDP;
      employee.moneyPersion = moneyPersion;
  }

  private calculatorSalaryOption1Upload(employee, employeeFirst) {
      
      const order = employeeFirst.index;
      employeeFirst.index = employeeFirst.index + 1;
      const percent = this.getPercent(employeeFirst.index); 

      let total = 0;
      let soTienNSDP = 0;
      if (employee.salary > 0) {
        total = ((((employee.salary || 0)  * this.tyleTGBHYT ) / 100) * Number(employee.numberMonthJoin) * percent.percent) / 100;
      } else {
        total = (((employee.sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(employee.numberMonthJoin) * percent.percent) / 100;
      }

      if (order === 0) {
        soTienNSDP = (total * percent.ratio) / 100;
        employeeFirst.soTienNSDP =  soTienNSDP;
        employeeFirst.tyleNSDP = percent.percent;

      } else {

        soTienNSDP = employeeFirst.soTienNSDP;

      }
      
      const moneyPersion = (this.salaryBase * employee.sumRatio * percent.percent) / 100;
      employee.moneyPayment = total;
      employee.soTienNSDP = soTienNSDP;
      employee.tyleNSDP = percent.ratio; 
      employee.moneyPersion = moneyPersion;
  }

  private calculatorSalaryOption2Upload(employee, employeeFirst) {
      
      employeeFirst.index  = employeeFirst.index + 1;
      const percent = this.getPercent(employeeFirst.index); 
      let total = 0;
      let soTienNSDP = 0;
      if (employee.salary > 0) {
        total = ((((employee.salary || 0)  * this.tyleTGBHYT ) / 100) * Number(employee.numberMonthJoin) * percent.percent) / 100;
      } else {
        total = (((employee.sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(employee.numberMonthJoin) * percent.percent) / 100;
      }

      soTienNSDP = (total * percent.ratio) / 100;
      const moneyPersion = (this.salaryBase * employee.sumRatio * percent.percent) / 100;
      employee.moneyPayment = total;
      employee.soTienNSDP = soTienNSDP;
      employee.tyleNSDP = percent.ratio; 
      employee.moneyPersion = moneyPersion;
       
  }

  private getFistEmployeeInDeclaration(declarations, categoryCode) {
    const result: { index: 0, soTienNSDP: number, tyleNSDP : number } = { index: 0, soTienNSDP: 0, tyleNSDP: 0 };
    const employeeInCategory = declarations.filter(p => p.isLeaf && p.parentKey === categoryCode && !p.isInitialize);
    result.index = employeeInCategory.length;
    const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
    const indexOfTyleNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'tyleNSDP');

    if(result.index > 0) {

      result.soTienNSDP = employeeInCategory[0].data[indexOfSoTienNSDP];
      result.tyleNSDP = employeeInCategory[0].data[indexOfTyleNSDP];

    }

    return result;
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
        if(typeof(employee.gender) !== 'boolean') {
          employee.gender = employee.gender === '1';
        }

        if (employee.addressWorking !== '') {
          employee.workAddress = employee.addressWorking;
        } else {
          employee.workAddress = this.currentCredentials.companyInfo.address;
        }
        employee.planCode = declarations[parentIndex].planDefault;
        if(employee.planCode) {
          employee.rate = declarations[parentIndex].rate;
          const planConfigInfo = validationColumnsPlanCode603[employee.planCode] || {note:{argsColumn: [], message: ''}};
          const argsColumn = planConfigInfo.note.argsColumn || [] ;
          const argsMessgae = [];
          argsColumn.forEach(column => {
            const firstColumn = column.split('$').shift();
            let messageBuilder = '';
            if(employee[firstColumn] !== undefined && employee[firstColumn] !== '') {
              messageBuilder =  column.split('$')[1] || '';
              messageBuilder = messageBuilder + employee[firstColumn];
            }
            argsMessgae.push(messageBuilder);
          });

          employee.reason = this.formatNote(planConfigInfo.note.message, argsMessgae);
        }
          
        if (this.level === 4) {
          employee.tyleNSDP = 0;
        } else if(this.level === 5){
          if(this.calculationType === 2) {
            employee.tyleNSDP = 20;
          } else if (this.calculationType === 0) {
            employee.tyleNSDP = 0;
          }
        } else{
          employee.tyleNSDP = null;
        }
        if (this.readOnlySalary) {
          employee.salary = 0;
        }
        employee.motherDayDead = null;
        employee.contractNo = null;
        employee.dateSign = null;
        employee.toChuCaNhanHTKhac = 0;
        employee.soTienNSDP = 0;
        employee.fromDateJoin = null;
        employee.numberMonthJoin = 0;
        employee.sumRatio = this.defaultValueRatio;
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
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    eventEmitter.emit('unsaved-changed');
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
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
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

    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
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

    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
    eventEmitter.emit('unsaved-changed');
  }

  handleUserDeleted(user) {

    this.tableSubject.next({
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

    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }

    if (type === 'save') { 
      this.save(type);
    }else {
      this.saveAndView(type);
    }   
    
  }

  private save(type) {    

    this.tableSubject.next({type});
  }

  private saveAndView(type) {   

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
        return total + data.length;
      },
      0
    );

    //Kiêm tra nếu tồn tại nhân viên bên tab báo tăng thì yêu cầu kiêm tra mã số BHXH
    const hastEmployeeInTabIncreaselabor = this.isHasLeaf();
    if (!this.isCheckIsuranceCode && hastEmployeeInTabIncreaselabor) {
      this.modalService.warning({
        nzTitle: 'Đơn vị chưa kiểm tra Mã số BHXH và trạng thái của người tham gia'
      });
      return;
    }
    
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
    
    this.tableSubject.next({type});
  }

  handleSubmit(event) {

    eventEmitter.emit('unsaved-changed', true);
    this.onSubmit.emit({
      type: event.type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(event.type),
      ...this.documentForm.value,
      ...this.declarationGeneral.value,
      ...this.form.value,
      ratioPayment: this.ratioPayment,
      tyleTGBHYT: this.tyleTGBHYT,
      salaryBase: this.salaryBase,
      calculationType: this.currentCredentials.companyInfo.calculationType,
      tyleNSNN: this.tyleNSNN,
      benefitLevelCode: this.currentCredentials.companyInfo.objectType,
      documentDetail: event.data,
      informations: this.reformatInformations(),
      families: this.reformatFamilies(),
      files: this.files
    });
  }

  private getStatus(type) {
    if(this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }

  // families tab
  handleChangeDataFamilies({ instance, cell, c, r, records, columns }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumnsFamilies[c];
      if (column.key === 'isMaster') {
        const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);
        if(employeeIsMaster === true) {
          
          this.employeeService.getEmployeeById(records[r].origin.employeeId).subscribe(emp => {
              this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
              this.updateNextColumns(instance, r, emp.relationFamilyNo, [ c + 2]);
              this.updateNextColumns(instance, r, emp.relationshipMobile, [ c + 3]);
              this.updateNextColumns(instance, r, emp.relationshipDocumentType, [ c + 4]);
              this.updateNextColumns(instance, r, emp.relationshipBookNo, [ c + 5]);
              this.updateNextColumns(instance, r, emp.relationshipCityCode , [ c + 6]);
              this.updateNextColumns(instance, r, emp.relationshipDistrictCode, [ c + 7]);
              this.updateNextColumns(instance, r, emp.relationshipWardsCode, [ c + 8]);
              this.updateNextColumns(instance, r, emp.relationAddress, [ c + 9]);
              this.updateNextColumns(instance, r, emp.fullName, [ c + 11]);
              this.updateNextColumns(instance, r, emp.isurranceCode, [ c + 12]);
              this.updateNextColumns(instance, r, emp.typeBirthday, [ c + 13]);
              this.updateNextColumns(instance, r, emp.birthday, [ c + 14]);
              this.updateNextColumns(instance, r, emp.gender, [ c + 15]);
              this.updateNextColumns(instance, r, emp.nationalityCode, [ c + 16]);
              this.updateNextColumns(instance, r, emp.peopleCode, [ c + 17]);
              this.updateNextColumns(instance, r, emp.registerCityCode, [ c + 19]);
              this.updateNextColumns(instance, r, emp.registerDistrictCode, [ c + 20]);
              this.updateNextColumns(instance, r, emp.registerWardsCode, [ c + 21]);
              this.updateNextColumns(instance, r, '00', [42]);
              this.updateNextColumns(instance, r, emp.identityCar, [c + 23]);
              this.updateSelectedValueDropDown(columns, instance, r);
          });

        }else {
          this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
          c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17,c + 18,c + 19,c + 20, c + 21, c + 23]);

          const value = instance.jexcel.getValueFromCoords(1, r);
          const numberColumn = this.tableHeaderColumnsFamilies.length;
          this.updateNextColumns(instance, r,value, [(numberColumn -1)]);
        }

      }  else if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstCode = cell.innerText.split(' - ').shift();
        if(hospitalFirstCode !== '' && hospitalFirstCode !== undefined)
        {
          this.hospitalService.getById(hospitalFirstCode).subscribe(data => {
            this.updateNextColumns(instance, r,  data.name, [ c + 1 ]);
          });
        } else {
          this.updateNextColumns(instance, r, '', [ c + 1 ]);
        }
      } else if (column.key === 'sameAddress') {
        const isSameAddress = instance.jexcel.getValueFromCoords(c, r);

        if(isSameAddress === true)
        {
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(26, r), [ c + 1]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(27, r), [ c + 2]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(28, r), [ c + 3]);
          this.updateSelectedValueDropDown(columns, instance, r);

        } else {
          this.updateNextColumns(instance, r, '', [ c + 1]);
          this.updateNextColumns(instance, r, '', [ c + 2]);
          this.updateNextColumns(instance, r, '', [ c + 3]);
        }
      } else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'cityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'relationshipCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
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

    this.notificeEventValidData('family');
  }

  private updateSelectedValueDropDown(columns, instance, r) {

    columns.forEach((column, colIndex) => {
      if (column.defaultLoad) {
        instance.jexcel.updateDropdownValue(colIndex, r);
      }
    });
  }

  handleChangeTable({ instance, cell, c, r, records }) {
    eventEmitter.emit('unsaved-changed');
    let parentKey = '';
    if (c !== null && c !== undefined && records[r].options.isLeaf) {
      parentKey = records[r].options.parentKey;
      c = Number(c);
      const column = this.tableHeaderColumns[c];
      if (column.key === "fullName") {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.updateNextColumns(instance, r, '', [c + 3], true);
        }, 10);
      } else if (column.key == "isReductionWhenDead") {

        const isReductionWhenDead = records[r][c];
        if(!isReductionWhenDead) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.updateNextColumns(instance, r, '', [c + 1], true);
          }, 10);
        }
        
      } else if (column.key === 'isExitsIsurranceNo') {

        const isExitsIsurranceNo = records[r][c];
        const indexOfIsurranceCode = this.tableHeaderColumns.findIndex(c => c.key === 'isurranceCode');
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (!isExitsIsurranceNo) {
           this.updateNextColumns(instance, r, '', [ indexOfIsurranceCode ]);
          } else {
            this.updateNextColumns(instance, r, records[r].origin.isurranceCode, [indexOfIsurranceCode]);
          }
        }, 10);

      } else if (column.key === 'planCode') {
        const indexOfFromDateJoin = this.tableHeaderColumns.findIndex(c => c.key === 'fromDateJoin')
        const planCode = records[r][c];
        const fromDateJoin = records[r][indexOfFromDateJoin];
        this.setDataByPlanCode(instance, records,r, planCode, fromDateJoin);
      } else if (column.key === 'fromDateJoin') {
        const indexOfPlanCode = this.tableHeaderColumns.findIndex(c => c.key === 'planCode')
        const fromDateJoin = records[r][c];
        const planCode = records[r][indexOfPlanCode];
        this.setDataByPlanCode(instance, records,r, planCode, fromDateJoin);
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
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 3 ]);
      } else if( column.key === 'tyleNSDP') {
        if (this.parentKeyNotCaculator !== parentKey && (this.level === 2 || this.level === 3 || this.level === 4)) {
          this.getCaculatorByLevel(instance, cell, c, r, records);
        }
      } else if( column.key === 'numberMonthJoin') {
        console.log(parentKey, 'xxxxxx')
        if (this.parentKeyNotCaculator !== parentKey) {
          this.getCaculatorByLevel(instance, cell, c, r, records);
        }
        
      } else if( column.key === 'salary') {

        const salary = records[r][c];
        if(salary > 0) {
          this.updateNextColumns(instance, r, '0', [c + 1]);
        } 
        
        if (this.parentKeyNotCaculator !== parentKey) {
          this.getCaculatorByLevel(instance, cell, c, r, records);
        }

      } else if (column.key === 'sumRatio') {
        const ratio = records[r][c];
        if(ratio > 0) {
          this.updateNextColumns(instance, r, '0', [c - 1]);
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
    // this.setDataToInformationList(employeesInDeclaration);
    this.sumCreateBHXH();
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
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
      row.genderAdd = beforeRow.genderAdd; 
    } else if (!beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = afterRow.parent;
      row.parentKey = afterRow.parentKey;
      row.planType = afterRow.planType;
      row.groupObject = afterRow.groupObject;
      row.genderAdd = beforeRow.genderAdd; 
    } else if (beforeRow.isLeaf && afterRow.isLeaf) {
      row.parent = beforeRow.parent;
      row.parentKey = beforeRow.parentKey;
      row.planType = beforeRow.planType;
      row.groupObject = beforeRow.groupObject;
      row.genderAdd = beforeRow.genderAdd; 
    }

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {
    const declarations = [ ...this.declarations ];
    let declarationsDeleted = [];
    let declarationsFirstDeleted;
    const beforeRow = records[rowNumber - 1];
    const afterRow = records[rowNumber];

    if (!((beforeRow.options && beforeRow.options.isLeaf) || (afterRow.options && afterRow.options.isLeaf))) {
      const row: any = declarations[rowNumber];
      const origin = { ...row.data.origin };
      const options = { ...row.data.options };
      origin.employeeId = 0;
      origin.id = 0;
      declarationsFirstDeleted = {
        data: [...row.data],
        origin: { ...row.data.origin },
        options: { ...row.data.options }
    };
      row.data = [];
      row.origin = origin;
      row.options = options;
      row.isInitialize = true;

      if (!(beforeRow.options && beforeRow.options.isLeaf) && !(afterRow.options && afterRow.options.isLeaf)) {
        const nextRow: any = declarations[rowNumber + 1];

        if (nextRow.isLeaf) {
          declarationsDeleted.push(declarations.splice(rowNumber + 1, numOfRows - 1));
        }
        declarationsDeleted.push(declarationsFirstDeleted);
      }
    } else {
      declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    }
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.deleteEmployeeInFamilies(declarationsDeleted);
    this.deleteEmployeeInInfomation(declarationsDeleted);
    this.sumCreateBHXH();
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
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
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
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
    this.notificeEventValidData('allocationCard');
    this.notificeEventValidData('families');
    this.notificeEventValidData('informations');
    eventEmitter.emit('unsaved-changed');
  }


  deleteEmployeeInFamilies(declarationsDeleted: any) {
    if (!this.autoCreateFamilies) {
      return;
    }
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

  deleteEmployeeInInfomation(declarationsDeleted: any) {

    if (!this.autoCreateDocumentList) {
      return;
    }

    let informations = [...this.informations];
    
    declarationsDeleted.forEach(d => {
      const employeeInfo = this.getDeclarationInData(d.data, this.tableHeaderColumns);
      informations = informations.filter(info => {
          return info.employeeId + info.planCode !== employeeInfo.employeeId + employeeInfo.planCode;
      });
    });

    const itemPerPage = 10 - informations.length;
    let numberItem = 5;
    if(itemPerPage > 0) {
      numberItem = itemPerPage;
    }

    for (let index = 0; index < numberItem; index++) {
      informations.push({
        data: [index + 1],
        origin: {
          employeeId: '',
          isLeaf: true,
        } 
      });
    }
    this.informations = informations;
  }

  getDeclarationInData(record, columns) {
    let declaration: any = {};
    columns.map((column, index) => {
      declaration[column.key] = record[index];
    });
    return declaration;
  }

  collapseChange(isActive, type) {
    this.panel[type].active = isActive;
  }   

  handleChangeForm() {
    eventEmitter.emit('unsaved-changed');
  }

  checkInsurranceCode() {

    const declarations = [...this.declarations];
    const INSURRANCE_FULLNAME_INDEX = 1;
    const INSURRANCE_CODE_INDEX = 3;
    const INSURRANCE_STATUS_INDEX = 4;
    const errors = {};
    this.isCheckIsuranceCode = true;
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

    this.notificeEventValidData('documentList');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteInfomation({ rowNumber, numOfRows }) {
    const infomations = [ ...this.informations ];

    const infomaionDeleted = infomations.splice(rowNumber, numOfRows);
    this.informations = infomations;
    this.notificeEventValidData('documentList');
    eventEmitter.emit('unsaved-changed');
  }

  private handleAddDocumentRow({ rowNumber, numOfRows, beforeRowIndex, afterRowIndex, insertBefore }) { 
    const informations = [ ...this.informations ];
    let row: any = {};
    const data: any = [];
    row.data = data;
    row.isMaster = false;

    row.origin = {
      isLeaf: true,
      employeeId: '',
    };

    informations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.informations  = informations;
    this.notificeEventValidData('documentList');
    eventEmitter.emit('unsaved-changed');
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
    let infomationscopy = [ ...infomations ];
    infomationscopy.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
      };
    });

    const itemPerPage = 10 - infomationscopy.length;
    let numberItem = 5;
    if(itemPerPage > 0) {
      numberItem = itemPerPage;
    }

    for (let index = 0; index < numberItem; index++) {
      infomationscopy.push({
        data: [index + 1],
        origin: {
          employeeId: '',
          isLeaf: true,
        } 
      });
    }
    return infomationscopy;
  }

  private loadDefaultInformations() {
    const dataFake = [];
    for (let index = 0; index < 10; index++) {
      dataFake.push({
        data: [index + 1],
        origin: {
          employeeId: '',
          isLeaf: true,
        }        
      });
    }
    return dataFake;
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

        if (column.key === 'isReductionWhenDead') {
          return { ...combine, [ column.key ]: column.key === 'isReductionWhenDead' ? +array[current] : array[current]};
        }

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current]};
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

        return { ...combine, [ column.key ]: column.key === 'gender' ? +array[current] : array[current], [ column.key ]: column.key === 'isReductionWhenDead' ? +array[current] : array[current] };
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

  reformatFamilies() {
    const families = [];
    let familiescopy = [ ...this.families ];
    familiescopy.forEach(family => {
        if(family.fullName) {
          family.isMaster = family.origin.isMaster
          family.id = family.id ? family.id : 0;
          family.gender = family.gender ? 1: 0;
          family.declarationGender = family.declarationGender ? 1: 0;

          families.push(family);
        }
    });

    return families;
  }

  fomatFamilies(families) {
    
    if(!families) {
      return [];
    }

    let familiesFomat = [];
    families.forEach(p => {
      p.conditionValid = p.relationshipFullName ? p.relationshipFullName : p.fullName;
      p.data = this.tableHeaderColumnsFamilies.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
     
      p.data.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
        isMaster: p.isMaster,
      };

      p.origin = {
        employeeId: p.employeeId,
        isLeaf: true,
        isMaster: p.isMaster,
      };

      familiesFomat.push(p);
      const containMember = families.findIndex(e => (!e.isMaster && e.employeeId  === p.employeeId)) > -1;
      if(!containMember) {
        familiesFomat.push(this.fakeEmployeeInFamilies(p));
        familiesFomat.push(this.fakeEmployeeInFamilies(p));
      }
      
    });

    return familiesFomat;

  }

  private setDataToFamilies(employeesInDeclaration: any)
  {
    let currentFamilis = [...this.families]
    const families = [];
    const employees = [];
    const employeesId = [];
    const employeeNotExitsIsurranceNo = employeesInDeclaration.filter(e => !e.isExitsIsurranceNo);
    const employeeIsExitsIsurranceNo = employeesInDeclaration.filter(e => e.isExitsIsurranceNo);
    employeeIsExitsIsurranceNo.forEach(emp => {
      currentFamilis = currentFamilis.filter(fa => fa.employeeId !== emp.employeeId);
    });
    
    employeeNotExitsIsurranceNo.forEach(emp => {

      const firstEmployee = currentFamilis.find(f => f.employeeId === emp.employeeId);
      if(!firstEmployee) {
        employees.push(emp);
      } else {

        const family = families.find(p => p.employeeId === emp.employeeId);
        if(family) {
          return;
        }

        const currentFamilies = currentFamilis.filter(fm => fm.employeeId === emp.employeeId);
        if(currentFamilies){
          currentFamilies.forEach(oldEmp => {
            families.push(oldEmp);
          });
        }
      }

    });

    if(currentFamilis.length === 0 && employees.length === 0) {
      families.push({
        isMaster: false,
      });
      this.families = families;
      return;
    }

    if(employees.length === 0) {
      this.families = families;
      return;
    }
    
    forkJoin(
      employees.map(emp => {
        return this.employeeService.getEmployeeById(emp.employeeId)
      })
    ).subscribe(emps => {
      const familiesNotExists = [];
      emps.forEach(ep => {
        const master = this.getMaster(ep.families);
        master.isMaster = ep.isMaster;
        master.declarationTypeBirthday = ep.typeBirthday;
        master.declarationBirthday = ep.birthday;
        master.declarationGender = ep.gender;
        master.declarationPeopleCode = ep.peopleCode;
        master.declarationNationalityCode = ep.nationalityCode;
        master.declarationIdentityCar = ep.identityCar;
        master.declarationMobile = ep.mobile;
        master.registerCityCode =  ep.registerCityCode;
        master.registerDistrictCode = ep.registerDistrictCode;
        master.registerWardsCode = ep.registerWardsCode;
        master.recipientsCityCode = ep.recipientsCityCode;
        master.recipientsDistrictCode =  ep.recipientsDistrictCode;
        master.recipientsWardsCode = ep.recipientsWardsCode;
        master.recipientsAddress = ep.recipientsAddress;
        master.hospitalFirstRegistCode =  ep.hospitalFirstRegistCode;
        master.hospitalFirstRegistName = ep.hospitalFirstRegistName;
        master.reason = ep.reason;
        master.documentAttached = ep.documentAttached;
        master.employeeName = ep.fullName;
        master.employeeId = ep.employeeId;
        master.relationFamilyNo = ep.relationFamilyNo;
        master.relationshipMobile = ep.relationshipMobile;
        master.relationshipFullName = ep.relationshipFullName;
        master.relationshipBookNo = ep.relationshipBookNo;
        master.relationshipDocumentType =  ep.relationshipDocumentType;
        master.relationshipCityCode = ep.relationshipCityCode;
        master.relationshipDistrictCode = ep.relationshipDistrictCode;
        master.relationshipWardsCode = ep.relationshipWardsCode;
        master.relationAddress = ep.relationAddress;
        master.peopleCode = ep.peopleCode,
        master.nationalityCode = ep.nationalityCode,
        master.relationshipCode = '00';
        master.conditionValid = ep.relationshipFullName ? ep.relationshipFullName : ep.fullName;
        master.origin = {
          employeeId: ep.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        familiesNotExists.push(master);
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
            familiesNotExists.push(fa);
          });
        }else {
          // nếu chưa có thông tin của gia đình thì add dòng trống
          familiesNotExists.push(this.fakeEmployeeInFamilies(ep));
          familiesNotExists.push(this.fakeEmployeeInFamilies(ep));
        }

      });

      familiesNotExists.forEach(d => {
        families.push(d);
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

  private updateEmployeeInFamily(user) {
    const families = [ ...this.families ];
    families.forEach(d => {
      if(d.origin &&  d.origin.isMaster &&  d.origin.employeeId === user.id) {
         
        Object.keys(d).forEach(keyMapping => {
          let userKey = keyMapping;
          const column = this.tableHeaderColumnsFamilies.find(c => c.key === keyMapping);
          if (column) {
            userKey = column.keyMapping;
          }
          if(user[userKey] !== undefined) {
             d[keyMapping] = user[userKey];
          }           
        });

        d.employeeName = user.fullName;
        d.data = this.tableHeaderColumnsFamilies.map(column => {
          if (!column.key || !d[column.key]) return '';
          return d[column.key];
        });
        d.data.origin = d.origin;
      }
    });

    this.families = families;
  }

  handlersDeleteUseOnTree(user) {

    let families = [...this.families];
    families = families.filter(fa => fa.employeeId !== user.employeeId);
    // Kiểm tra nếu danh sách nhân viên trông thì add  1 dòng
    if(families.length === 0) {
      families.push({
        isMaster: false,
      });
    }

    this.families = families;
  }

  private updateEmployeeInInfomation(user) {

    const informations = [ ...this.informations ];
    informations.forEach(d => {
      if(d.origin && d.origin.employeeId === user.id) {
        Object.keys(d).forEach(key => {
          if(user[key] !== undefined) {
             d[key] = user[key];
          }           
        });

        d.data = this.tableHeaderColumnsDocuments.map(column => {
          if (!column.key || !d[column.key]) return '';
          return d[column.key];
        });
        d.data.origin = d.origin;
      }
    });

    this.informations = informations;
  }
  
  fakeEmployeeInFamilies(employee) {

    return {
      isMaster:false,
      conditionValid: null,
      employeeId: employee.employeeId,
      origin: {
        employeeId: employee.employeeId,
        isLeaf: true,
        isMaster: false,
      }
    }

  }

  private setDataToInformationList(employeesInDeclaration: any)
  {
    if (!this.autoCreateDocumentList) {
      return;
    }

    const informationsCopy = [...this.informations];
    const informations =  informationsCopy.filter(i => (i.fullName !== '' && i.fullName !== undefined && (i.origin.employeeId === '' || i.origin.employeeId === null)));  
    employeesInDeclaration.forEach(emp => {
      emp.companyRelease = this.currentCredentials.companyInfo.name;
      const fromDate = this.getFromDate(emp.fromDateJoin);
      const curentDate = new Date();
      const  numberFromDate = (fromDate.getMonth() + 1 + fromDate.getFullYear());
      const  numberCurentDate = (curentDate.getMonth() + 1 + curentDate.getFullYear());
  
      if(numberFromDate >= numberCurentDate)
      {
        return;
      }
  
      const documents = this.getDocumentByPlancode(emp.planCode);
      if(!documents) {
        return '';
      }
  
      documents.forEach(doc => {
        let item = this.informations.find(i => (i.planCode === emp.planCode && i.employeeId === emp.employeeId && i.documentCode === doc.documentCode));
        if (!item) {
          item = {
              documentNote: doc.documentNote,
              documentType: doc.documentType,  
              isurranceNo: emp.isurranceNo,           
              isurranceCode: emp.isurranceCode,    
              fullName: emp.fullName,
              documentCode: doc.documentCode,
              planCode: emp.planCode,
              employeeId: emp.employeeId,
              origin: {
                employeeId: emp.employeeId,
                isLeaf: true,
                planCode: emp.planCode,
                documentCode: doc.documentCode,
              }
          }; 
        }
  
        item.companyRelease = item.companyRelease ? item.companyRelease : this.buildMessgaeByConfig(doc.companyRelease,emp);
        item.dateRelease = item.dateRelease ? item.dateRelease : this.buildMessgaeByConfig(doc.dateRelease,emp);
        item.documentNo = this.buildMessgaeByConfig(doc.documentNo,emp);
        item.documentAppraisal = this.buildMessgaeByConfig(doc.documentAppraisal,emp);
        item.isurranceNo = emp.isurranceNo;
        item.isurranceCode = emp.isurranceCode;
        item.fullName = emp.fullName;
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

  private getFromDate(dateMonthYear) {
    const fullDate = '01/' + dateMonthYear;
    if(!moment(fullDate,"DD/MM/YYYY")) {
      return new Date();
    }
    return moment(fullDate,"DD/MM/YYYY").toDate();
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
    eventEmitter.emit('adjust-general:tab:change', index);
  }

  protected formatNote(str, args) {
    for (let i = 0; i < args.length; i++)
       str = str.replace("{" + i + "}", args[i]);
    return str;
  }

  loadAppConfig(callback) {
    this.appConfigService.getAppConfig().subscribe((data) => {
      callback(data);
    });
  }

  private loadBenefitLevel(data,code) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.groupBenefitLevelService.getBylevel(code).subscribe((item) => {
        this.ratioPayment = data.ratioPayment;
        this.tyleTGBHYT = data.tyleTGBHYT;
        this.salaryBase = data.salaryBase;
        this.tyleNSNN = item.tyleNSNN;
        this.level = item.level;
        this.readOnlySalary = item.readOnlySalary;
        this.readOnlyRatio = item.readOnlyRatio;
        this.defaultValueRatio = item.defaultValueRatio;
        const maxSalry = 20 * data.salaryBase;
        this.salaryAreas = {
          salaray: data.salaryBase,
          level: item.level,
          maxSalry: maxSalry,
        }

        // console.log(item, item.level,'xxxxx');
        const objectType = this.currentCredentials.companyInfo.objectType;
        if (this.calculationType === 0 && objectType === 'GD') {
          this.tyleNSNN = 0;
        }
      
        this.tableHeaderColumns.forEach((column, index) => {
          if (column.key === 'salary' && item.level === 5) {
              column.validations = {
                number: true,
                max: maxSalry
              }
          }
  
          if (column.key === 'numberMonthJoin' && objectType === 'GD') {
            column.type = 'dropdown';
            column.source = [ { id: 3, name: '3 tháng' }, { id: 6, name: '6 tháng' }, { id: 12, name: '12 tháng' }];
          }

          if (column.key === 'salary') { //&& (item.level === 2 || item.level === 3 || item.level === 4)) {
            column.readOnly = item.readOnlySalary;
          }

          if (column.key === 'sumRatio') { //&& (item.level === 2 || item.level === 3 || item.level === 4)) {
            column.readOnly = item.readOnlyRatio;
          }

          if (column.column === 'moneyPayment' && (item.level === 2 || item.level === 3)) {
            column.readOnly = true;
          }

          if(column.key === 'tyleNSDP' && ( item.level === 2 ||  item.level === 3)) {
            column.type = 'dropdown';
            column.source = [ { id: 100, name: '100%' }];
          }

          if(column.key === 'tyleNSDP' && ( item.level === 4)) {
            delete column.suffix;
            column.type = 'numeric';
            column.readOnly = false;
            column.suffix = '%';
            column.validations =  {
              number: true,
              required: true,
              min: 0,
              max: 100
            }
          }

          if(column.key === 'tyleNSDP' && ( item.level === 5)) {
            if(this.calculationType === 2) {
              column.type = 'dropdown';
              column.readOnly = true;
              column.source = [{ id: 20, name: '20' }];
            }

            if(this.calculationType === 0) {
              column.type = 'dropdown';
              column.readOnly = true;
              column.source = [{ id: 0, name: '0' }];
            }
          }
        });

        this.form.patchValue({
          benefitLevelName: item.benefitLevel,
          resource: item.groupBenefitLevel
        });

      })
    },10);
  }

  private calculatorSalaryOption1(instance, cell, c, r, records) {
      const indexOfNumberMonthJoin = this.tableHeaderColumns.findIndex(c => c.key === 'numberMonthJoin');
      const indexOfSalary = this.tableHeaderColumns.findIndex(c => c.key === 'salary');
      const indexOfOrder = this.tableHeaderColumns.findIndex(c => c.key === 'orders');
      const indexOfSumRatio = this.tableHeaderColumns.findIndex(c => c.key === 'sumRatio');
      const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
      const indexOfTyleNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'tyleNSDP');
      const indexOfMoneyPayment = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPayment');
      const indexOfMoneyPersion = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPersion');
      const numberMonthJoin = records[r][indexOfNumberMonthJoin];
      const salary = records[r][indexOfSalary];
      const sumRatio = records[r][indexOfSumRatio];
      const order = records[r][indexOfOrder];
      const percent = this.getPercent(order);      
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        // Nếu người dùng nhập giá trị lương thì set bằng giá trị lương
        let total = 0;
        let soTienNSDP = 0;
        if (salary > 0) {
          total = ((((salary || 0)  * this.tyleTGBHYT ) / 100) * Number(numberMonthJoin) * percent.percent) / 100;
        } else {
          total = (((sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(numberMonthJoin) * percent.percent) / 100;
        }

        if (order === 1) {
          soTienNSDP = (total * percent.ratio) / 100;
        } else {
          soTienNSDP = this.getFirstPersion(records, r);
        }
        const moneyPersion = (this.salaryBase * sumRatio * percent.percent) / 100;
        this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
        this.updateNextColumns(instance, r, soTienNSDP, [indexOfSoTienNSDP], true);
        this.updateNextColumns(instance, r, percent.ratio, [indexOfTyleNSDP], true);
        this.updateNextColumns(instance, r, moneyPersion, [indexOfMoneyPersion], true);
      }, 10);
  } 

  private calculatorSalaryOption2(instance, cell, c, r, records) {
    const indexOfNumberMonthJoin = this.tableHeaderColumns.findIndex(c => c.key === 'numberMonthJoin');
    const indexOfSalary = this.tableHeaderColumns.findIndex(c => c.key === 'salary');
    const indexOfOrder = this.tableHeaderColumns.findIndex(c => c.key === 'orders');
    const indexOfSumRatio = this.tableHeaderColumns.findIndex(c => c.key === 'sumRatio');
    const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
    const indexOfTyleNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'tyleNSDP');
    const indexOfMoneyPayment = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPayment');
    const indexOfMoneyPersion = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPersion');
    const numberMonthJoin = records[r][indexOfNumberMonthJoin];
    const salary = records[r][indexOfSalary];
    const sumRatio = records[r][indexOfSumRatio];
    const order = records[r][indexOfOrder];
    const percent = this.getPercent(order);      
    clearTimeout(this.timer);
    // console.log(this.level,'vao ddaay', percent);
    let ratioSupport = percent.ratio;
    const objectType = this.currentCredentials.companyInfo.objectType;
    if (this.calculationType === 0 && objectType === 'GD') {
      ratioSupport = 0;
    }

    this.timer = setTimeout(() => {
      // Nếu người dùng nhập giá trị lương thì set bằng giá trị lương
      let total = 0;
      let soTienNSDP = 0;
      if (salary > 0) {
        total = ((((salary || 0)  * this.tyleTGBHYT ) / 100) * Number(numberMonthJoin) * percent.percent) / 100;
      } else {
        total = (((sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(numberMonthJoin) * percent.percent) / 100;
      }
      soTienNSDP = (total * ratioSupport) / 100;
      const moneyPersion = (this.salaryBase * sumRatio * percent.percent) / 100;
      this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
      this.updateNextColumns(instance, r, soTienNSDP, [indexOfSoTienNSDP], true);
      this.updateNextColumns(instance, r, ratioSupport, [indexOfTyleNSDP], true);
      this.updateNextColumns(instance, r, moneyPersion, [indexOfMoneyPersion], true);
    }, 10);
  } 

  private calculatorSalaryLevel1(instance, cell, c, r, records) {
    const indexOfNumberMonthJoin = this.tableHeaderColumns.findIndex(c => c.key === 'numberMonthJoin');
    const indexOfSalary = this.tableHeaderColumns.findIndex(c => c.key === 'salary');
    const indexOfSumRatio = this.tableHeaderColumns.findIndex(c => c.key === 'sumRatio');
    const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
    const indexOfTyleNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'tyleNSDP');
    const indexOfMoneyPayment = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPayment');
    const indexOfMoneyPersion = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPersion');
    const numberMonthJoin = records[r][indexOfNumberMonthJoin];
    const salary = records[r][indexOfSalary];
    const sumRatio = records[r][indexOfSumRatio];
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
       
      let total = 0;
      let soTienNSDP = 0;
      let moneyPersion = 0;
      if (salary > 0) {
        total = (((salary || 0)  * this.tyleTGBHYT ) / 100) * Number(numberMonthJoin);
        moneyPersion = (salary || 0);
      } else {
        total = ((sumRatio * this.salaryBase * this.tyleTGBHYT) / 100) * Number(numberMonthJoin);
        moneyPersion = (this.salaryBase * sumRatio);
      }
      this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
      this.updateNextColumns(instance, r, 0, [indexOfSoTienNSDP], true);
      this.updateNextColumns(instance, r, 0, [indexOfTyleNSDP], true);
      this.updateNextColumns(instance, r, moneyPersion, [indexOfMoneyPersion], true);
      
    }, 10);
  } 

  private calculatorSalaryLevel234(instance, cell, c, r, records) {
    const indexOfNumberMonthJoin = this.tableHeaderColumns.findIndex(c => c.key === 'numberMonthJoin');
    const indexOfSalary = this.tableHeaderColumns.findIndex(c => c.key === 'salary');
    const indexOfSumRatio = this.tableHeaderColumns.findIndex(c => c.key === 'sumRatio');
    const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
    const indexOfTyleNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'tyleNSDP');
    const indexOfMoneyPayment = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPayment');
    const indexOfMoneyPersion = this.tableHeaderColumns.findIndex(c => c.key === 'moneyPersion');
    const numberMonthJoin = records[r][indexOfNumberMonthJoin];
    const salary = records[r][indexOfSalary];
    const sumRatio = records[r][indexOfSumRatio];
    const tyleNSDP =  records[r][indexOfTyleNSDP];

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      // Nếu người dùng nhập giá trị lương thì set bằng giá trị lương
      let total = 0;
      let soTienNSDP = 0;
      let moneyPersion = 0;
      if (salary > 0) {
        total = ((((salary || 0)  * this.tyleTGBHYT * (100 - this.tyleNSNN)) / 100) * Number(numberMonthJoin)) /100;
        moneyPersion = (salary || 0);
        soTienNSDP =  (((salary * tyleNSDP * this.tyleTGBHYT) / 100) * Number(numberMonthJoin)) / 100;
      } else {
        total = (((sumRatio * this.salaryBase * this.tyleTGBHYT * (100 - this.tyleNSNN)) / 100) * Number(numberMonthJoin)) / 100;
        moneyPersion = (this.salaryBase * sumRatio);
        soTienNSDP = (((this.salaryBase * tyleNSDP * this.tyleTGBHYT) / 100) * Number(numberMonthJoin)) / 100;
      }
      this.updateNextColumns(instance, r, total, [indexOfMoneyPayment], true);
      this.updateNextColumns(instance, r, soTienNSDP, [indexOfSoTienNSDP], true);
      this.updateNextColumns(instance, r, moneyPersion, [indexOfMoneyPersion], true);
    }, 10);
  } 

  private getCaculatorByLevel(instance, cell, c, r, records) {    
    if(this.level === 1) {
      this.calculatorSalaryLevel1(instance, cell, c, r, records);
    } else if(this.level === 2 || this.level === 3 || this.level === 4) {
      this.calculatorSalaryLevel234(instance, cell, c, r, records);
    } else {
      if (this.calculationType === 1) {
        this.calculatorSalaryOption1(instance, cell, c, r, records);
      } else {
        this.calculatorSalaryOption2(instance, cell, c, r, records);
      }
    }
  }

  private getFirstPersion(records, r) {
    const parentKey = records[r].options.parentKey;
    const persions = [];
    records.forEach(row => {
      if (parentKey === row.options.parentKey) {
        persions.push(row);
      }
    });

    if( persions.length === 0) {
      return -1;
    }
    const indexOfOrder = this.tableHeaderColumns.findIndex(c => c.key === 'orders');
    const indexOfSoTienNSDP = this.tableHeaderColumns.findIndex(c => c.key === 'soTienNSDP');
    const firstPersion = persions.find(p => p[indexOfOrder] === 1);
    if (firstPersion) {
      // Lấy số tiền ngân sách DP hỗ trợ ban đầu
      return firstPersion[indexOfSoTienNSDP];
    }

    return 0;
  }

  private sumCreateBHXH() {
    let totalCardInsurance =  0;
    const indexOfPlanCode = this.tableHeaderColumns.findIndex(c => c.key === 'planCode');
    // const indexOfIsExitsIsurranceNo = this.tableHeaderColumns.findIndex(c => c.key === 'isExitsIsurranceNo');
    this.declarations.forEach(d => {
        const planCode = d.data[indexOfPlanCode];
        // const isExitsIsurranceNo = d.data[indexOfIsExitsIsurranceNo];
        const isSumNumberInsurance = PLANCODECOUNTBHYT.findIndex(p => p === planCode) > -1;
        if(isSumNumberInsurance) {
          totalCardInsurance += 1;
        }
    });

    this.declarationGeneral.patchValue({
      totalCardInsurance: totalCardInsurance,
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

    for (const i in this.documentForm.controls) {
      this.documentForm.controls[i].markAsDirty();
      this.documentForm.controls[i].updateValueAndValidity();
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

    for (const i in this.form.controls) {
      this.form.controls[i].markAsDirty();
      this.form.controls[i].updateValueAndValidity();
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

  private notificeEventValidData(tableName) {

    this.tableSubject.next({
      tableName: tableName,
      type: 'validate',
      tableEvent: this.eventValidData
    });

  }

  private getEmployeeInDeclarations(records: any) {
    const employeesInDeclaration = [];
    records.forEach(r => {
        let declaration: any = {};
        this.tableHeaderColumns.map((column, index) => {
          declaration[column.key] = r.data[index];
        });

        if(declaration.employeeId !== '' && declaration.employeeId !== undefined) {
          employeesInDeclaration.push(declaration);
        }
    });
    return employeesInDeclaration;
  }

  private buildMessgaeByConfig(objConfig, employeeInfo) {
    const argsColumn = objConfig.column || [] ;
    const mesage = objConfig.mesage || '' ;
    const argsMessgae = [];
    argsColumn.forEach(column => { 
      let valueOfColumn =  employeeInfo[column];
      if (employeeInfo[column] === undefined) {
        valueOfColumn = '';
      }
      argsMessgae.push(valueOfColumn);
     
    });

    return this.formatNote(mesage, argsMessgae);;
  }

  protected isHasLeaf() {    
    const declarations = [ ...this.declarations];
    const indexOfIsurranceCode = this.tableHeaderColumns.findIndex(c => c.key === 'isurranceCode');
    const declarationUsers = declarations.filter(d => {
      return d.origin && (d.origin.employeeId || d.employeeId) > 0 && d.data[indexOfIsurranceCode] !== '' && d.data[indexOfIsurranceCode] !== undefined;
    });
    return declarationUsers.length > 0;
  }

  private getPercent(order) {
    const percent = RatioFamily[order] || RatioFamily[0];
    return percent;
  }
  
  private setDataByPlanCode(instance, records, r, planCode, fromDate) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {     
      const planConfigInfo = validationColumnsPlanCode603[planCode] || {note:{argsColumn: [], message: ''}};
      const argsColumn = planConfigInfo.note.argsColumn || [] ;
      const argsMessgae = [];

      argsColumn.forEach(column => {
        const firstColumn = column.split('$').shift();
        const indexOfColumn = this.tableHeaderColumns.findIndex(c => c.key === firstColumn);
        const valueColunm = records[r][indexOfColumn];
        let messageBuilder = '';
        if(valueColunm !== undefined && valueColunm !== '') {
          messageBuilder =  column.split('$')[1] || '';
          messageBuilder = messageBuilder + valueColunm;
        }
        argsMessgae.push(messageBuilder);
      });

      const indexColumnNote = this.tableHeaderColumns.findIndex(c => c.key === 'reason');
      const notebuild = this.formatNote(planConfigInfo.note.message, argsMessgae);
      this.updateNextColumns(instance, r, notebuild, [indexColumnNote]);
    }, 10);
  }

  uploadData() {
    const uploadData = {
        declarationCode: this.declarationCode
    };
    const modal = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Thủ tục ' + this.declarationCode + ' Nhập dữ liệu từ excel',
      nzContent: UploadFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        uploadData
      }
    });

    modal.afterClose.subscribe(result => {
      if(result) {
        this.informations = this.fomatInfomation(result.informations);
        this.addEmployeeImport(result.declarationDetail);
      }
    });
  }
}
