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
import { PLANCODECOUNTBHXH, PLANCODECOUNTBHYT } from '@app/shared/constant-valid';
import { DocumentFormComponent } from '@app/shared/components';

import { Declaration, DocumentList } from '@app/core/models';
import {
  CityService,
  DistrictService,
  DeclarationService,
  WardsService,
  DocumentListService,
  AuthenticationService,
  EmployeeService,
  CategoryService,
  RelationshipService,
  VillageService,
} from '@app/core/services';
import { DATE_FORMAT, DECLARATIONS, DOCUMENTBYPLANCODE, ACTION } from '@app/shared/constant';
import { eventEmitter } from '@app/shared/utils/event-emitter';

import { TableEditorErrorsComponent } from '@app/shared/components';
import { TABLE_DOCUMENT_NESTED_HEADERS, TABLE_DOCUMENT_HEADER_COLUMNS } from '@app/modules/declarations/data/document-list-editor.data';

import { Router } from '@angular/router';

const TAB_NAMES = {
  1: 'adjustment',
  2: 'reduction',
  3: 'increase'
};

@Component({
  selector: 'app-declaration-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: [ './adjust.component.less' ]
})
export class AdjustComponent implements OnInit, OnDestroy {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onAddEmployee: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  files: any;
  currentCredentials: any;
  documentForm: FormGroup;
  documentList: DocumentList[] = [];
  isHiddenSidebar = false;
  declarationCode: string = '600b';
  declarationName: string;
  selectedTabIndex: number = 1;
  eventValidData = 'adjust-general:validate';
  handler: any;
  isTableValid = false;
  status = 0;
  tableErrors = {};
  formError: any[] = [];
  panel: any = {
    general: { active: false },
    attachment: { active: false }
  };
  declarationGeneral: any;
  allInitialize: any = {};
  declarations: any = {
    origin: {},
    form: {},
    formOrigin: {},
    formGenelral: {},
    tables: {}
  };

