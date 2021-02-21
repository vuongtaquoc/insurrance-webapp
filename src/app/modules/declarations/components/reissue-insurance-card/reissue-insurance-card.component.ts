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

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/reissue-insurance.data';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';
import { TableEditorErrorsComponent } from '@app/shared/components';

const MAX_UPLOAD_SIZE = 20 * 1024 * 1024; // ~ 20MB

@Component({
  selector: 'app-declaration-reissue-insurance-card',
  templateUrl: './reissue-insurance-card.component.html',
  styleUrls: [ './reissue-insurance-card.component.less' ]
})
export class ReissueInsuranceCardComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Input() isSpinning: boolean;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  currentCredentials: any;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  tableSubject: Subject<any> = new Subject<any>();
  validateSubject: Subject<any> = new Subject<any>();
  eventsSubject: Subject<any> = new Subject<any>();
  documentList: DocumentList[] = [];
  informations: any[] = [];
  declaration: any;
  isHiddenSidebar = false;
  declarationCode: string = '607';
  declarationName: string = '';
  allowAttachFile: boolean;
  autoCreateDocumentList: boolean;
  autoCreateFamilies: boolean;
  employeeSubject: Subject<any> = new Subject<any>();
  handlers: any[] = [];
  handler;
  isTableValid = false;
  eventValidData = 'adjust-general:validate';
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
  timer: any;
  tableSubmitErrors = {};
  tableSubmitErrorCount = 0;
  status = 0;
  dataIsValid = true;
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
    private externalService: ExternalService,
    private declarationConfigService: DeclarationConfigService,
  ) {
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
  }

  ngOnInit() {
    const date = new Date();
    this.loadDeclarationConfig();
    this.currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      batch: [{value:'1', disabled: true },[Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)] ],
      month: [ date.getMonth() + 1 , [Validators.required,Validators.min(1), Validators.max(12), Validators.pattern(REGEX.ONLY_NUMBER)]],
      year: [ date.getFullYear(), [Validators.required,Validators.min(1990), Validators.maxLength(4), Validators.pattern(REGEX.ONLY_NUMBER)] ]
    });
    
    this.documentForm = this.formBuilder.group({
      submitter: ['', Validators.required],
      mobile: ['',  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
      usedocumentDT01: ['1']
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
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas]) => {
      this.updateSourceToColumn(this.tableHeaderColumns, 'peopleCode', peoples);
      this.updateSourceToColumn(this.tableHeaderColumns, 'nationalityCode', nationalities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'registerCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'recipientsCityCode', cities);
      this.updateSourceToColumn(this.tableHeaderColumns, 'salaryAreaCode', salaryAreas);

      // get filter columns
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn(this.tableHeaderColumns, 'recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      if (this.declarationId) {
        this.declarationService.getDeclarationsNormalByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations.declarationDetail);
          this.declarations = declarations.declarationDetail;
          this.informations = this.fomatInfomation(declarations.informations);
          this.files = declarations.files;   
          this.status = declarations.status;
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile,
            usedocumentDT01: declarations.usedocumentDT01,
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
      this.handler = eventEmitter.on(this.eventValidData, ({ name,use, isValid, errors }) => {
        this.tableErrors[name] = errors;
        this.isTableValid = true;
      });

      this.handler = this.fileUploadEmitter.on('file:uploaded', (file) => {
        this.tableSubject.next({
          type: this.submitType
        });
        eventEmitter.emit('saveData:loading', false);
      });
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
    this.notificeEventValidData('healthInsuranceCard');     
    eventEmitter.emit('unsaved-changed');
  }

  private setDataToEmployee(employee) {
    if(typeof(employee.gender) !== 'boolean') {
      employee.gender = employee.gender === '1';
    }

    if (employee.addressWorking !== '') {
      employee.workAddress = employee.addressWorking;
    } else {
      employee.workAddress = this.currentCredentials.companyInfo.address;
    }
    //employee.note = this.formatNote(employee.isurranceNo);
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
    this.notificeEventValidData('healthInsuranceCard');
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
     
    this.notificeEventValidData('healthInsuranceCard');
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
    this.isSpinning = true;
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
      files: this.files
    });
    this.isSpinning = false;
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
      } else if (column.key === 'fullName') {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          const indexOfisurranceNo = this.tableHeaderColumns.findIndex(c => c.key === 'isurranceNo');
          const isurranceNo = records[r][indexOfisurranceNo];
          this.updateFakeEmployeeId(instance, cell, c, r, records);
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
    this.notificeEventValidData('healthInsuranceCard');   
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
    this.notificeEventValidData('healthInsuranceCard');
    eventEmitter.emit('unsaved-changed');
  }

  handleDeleteData({ rowNumber, numOfRows, records }) {
    const declarations = [ ...this.declarations ];
    let declarationsDeleted = declarations.splice(rowNumber, numOfRows);
    this.updateOrders(declarations);
    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    this.notificeEventValidData('healthInsuranceCard');
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
    const INSURRANCE_CODE_INDEX = 2;
    const INSURRANCE_STATUS_INDEX = 3;
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

    //update informations
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

}
