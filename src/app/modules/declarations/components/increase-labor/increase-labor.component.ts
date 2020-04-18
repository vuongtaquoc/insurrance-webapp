import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';
import * as jexcel from 'jstable-editor/dist/jexcel.js';

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
  AuthenticationService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/increase-labor';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: [ './increase-labor.component.less' ]
})
export class IncreaseLaborComponent implements OnInit {
  @Input() declarationId: string;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  form: FormGroup;
  documentForm: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<string> = new Subject<string>();
  documentList: DocumentList[] = [];

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
    private documentListService: DocumentListService,
    private authenticationService: AuthenticationService,
  ) {
    this.getRecipientsDistrictsByCityCode = this.getRecipientsDistrictsByCityCode.bind(this);
    this.getRecipientsWardsByDistrictCode = this.getRecipientsWardsByDistrictCode.bind(this);
    this.getRegisterDistrictsByCityCode = this.getRegisterDistrictsByCityCode.bind(this);
    this.getRegisterWardsByDistrictCode = this.getRegisterWardsByDistrictCode.bind(this);
    this.getHospitalsByCityCode = this.getHospitalsByCityCode.bind(this);
  }

  ngOnInit() {
    const date = new Date();
    const currentCredentials = this.authenticationService.currentCredentials;
    this.form = this.formBuilder.group({
      number: [ '1' ],
      month: [ date.getMonth() + 1 ],
      year: [ date.getFullYear() ]
    });

    this.documentForm = this.formBuilder.group({
      userAction: [currentCredentials.companyInfo.delegate],
      mobile:[currentCredentials.companyInfo.mobile],
      usedocumentDT01:[true],
    });
    this.documentListService.getDocumentList('600').subscribe(documentList => {
      this.documentList = documentList;
    });

    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
      this.planService.getPlans()
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas, plans ]) => {
      this.updateSourceToColumn('peopleCode', peoples);
      this.updateSourceToColumn('nationalityCode', nationalities);
      this.updateSourceToColumn('registerCityCode', cities);
      this.updateSourceToColumn('recipientsCityCode', cities);
      this.updateSourceToColumn('salaryAreaCode', salaryAreas);
      this.updateSourceToColumn('planCode', plans);
      // get filter columns
      this.updateFilterToColumn('registerDistrictCode', this.getRegisterDistrictsByCityCode);
      this.updateFilterToColumn('registerWardsCode', this.getRegisterWardsByDistrictCode);
      this.updateFilterToColumn('recipientsDistrictCode', this.getRecipientsDistrictsByCityCode);
      this.updateFilterToColumn('recipientsWardsCode', this.getRecipientsWardsByDistrictCode);
      this.updateFilterToColumn('hospitalFirstRegistCode', this.getHospitalsByCityCode);

      if (this.declarationId) {
        this.declarationService.getDeclarationsByDocumentId(this.declarationId, this.tableHeaderColumns).subscribe(declarations => {
          this.updateOrders(declarations);

          this.declarations = declarations;
        });
      } else {
        this.declarationService.getDeclarationInitials('600', this.tableHeaderColumns).subscribe(declarations => {
          this.declarations = declarations;
        });
      }
    });
  }

  handleAddEmployee(type) {
    if (!this.employeeSelected.length) {
      return;
    }

    const declarations = [ ...this.declarations ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => e.origin.id === employee.id) === -1;

        // replace
        employee.gender = !employee.gender;

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

      // update orders
      this.updateOrders(declarations);

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    } else {
      this.employeeSelected.forEach(employee => {
        declarations.splice(parentIndex + 1, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
      });

      this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
    }
  }

  handleSelectEmployees(employees) {
    this.employeeSelected = employees;
  }

  emitEventToChild(type) {
    this.eventsSubject.next(type);
  }

  handleSubmit(event) {
    if (event.type === 'save') {
      const { number, month, year } = this.form.value;

      //Doan nay anh muôn lây dữ liệu của thằng bảng kê vào object trước khi submit;
      this.onSubmit.emit({
        documentType: 600,
        documentNo: number,
        documentName: 'Báo tăng lao động',
        createDate: `01/0${ month }/${ year }`,
        documentStatus: 0,
        documentDetail: event.data,
        //infomations: [] là list dữ liệu lấy bên table document list
      });
    }
  }

  handleChangeTable({ instance, cell, c, r, records }) {
    if (c !== null && c !== undefined) {
      c = Number(c);
      const column = this.tableHeaderColumns[c];

      if (column.key === 'hospitalFirstRegistCode') {
        const hospitalFirstRegistName = cell.innerText.split(' - ').pop();

        this.updateNextColumns(instance, r, hospitalFirstRegistName, [ c + 1 ]);
      } else if (column.key === 'registerCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2 ]);
      } else if (column.key === 'recipientsCityCode') {
        this.updateNextColumns(instance, r, '', [ c + 1, c + 2, c + 5, c + 6 ]);
      }
    }

    // update declarations
    this.declarations.forEach((declaration, index) => {
      const record = records[index];

      Object.keys(record).forEach(index => {
        declaration.data[index] = record[index];
      });
    });
  }

  handleDeleteData({ rowNumber, numOfRows }) {
    const declarations = [ ...this.declarations ];

    declarations.splice(rowNumber, numOfRows);

    this.updateOrders(declarations);

    this.declarations = this.declarationService.updateFormula(declarations, this.tableHeaderColumns);
  }

  private updateOrders(declarations) {
    const order: { index: 0, key: string } = { index: 0, key: '' };

    declarations.forEach((declaration, index) => {
      if (declaration.hasLeaf) {
        order.index = 0;
        order.key = declaration.key;
      }

      if (declaration.isLeaf && declaration.parentKey === order.key && !declaration.isInitialize) {
        order.index += 1;

        declaration.data[0] = order.index;
      }
    });
  }

  private updateSourceToColumn(key, sources) {
    const column = this.tableHeaderColumns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  private updateFilterToColumn(key, filterCb) {
    const column = this.tableHeaderColumns.find(c => c.key === key);

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
      this.updateSourceToColumn('registerDistrictCode', districts);

      return districts;
    });
  }



  private getRegisterWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn('registerWardsCode', wards);
      return wards;
    });
  }

  private getRecipientsDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then(districts => {
      this.updateSourceToColumn('recipientsDistrictCode', districts);

      return districts;
    });
  }

  private getRecipientsWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardService.getWards(value).toPromise().then(wards => {
      this.updateSourceToColumn('recipientsWardsCode', wards);

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

  private updateNextColumns(instance, r, value, nextColumns = []) {
    nextColumns.forEach(columnIndex => {
      const columnName = jexcel.getColumnNameFromId([columnIndex, r]);

      instance.jexcel.setValue(columnName, value);
    });
  }

  get usedocumentDT01() {
    return this.documentForm.get('usedocumentDT01').value;
  }

  // viewDocument(documentCode: string) {
  //   const documentsInfo =  {
  //     userAction: 'Lê văn đức',
  //     mobile: '097865',
  //     usedocumentDT01: 1,
  //     documentList: this.documentList
  //   };
  //   const modal = this.modalService.create({
  //     nzWidth: 980,
  //     nzWrapClassName: 'document-modal',
  //     nzTitle: 'Danh mục tài liệu',
  //     nzContent: DocumentFormComponent,
  //     nzOnOk: (data) => console.log('Click ok', data),
  //     nzComponentParams: {
  //       documentsInfo
  //     }
  //   });

  //   modal.afterClose.subscribe(result => {
  //   });
  // }
}