  informations: any[] = [];
  tableNestedHeadersDocuments: any[] = TABLE_DOCUMENT_NESTED_HEADERS;
  tableHeaderColumnsDocuments: any[] = TABLE_DOCUMENT_HEADER_COLUMNS;
  tableSubject: Subject<any> = new Subject<any>();
  tabSubject: Subject<any> = new Subject<any>();
  handlers: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private declarationService: DeclarationService,
    private authenticationService: AuthenticationService,
    private documentListService: DocumentListService,
    private modalService: NzModalService,
    private employeeService: EmployeeService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private relationshipService: RelationshipService,
    private districtService:  DistrictService,
    private wardService: WardsService,
    private villageService: VillageService
  ) {
  }

  ngOnInit() {
    this.documentForm = this.formBuilder.group({
      submitter: ['', Validators.required],
      mobile: ['',  [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)]],
    });

    this.declarationName = this.getDeclaration(this.declarationCode).value;
    //Init data families table editor
    forkJoin([
      this.cityService.getCities(),
    ]).subscribe(([cities]) => {

    //End Init data families table editor
      this.currentCredentials = this.authenticationService.currentCredentials;

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentIdByGroup(this.declarationId).subscribe(declarations => {
          this.documentForm.patchValue({
            submitter: declarations.submitter,
            mobile: declarations.mobile
          });

          this.declarations.origin = declarations.documentDetail;
          this.declarations.files = declarations.files;
          this.informations = this.fomatInfomation(declarations.informations);
          this.status = declarations.status;
          this.declarations.formOrigin = {
            batch: declarations.batch,
            openAddress: declarations.openAddress,
            branch: declarations.branch,
            typeDocumentActtach: declarations.typeDocumentActtach,
            reason: declarations.reason
          };

          this.declarationGeneral = {
            totalNumberInsurance: declarations.totalNumberInsurance,
            totalCardInsurance: declarations.totalCardInsurance
          };

        });
      } else {
        this.declarationService.getDeclarationInitialsByGroup(this.declarationCode).subscribe(data => {
          this.declarations.origin = data;
        });

        this.documentForm.patchValue({
          submitter: this.currentCredentials.companyInfo.delegate,
          mobile: this.currentCredentials.companyInfo.mobile
        });

        this.declarationGeneral = {
          totalNumberInsurance: 0,
          totalCardInsurance: 0
        };
      }

      this.documentListService.getDocumentList(this.declarationCode).subscribe(documentList => {
        this.documentList = documentList;
      });

      this.handler = eventEmitter.on(this.eventValidData, ({ name, isValid, leaf, initialize, errors }) => {
        this.allInitialize[name] = leaf.length === initialize.length;
        this.isTableValid = Object.values(this.allInitialize).indexOf(false) === -1 ? false : true;
        this.tableErrors[name + this.declarationCode] = errors;
      });

      this.tabSubject.next({
        type: 'change',
        selected: TAB_NAMES[1]
      });


      this.handlers.push(eventEmitter.on('tree-declaration:updateUser', (data) => {
        this.updateEmployeeInInfomation(data.employee);
      }));

    });
  }

  ngOnDestroy() {
    this.handler();
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

  handleChangeTable(data, tableName) {
    this.declarations.tables[tableName] = this.declarations[tableName] || {};
    this.declarations.tables[data.tableName]= data.data;

    if (data.action === ACTION.EDIT) {
      this.setDateToInformationList(this.declarations.tables);
    }

    if (data.action === ACTION.DELETE) {
      this.deleteEmployeeInInfomation(data.data, data.dataChange, data.columns);
    }

    this.notificeEventValidData('documentList');
     
  }

  handleFormValuesChanged(data) {
    this.declarations.form = data;
  }

  handleSelectTab({ index }) {
    this.selectedTabIndex = index;
    eventEmitter.emit('adjust-general:tab:change', index);
    this.tabSubject.next({
      type: 'change',
      selected: TAB_NAMES[index]
    });
  }

  handleHiddenSidebar(isHidden) {
    this.isHiddenSidebar = isHidden;
  }

  saveAndView() {
    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }

    eventEmitter.emit('tableEditor:validFrom', {
      tableName: 'documentList'
    });

    if(this.formError.length > 0) {
      this.tableErrors['generalFomError'] = this.formError;
    } else {
      this.tableErrors['generalFomError'] = [];
    }

    const errorDocumentForm = this.validDocumentForm();
    if (errorDocumentForm.length > 0) {
      this.tableErrors['documentFomError'] = errorDocumentForm;
    } else {
      this.tableErrors['documentFomError'] = [];
    }

    let count = Object.keys(this.tableErrors).reduce(
      (total, key) => {
        const data = this.tableErrors[key];
        return total + data.length;
      },
      0
    );

    if (count > 0) {
      return this.modalService.error({
        nzTitle: 'Lỗi dữ liệu. Vui lòng sửa!',
        nzContent: TableEditorErrorsComponent,
        nzComponentParams: {
          errors: this.getColumnErrror()
        }
      });
    }
    
    if (this.declarationId) {
      this.update('saveAndView');
    } else {
      this.create('saveAndView');
    }
  }

  rollback() {
    if(!this.isTableValid) {
      this.router.navigate(['/declarations/adjust']);
      return;
    }

    this.modalService.confirm({
      nzTitle: 'Bạn có muốn lưu lại thông tin thay đổi',
      nzOkText: 'Có',
      nzCancelText: 'Không',
      nzOnOk: () => {
        if (this.declarationId) {
          this.update('save');
        } else {
          this.create('save');
        }
      },
      nzOnCancel: () => {
        this.router.navigate(['/declarations/adjust']);
      }
    });
  }

  save() {

    if(!this.isTableValid) {
      this.modalService.warning({
        nzTitle: 'Bạn chưa kê khai'
      });
      return;
    }
     
    if (this.declarationId) {
      this.update('save');
    } else {
      this.create('save');
    }

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

  private create(type: any) {
    this.declarationService.create({
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.getDeclaration(this.declarationCode).value,
      documentStatus: 0,
      status: type === 'saveAndView' ? 1: 0,
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      ...this.declarations.formGenelral,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: this.reformatInformations(),
      flies: this.declarations.files,
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else{
        this.router.navigate(['/declarations/adjust']);
      }
    });
  }

  private update(type: any) {

    this.declarationService.update(this.declarationId, {
      type: type,
      declarationCode: this.declarationCode,
      declarationName: this.declarationName,
      documentStatus: 0,
      status: this.getStatus(type),
      submitter: this.submitter,
      mobile: this.mobile,
      ...this.declarations.form,
      ...this.declarations.formGenelral,
      documentDetail: this.tablesToApi(this.declarations.tables),
      informations: this.reformatInformations(),
      flies: this.declarations.files,
    }).subscribe(data => {
      if (type === 'saveAndView') {
        this.viewDocument(data);
      } else {
        this.router.navigate(['/declarations/adjust']);
      }
    });
  }

  private getStatus(type) {
    if(this.status > 0) {
      return this.status;
    }

    return (type === 'saveAndView' ) ? 1: 0;
  }

  viewDocument(declarationInfo: any) {
    const modal = this.modalService.create({
      nzWidth: 680,
      nzWrapClassName: 'document-modal',
      nzTitle: 'Thông tin biểu mẫu, tờ khai đã xuất',
      nzContent: DocumentFormComponent,
      nzOnOk: (data) => console.log('Click ok', data),
      nzComponentParams: {
        declarationInfo
      }
    });

    modal.afterClose.subscribe(result => {
    });
  }

  getDeclaration(declarationCode: string) {
    const declarations = _.find(DECLARATIONS, {
        key: declarationCode,
    });

    return declarations;
  }

  get submitter() {
    return this.documentForm.get('submitter').value;
  }

  get mobile() {
    return this.documentForm.get('mobile').value;
  }

  private tablesToApi(tables) {
    const data = [];
    Object.keys(tables).forEach(key => {
      const table = tables[key];
      data.push(...table);
    });

    return data;
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

// families tab

private getEmployeeInDeclarations(records: any) {
  const employeesInDeclaration = [];
  records.forEach(record => {
    const declarations = record.declarations;
    declarations.forEach(declaration => {
      if(declaration && declaration.employeeId) {

        declaration.origin = {
          employeeId: declaration.employeeId,
          isLeaf:true,
          isMaster: false,
          declarationCode: record.code,
          category: record.category,
          planCode: declaration.planCode
        };

        declaration.conditionValid = declaration.relationshipFullName;
        employeesInDeclaration.push(declaration);
      }
    });

  });
  return employeesInDeclaration;
}

  handleValidForm(data) {
    this.formError = data.errorMessage;
  }

  deleteEmployeeInInfomation(declarations, declarationsDeleted, columns) {
    let informations = [...this.informations];

    declarationsDeleted.forEach(d => {
        const employeeInfo = this.getDeclarationInData(d.data, columns);
        informations = informations.filter(info => {
            return info.employeeId + info.planCode !== employeeInfo.employeeId + employeeInfo.planCode;
          });
    });

    if(informations.length === 0) {
      informations.push({
        data: {
          origin: {},
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


  private notificeEventValidData(tableName) {

    this.tableSubject.next({
      tableName: tableName,
      type: 'validate',
      tableEvent: this.eventValidData
    });

  }

  handleFormChange(data) {
    this.declarations.formGenelral = data;
  }

// End Families tab

// Document list tab
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


private setDateToInformationList(records: any)
{
  const declarations = this.tablesToApi(records);
  const employeesInDeclaration = this.getEmployeeInDeclarations(declarations);
  const informations = [];

  employeesInDeclaration.forEach(emp => {
    emp.companyRelease = this.currentCredentials.companyInfo.name;
    const fromDate = this.getFromDate(emp.fromDate);
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
  }

  handleChangedFiles(files) {
    this.declarations.files = files;
  }


  private getFromDate(dateMonthYear) {
    const fullDate = '01/' + dateMonthYear;
    if(!moment(fullDate,"DD/MM/YYYY")) {
      return new Date();
    }
    return moment(fullDate,"DD/MM/YYYY").toDate();
  }
// End Document list Tab

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

 private buildMessgaeByConfig(objConfig, employeeInfo) {
    const argsColumn = objConfig.column || [] ;
    const mesage = objConfig.mesage || '' ;
    const argsMessgae = [];
    argsColumn.forEach(column => {
      argsMessgae.push(employeeInfo[column]);
    });

    return this.formatNote(mesage, argsMessgae);;
  }

  protected formatNote(str, args) {
    for (let i = 0; i < args.length; i++)
       str = str.replace("{" + i + "}", args[i]);
    return str;
  }

  private getFileByDeclarationCode(code) {
     console.log(this.files);
  }

}
