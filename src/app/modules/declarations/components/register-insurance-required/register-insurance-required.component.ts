import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import * as moment from 'moment';
import * as _ from 'lodash';
import { REGEX } from '@app/shared/constant';
import { validationColumnsPlanCode } from '@app/shared/constant-valid';

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
  VillageService,
  FileUploadEmitter,
  DeclarationConfigService,
  ExternalService
} from '@app/core/services';
import { DATE_FORMAT, DOCUMENTBYPLANCODE } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/register-insurance-required.data';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';
import { TABLE_FAMILIES_NESTED_HEADERS, TABLE_FAMILIES_HEADER_COLUMNS } from '@app/modules/declarations/data/families-editor.data';
import { TableEditorErrorsComponent } from '@app/shared/components';

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // ~ 20MB

@Component({
  selector: 'app-register-insurance-required',
  templateUrl: './register-insurance-required.component.html',
  styleUrls: [ './register-insurance-required.component.less' ]
})
export class RegisterInsuranceRequiredComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Input() isSpinning: boolean;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
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
  tableSubject: Subject<any> = new Subject<any>();
  validateSubject: Subject<any> = new Subject<any>();
  eventsSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];
  families: any[] = [];
  informations: any[] = [];
  declaration: any;
  isHiddenSidebar = false;
  declarationCode: string = '605';
  declarationName: string = '';
  allowAttachFile: boolean;
  autoCreateDocumentList: boolean;
  autoCreateFamilies: boolean;
  employeeSubject: Subject<any> = new Subject<any>();
  handlers: any[] = [];
  handler;
  isTableValid = false;
  dataIsValid = true;
  eventValidData = 'adjust-general:validate';
  tableErrors = {};
  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  totalNumberInsurance: any;
  totalCardInsurance: any;
  isBlinking = false;
  submitType: string;
  files: any[] = [];
  timer: any;
  status = 0;
  isCheckIsuranceCode: boolean = false;
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
    private villageService: VillageService,
    private fileUploadEmitter: FileUploadEmitter,
    private declarationConfigService: DeclarationConfigService,
    private externalService: ExternalService,
  ) {
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);

    this.getRelationshipDistrictsByCityCode = this.getRelationshipDistrictsByCityCode.bind(this);
    this.getRelationshipWardsByDistrictCode = this.getRelationshipWardsByDistrictCode.bind(this);
    this.getRecipientsVillageCodeByWarssCode = this.getRecipientsVillageCodeByWarssCode.bind(this);

    this.getDistrictsByCityCode = this.getDistrictsByCityCode.bind(this);
    this.getWardsByDistrictCode = this.getWardsByDistrictCode.bind(this);

    this.getRelationShips = this.getRelationShips.bind(this);
  }

  ngOnInit() {
    const date = new Date();
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      batch: [ {value:'1', disabled: true },[Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)] ],
      month: [ date.getMonth() + 1 , [Validators.required,Validators.min(1), Validators.max(12), Validators.pattern(REGEX.ONLY_NUMBER)]],
      year: [ date.getFullYear(), [Validators.required,Validators.min(1990), Validators.maxLength(4), Validators.pattern(REGEX.ONLY_NUMBER)]]
    });
    
    this.documentForm = this.formBuilder.group({
      submitter: ['', Validators.required],
      mobile: ['',  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      usedocumentDT01: ['1']
    });
     
    this.loadDeclarationConfig();
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
      this.relationshipService.getRelationships(),
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, plans, departments,relationshipDocumentTypies, relationShips ]) => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumns, 'nationalityCode', nationalities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'registerCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'salaryAreaCode', salaryAreas);
      this.updateSourceToColumn(this.tableHeaderColumns, 'planCode', plans);
      this.updateSourceToColumn(this.tableHeaderColumns, 'departmentCode', departments);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'nationalityCode', nationalities);

      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'cityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipDocumentType', relationshipDocumentTypies);
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', relationShips);

      // get filter columns
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipDistrictCode', this.getRelationshipDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipWardsCode', this.getRelationshipWardsByDistrictCode);

      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipVillageCode', this.getRecipientsVillageCodeByWarssCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'districtCode', this.getDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'wardsCode', this.getWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumnsFamilies, 'relationshipCode', this.getRelationShips);


      if (this.declarationId) {
        this.declarationService.getDeclarationsNormalByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations.declarationDetail);
          this.declarations = declarations.declarationDetail;
          this.informations = this.fomatInfomation(declarations.informations);
          this.families = this.fomatFamilies(declarations.families);
          this.files = declarations.files;
          this.status = declarations.status;
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile,
            usedocumentDT01: false,
          });
          const date = new Date();
          this.form.patchValue({
              batch: declarations.batch,
              month: declarations.month,
              year: declarations.year,
          });

        });

        this.isTableValid = true;
      } else {

        this.declarations = this.loadDataDefault();
        this.informations = this.loadDefaultInformations();
        this.documentForm.patchValue({
          submitter: this.currentCredentials.companyInfo.delegate,
          mobile: this.currentCredentials.companyInfo.mobile,
          usedocumentDT01: false,
        });

        this.declarationService.getHeaderDeclaration(this.declarationCode).subscribe(data => {
          this.form.patchValue({
            batch: data.batch,
            month: data.month,
            year: data.year,
          });
        });

      }
    });

    this.handler = eventEmitter.on(this.eventValidData, ({ name, isValid, errors }) => {
        this.tableErrors[name] = errors;
        this.isTableValid = true;
    });

    this.handler = this.fileUploadEmitter.on('file:uploaded', (file) => {
      this.tableSubject.next({
        type: this.submitType
      });
      eventEmitter.emit('saveData:loading', false);
    });
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
    this.handler();
  }

  private loadDeclarationConfig() {
    this.declarationConfigService.getDetailByCode(this.declarationCode).subscribe(data => {
       this.declarationName = data.declarationName;
       this.autoCreateDocumentList = data.autoCreateDocumentList;
       this.autoCreateFamilies = data.autoCreateFamilies;
       this.allowAttachFile = data.allowAttachFile;
    });
  }

  handleAddEmployee() {
    if (!this.employeeSelected.length) {
      return this.modalService.warning({
        nzTitle: 'Chưa có nhân viên nào được chọn',
      });
    }

    eventEmitter.emit('unsaved-changed');

    const declarations = [ ...this.declarations ];
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.fullName !== '');
    let isExist = false;
    if (childLastIndex > -1) {
      
      this.employeeSelected.forEach(employee => {
        const accepted = declarations.findIndex(e => (e.origin && (e.origin.employeeId || e.origin.id)) === employee.id) === -1;
       
        if (accepted) {
          this.setDataToEmployee(employee);
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize data
            declarations.splice(childLastIndex, 1);
            declarations.splice(childLastIndex, 0, this.declarationService.getLeafRow( employee, this.tableHeaderColumns));
          } else {
            declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeafRow(employee, this.tableHeaderColumns));
          }

        } else {

          if (!isExist) {
            isExist = true;
          }

        }
         
      });

      if (isExist) {
          this.modalService.warning({
            nzTitle: `Nhân viên đã có trong danh sách kê khai`,
          });
      }

    } else {
      this.employeeSelected.forEach(employee => { 
        this.setDataToEmployee(employee);       
        declarations.splice(childLastIndex + 1, 0, this.declarationService.getLeafRow(employee, this.tableHeaderColumns));
      });
    }
    
    this.updateOrders(declarations);
    this.declarations = declarations;
    this.employeeSubject.next({
      type: 'clean'
    });

    this.employeeSelected.length = 0;
    this.notificeEventValidData('registerInsuranceRequired');
    this.notificeEventValidData('families');
    this.setDataToFamilyEditor(declarations);
    eventEmitter.emit('unsaved-changed');
  }

  private setDataToEmployee(employee) {
    employee.gender = employee.gender === '1';
    employee.workAddress = this.currentCredentials.companyInfo.address;
    employee.note = this.formatNote(employee.isurranceNo);
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
    this.notificeEventValidData('registerInsuranceRequired');
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
     
    this.notificeEventValidData('registerInsuranceRequired');
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
      this.rollback(type);
    }else if(type === 'saveAndView') {
      this.saveAndView(type);
    }else {
      this.save(type);
    }
   
  }

  rollback(type) {
    this.onSubmit.emit({
      type
    });
  }
  save(type) {
    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }
    this.dataIsValid = this.invalidData();
    this.tableSubject.next({type});
  }
  saveAndView(type) {
    this.tableSubmitErrors = {};
    this.tableSubmitErrorCount = 0;
    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }
    
    this.dataIsValid = this.invalidData();
    if (this.dataIsValid) {

      this.tableSubmitErrors = Object.keys(this.tableErrors).reduce(
        (combine, key) => {
          const data = this.tableErrors[key];

          return {...combine, [key]: data.length};
        },
        {}
      );

      return this.modalService.error({
        nzTitle: 'Lỗi dữ liệu. Vui lòng sửa!',
        nzContent: TableEditorErrorsComponent,
        nzComponentParams: {
          errors: Object.keys(this.tableErrors).reduce(
            (combine, key) => {
              if (this.tableErrors[key].length) {
                return { ...combine, [key]: this.tableErrors[key] };
              }

              return { ...combine };
            },
            {}
          )
        }
      });
    }

    if (!this.isCheckIsuranceCode) {
      this.modalService.warning({
        nzTitle: 'Đơn vị chưa kiểm tra Mã số BHXH và trạng thái của người tham gia'
      });
      return;
    }

    this.tableSubject.next({type});
  }

  invalidData() { 
    const errorDocumentForm = this.validDocumentForm();
    if (errorDocumentForm.length > 0) {
      this.tableErrors['documentFomError'] = errorDocumentForm;
    } else {
      this.tableErrors['documentFomError'] = [];
    }

    const generalFomError = this.validFormDeclaration();
    if (generalFomError.length > 0) {
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

    this.tableSubmitErrorCount = count;
    return count > 0;
  }

  validFormDeclaration() {
    const formError: any[] = [];
    if(this.form.controls.batch.errors) {
      formError.push({
        y: 'Số ',
        columnName: 'Kiểm tra lại trường số tờ khai',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.month.errors) {
      formError.push({
        y: 'Tháng',
        columnName: 'Kiểm tra lại trường tháng tờ khai',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    if(this.form.controls.year.errors) {
      formError.push({
        y: 'Năm',
        columnName: 'Kiểm tra lại trường năm tờ khai',
        prefix: '',
        subfix: 'Lỗi'
      });
    }

    return formError;
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

  handleSubmit(event) {
    const { number, month, year } = this.form.value;

    eventEmitter.emit('unsaved-changed', true);

    this.onSubmit.emit({
      type: event.type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(event.type),
      batch: number,
      month,
      year,
      submitter: this.submitter,
      mobile: this.mobile,
      createDate: this.getDateOfDeclaration(month, year),
      totalNumberInsurance: this.totalNumberInsurance,
      totalCardInsurance: this.totalCardInsurance,
      documentDetail: event.data,
      informations: this.reformatInformations(),
      families: this.reformatFamilies(),
      files: this.files
    });
  }

  getDateOfDeclaration(month, year) {
  
    let monthOfDate = month;
    if(month.length < 2) {
      monthOfDate =  `0${ month }`;
    }

    return `01/${ monthOfDate }/${ year }`
  }

  private getStatus(type) {
    if (this.dataIsValid) {
      return 0;
    }

    if (this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }

  get submitter() {
    return this.documentForm.get('submitter').value;
  }

  get mobile() {
    return this.documentForm.get('mobile').value;
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
      this.isCheckIsuranceCode = false;
      c = Number(c);
      const column = this.tableHeaderColumns[c];

      if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstCode = cell.innerText.split(' - ').shift();
        if(hospitalFirstCode !== '' && hospitalFirstCode !== undefined) {
         
          this.hospitalService.getById(hospitalFirstCode).subscribe(data => {
            const name = `${ data.id } - ${ data.name }`;
            this.updateNextColumns(instance, r, name, [ c + 1 ]);
          });
        }
       
      } else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'recipientsCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 4, c + 5 ]);
      } else if (column.key === 'isurranceNo') {
        const isurranceNo = records[r][c];
        const indexOfNote = this.tableHeaderColumns.findIndex(c => c.key === 'reason');
        const noteMessage = this.formatNote(isurranceNo);
        this.updateNextColumns(instance, r, noteMessage , [ indexOfNote ]);
      } else if (column.key === 'fullName') {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const indexOfisurranceNo = this.tableHeaderColumns.findIndex(c => c.key === 'isurranceNo');
          const isurranceNo = records[r][indexOfisurranceNo];
          const indexOfNote = this.tableHeaderColumns.findIndex(c => c.key === 'reason');
          const noteMessage = this.formatNote(isurranceNo);
          this.updateFakeEmployeeId(instance, cell, c, r, records);
          this.updateNextColumns(instance, r, noteMessage , [ indexOfNote ]);
        }, 10);
      }

    }
    // update declarations
    this.declarations.forEach((declaration: any, index) => {
      const record = records[index];
      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
       declaration.data.options.fullName = record[1];
       declaration.fullName = record[1];
       if(!declaration.origin.employeeId) {
        const numberItem = this.tableHeaderColumns.length - 1;
        declaration.origin.employeeId = record[numberItem];
       }
    });
     
    const rowChange: any = this.declarations[r];
    rowChange.data.options.isInitialize = false;
    rowChange.isInitialize = false;
    this.changeDataFamiliesByDeclaration(rowChange);
    this.notificeEventValidData('registerInsuranceRequired');   
    eventEmitter.emit('unsaved-changed');
  }

  private updateFakeEmployeeId(instance, cell, c, r, records ) {
    const indexEmployeeId = this.tableHeaderColumns.findIndex(c => c.key === 'employeeId');
    const employeeId = records[r][indexEmployeeId];    
    if(employeeId !== '' && employeeId !== undefined) {
      return;
    }

    let employeeIdFake = ((Number(r) + 1) * -1);   
    const employee = this.declarations.find(d => d.origin.employeeId === employeeIdFake);
    if(employee) {
      employeeIdFake = (Math.floor((Math.random() * 1000) + 1) * -1); 
    }
    
    this.updateNextColumns(instance, r, employeeIdFake , [ indexEmployeeId ]);
  }

  handleAddRow({ rowNumber, options, origin, insertBefore }) {
    const declarations = [ ...this.declarations ];
    let row: any = {};

    const beforeRow: any = declarations[insertBefore ? rowNumber - 1 : rowNumber];
    const afterRow: any = declarations[insertBefore ? rowNumber : rowNumber + 1];

    const data: any = [];

    row.data = data;
    row.isInitialize = false;
    row.isLeaf = true;
    row.origin = origin;
    row.options = options;

    declarations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.notificeEventValidData('registerInsuranceRequired');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {
    const declarations = [ ...this.declarations ];
    let declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    this.updateOrders(declarations);
    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.deleteEmployeeInFamilies(this.declarations, declarationsDeleted);
    this.notificeEventValidData('registerInsuranceRequired');
    this.notificeEventValidData('families');
    eventEmitter.emit('unsaved-changed');
  }
 
  handleFocus() {
    if (!this.employeeSelected.length) return;

    this.isBlinking = true;

    setTimeout(() => this.isBlinking = false, 5000);
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
    const INSURRANCE_CODE_INDEX = 3;
    const INSURRANCE_STATUS_INDEX = 4;
    const errors = {};
    this.isCheckIsuranceCode = true;
    const leafs = declarations.filter(d => d.isLeaf && d.data[INSURRANCE_CODE_INDEX]);
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
    declarations.forEach((declaration, index) => {
      declaration.data[0] = index + 1;
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

  private getHospitalsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 5, r);

    if (!value) {
      return [];
    }

    return this.hospitalService.getHospitals(value).toPromise();
  }

  private getRelationShips(instance, cell, c, r, source) {
    const row = instance.jexcel.getRowFromCoords(r);
    if (row.origin && row.origin.isMaster) {
      return source;
    }

    return source.filter(s => s.id !== '00');;
  }

  private updateNextColumns(instance, r, value, nextColumns = []) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);
      instance.jexcel.setValue(columnName, value);
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
    row.isExitsIsurranceNo = true;
    row.origin = {
      isLeaf: true,
      isExitsIsurranceNo: true,
    };

    informations.splice(insertBefore ? rowNumber : rowNumber + 1, 0, row);
    this.informations  = informations;
    this.notificeEventValidData('documentList');
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
    let infomationscopy = [ ...infomations ];
    infomationscopy.forEach(p => {
      p.data = this.tableHeaderColumnsDocuments.map(column => {
        if (!column.key || !p[column.key]) return '';
        return p[column.key];
      });
      p.origin = {
        employeeId: p.employeeId,
        isExitsIsurranceNo: p.isExitsIsurranceNo,
        isLeaf: true,
      }
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
          isExitsIsurranceNo: true,
          isLeaf: true,
        }
      });
    }

    return infomationscopy;
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

  handleSelectTab(index) {
    eventEmitter.emit('adjust-general:tab:change', index);
  }

  private loadDataDefault() {
    const dataFake = [];
    for (let index = 0; index < 10; index++) {
      dataFake.push({
        data: [index + 1],
        origin: {},
        hasLeaf: true,
        category: this.declarationCode,
        categoryName: this.declarationName,
        isLeaf:true,
        fullName: '',
      });
    }
    return dataFake;
  }

  private formatNote(insurranceCode) {

    const message = 'Cấp lại thẻ BHYT do hỏng, mất.';
    if(insurranceCode === '' || insurranceCode === undefined) {
      return message;
    }

    return message + ' Số sổ BHXH là '+ insurranceCode +' khác Mã Số BHXH';

  }

  private loadDefaultInformations() {
    const dataFake = [];
    for (let index = 0; index < 10; index++) {
      dataFake.push({
        data: [index + 1],
        origin: {
          employeeId: '',
          isExitsIsurranceNo: true,
          isLeaf: true,
        }
      });
    }
    return dataFake;
  }

  private notificeEventValidData(tableName) {

    this.tableSubject.next({
      tableName: tableName,
      type: 'validate',
      tableEvent: this.eventValidData
    });

  }

  // Family tab

  deleteEmployeeInFamilies(declarations, declarationsDeleted) {
    const employees = this.getEmployeeInDeclarations(declarations);
    const employeeIdDeleted = [];
    declarationsDeleted.forEach(itemDeleted => {
      const item = employees.find(d => (d.origin && d.origin.employeeId) === (itemDeleted.origin && itemDeleted.origin.employeeId));
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

  private getRecipientsVillageCodeByWarssCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.villageService.getVillage(value).toPromise().then(village => {
      this.updateSourceToColumn(this.tableHeaderColumnsFamilies, 'relationshipVillageCode', village);

      return village;
    });
  }

  handleChangeDataFamilies({ instance, cell, c, r, records, columns }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumnsFamilies[c];
      if (column.key === 'isMaster') {
        const employeeIsMaster = instance.jexcel.getValueFromCoords(c, r);
  
        if (employeeIsMaster === true && records[r].origin.employeeId > 0) {
          
          this.employeeService.getEmployeeById(records[r].origin.employeeId).subscribe(emp => {
            this.updateNextColumns(instance, r, emp.fullName, [ c + 1]);
            this.updateNextColumns(instance, r, emp.familyNo, [ c + 2]);
            this.updateNextColumns(instance, r, emp.mobile, [ c + 3]);
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
            this.updateNextColumns(instance, r, '00', [24]);
            this.updateNextColumns(instance, r, emp.identityCar, [c + 23]);
            this.updateSelectedValueDropDown(columns, instance, r);
            });

        }else if(employeeIsMaster === true && records[r].origin.employeeId < 0) {
          
            const employeesInDeclaration = this.getEmployeeInDeclarations(this.declarations);
            const firstEmployee = employeesInDeclaration.find(f => f.employeeId === records[r].origin.employeeId);
            this.updateNextColumns(instance, r, firstEmployee.fullName, [ c + 1]);
            this.updateNextColumns(instance, r, firstEmployee.familyNo, [ c + 2]);
            this.updateNextColumns(instance, r, firstEmployee.mobile, [ c + 3]);
            this.updateNextColumns(instance, r, firstEmployee.recipientsCityCode, [ c + 6]);
            this.updateNextColumns(instance, r, firstEmployee.recipientsDistrictCode, [ c + 7]);
            this.updateNextColumns(instance, r, firstEmployee.recipientsWardsCode, [ c + 8]);
            this.updateNextColumns(instance, r, firstEmployee.fullName, [ c + 11]);
            this.updateNextColumns(instance, r, firstEmployee.isurranceCode, [ c + 12]);
            this.updateNextColumns(instance, r, firstEmployee.typeBirthday, [ c + 13]);
            this.updateNextColumns(instance, r, firstEmployee.birthday, [ c + 14]);
            this.updateNextColumns(instance, r, firstEmployee.gender, [ c + 15]);
            this.updateNextColumns(instance, r, firstEmployee.nationalityCode, [ c + 16]);
            this.updateNextColumns(instance, r, firstEmployee.peopleCode, [ c + 17]);
            this.updateNextColumns(instance, r, firstEmployee.identityCar, [c + 23]);
            this.updateSelectedValueDropDown(columns, instance, r);
            const nextRow = Number(r) + 1;
            const fullNameNextRow = records[nextRow][c + 11];
            if(fullNameNextRow === firstEmployee.fullName) {
              this.updateNextColumns(instance, (Number(r) + 1), '', [ c + 11]);
            }
            
         
        }else if(employeeIsMaster === false && records[r].origin.employeeId > 0) {
          
          this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
            c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17,c + 18,c + 19,c + 20, c + 21, c + 22, c + 23]);
  
          const value = instance.jexcel.getValueFromCoords(1, r);
          const numberColumn = this.tableHeaderColumnsFamilies.length;
          this.updateNextColumns(instance, r,value, [(numberColumn -1)]);

        }else {
          const employeesInDeclaration = this.getEmployeeInDeclarations(this.declarations);
          const firstEmployee = employeesInDeclaration.find(f => f.employeeId === records[r].origin.employeeId);
          this.updateNextColumns(instance, r, '', [ c + 1 , c + 2, c + 3, c + 4, c + 5, c + 6, c + 7, c + 8,
            c + 11, c + 11,c + 12,c + 13,c + 14,c + 15,c + 16,c + 17,c + 18,c + 19,c + 20, c + 21, c + 22, c + 23]);

          const value = instance.jexcel.getValueFromCoords(1, r);
          const numberColumn = this.tableHeaderColumnsFamilies.length;
          this.updateNextColumns(instance, r,value, [(numberColumn -1)]);

          const nextRow = Number(r) + 1;
          const fullNameNextRow = records[nextRow][c + 11];
          if(fullNameNextRow === '' || fullNameNextRow === undefined) {
            this.updateNextColumns(instance, nextRow, firstEmployee.fullName, [ c + 11]);
            this.updateNextColumns(instance, nextRow, firstEmployee.isurranceCode, [ c + 12]);
            this.updateNextColumns(instance, nextRow, firstEmployee.typeBirthday, [ c + 13]);
            this.updateNextColumns(instance, nextRow, firstEmployee.birthday, [ c + 14]);
            this.updateNextColumns(instance, nextRow, firstEmployee.gender, [ c + 15]);
            this.updateNextColumns(instance, nextRow, firstEmployee.nationalityCode, [ c + 16]);
            this.updateNextColumns(instance, nextRow, firstEmployee.peopleCode, [ c + 17]);
          }
        }
  
      }
  
      if (column.key === 'sameAddress') {
        const isSameAddress = instance.jexcel.getValueFromCoords(c, r);
  
        if(isSameAddress === true)
        {
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(8, r), [ c + 1]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(9, r), [ c + 2]);
          this.updateNextColumns(instance, r, instance.jexcel.getValueFromCoords(10, r), [ c + 3]);
          this.updateSelectedValueDropDown(columns, instance, r);
  
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
  
    this.notificeEventValidData('families');
  
  }

  private updateSelectedValueDropDown(columns, instance, r) {

    columns.forEach((column, colIndex) => {
      if (column.defaultLoad) {
        instance.jexcel.updateDropdownValue(colIndex, r);
      }
    });
  }

  handleDeleteMember({ rowNumber, numOfRows, records }) {
    const families = [ ...this.families ];
  
    const familyDeleted = families.splice(rowNumber, numOfRows);
    this.families = families;
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
    this.notificeEventValidData('families');
  }

  private setDataToFamilyEditor(records: any)
  {
    const currentFamilis = [...this.families]
    const families = [];
    const employees = [];
    const employeeManual = [];
    const employeesInDeclaration = this.getEmployeeInDeclarations(records);
    employeesInDeclaration.forEach(emp => {

      const firstEmployee = currentFamilis.find(f => f.employeeId === emp.employeeId);
      if(!firstEmployee) {
       
        if(emp.employeeId > 0) {
          employees.push(emp);
        }else {
          employeeManual.push(emp);
        }
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

    forkJoin(
      employees.map(emp => {
        return this.employeeService.getEmployeeById(emp.employeeId)
      })
    ).subscribe(emps => {
      const familiesNotExists = [];
      emps.forEach(ep => {
        const master = this.getMaster(ep.families);
        master.isMaster = ep.isMaster;
        master.employeeName = ep.fullName;
        master.employeeId = ep.employeeId;
        master.nationalityCode = ep.nationalityCode;
        master.peopleCode = ep.peopleCode,
        master.relationFamilyNo = ep.familyNo,
        master.relationAddress = ep.relationAddress,
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
      
      employeeManual.forEach(d => {
        const empMaster =  this.getMaster([]);
        empMaster.isMaster = false;
        empMaster.employeeName = d.fullName;
        empMaster.employeeId = d.employeeId;
        empMaster.relationshipCode = '00';
        empMaster.conditionValid = d.employeeId;
        empMaster.origin = {
          employeeId: d.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        families.push(empMaster);
        families.push(this.fakeEmployeeInFamilies(d, true));
        families.push(this.fakeEmployeeInFamilies(d));
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

  
  fakeEmployeeInFamilies(employee, isSetValue = false) {

    const familyFake = {
      isMaster:false,
      conditionValid: null,
      fullName: null,
      employeeId: employee.employeeId,
      origin: {
        employeeId: employee.employeeId,
        isLeaf: true,
        isMaster: false,
      }
    }
    if(isSetValue) {
      familyFake.conditionValid = employee.employeeId,
      familyFake.fullName = employee.fullName;
    }

    return familyFake;
  }

  // Thực hiện update thông tin nhân viên mới hoặc nhân viên đã có trong dữ liệu
  changeDataFamiliesByDeclaration(recordChange) {
    let declaration: any = {};
    const families = [];
    this.tableHeaderColumns.map((column, index) => {
      declaration[column.key] = recordChange.data[index];
    });

    if(declaration.employeeId === '' || declaration.employeeId === undefined) {
       return;
    }
    const currentFamilis = [...this.families]
    const firstEmployee = currentFamilis.find(f => f.employeeId === declaration.employeeId);
    
    if (!firstEmployee) {
      const empMaster =  this.getMaster([]);
        empMaster.isMaster = false;
        empMaster.employeeName = declaration.fullName;
        empMaster.employeeId = declaration.employeeId;
        empMaster.relationshipCode = '00';
        empMaster.conditionValid = declaration.employeeId;
        empMaster.origin = {
          employeeId: declaration.employeeId,
          isLeaf: true,
          isMaster: true,
        };
        families.push(empMaster);
        families.push(this.fakeEmployeeInFamilies(declaration, true));
        families.push(this.fakeEmployeeInFamilies(declaration));

        families.forEach(p => {
          p.data = this.tableHeaderColumnsFamilies.map(column => {
            if (!column.key || !p[column.key]) return '';
            return p[column.key];
          });
          p.data.origin = p.origin;
          currentFamilis.push(p);
        });
    }else {
      const familisUpdate = currentFamilis.filter(d => {
        return d.origin && (d.origin.employeeId || d.origin.id) === firstEmployee.employeeId && d.origin.isMaster;
      });

      familisUpdate.forEach(f => {

        f.origin = {
          ...f.origin,
          ...f.fullName,
        };

        this.tableHeaderColumnsFamilies.forEach((column, index) => {
         
          if (declaration[column.keyMapping] !== null && typeof declaration[column.keyMapping] !== 'undefined') {
            f.data[index] = declaration[column.keyMapping];
          }

        });

      });

    }

    this.families = currentFamilis.filter(f => f.origin);
    this.notificeEventValidData('families');
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

  reformatFamilies() {
    const families = [];
    let familiescopy = [ ...this.families ];
    familiescopy.forEach(family => {
      const employeeName = family.fullName ? family.fullName : family.relationshipFullName;
        if(employeeName) {
          family.isMaster = family.origin.isMaster
          family.id = family.id ? family.id : 0;
          family.gender = family.gender ? 1: 0;

          families.push(family);
        }
    });
    return families;
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

  // End Family tab

}
