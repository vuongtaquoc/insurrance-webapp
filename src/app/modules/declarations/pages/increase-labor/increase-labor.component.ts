import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject, forkJoin } from 'rxjs';
import findLastIndex from 'lodash/findLastIndex';
import findIndex from 'lodash/findIndex';

import { Declaration } from '@app/core/models';
import {
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService
} from '@app/core/services';

import { TABLE_NESTED_HEADERS, TABLE_HEADER_COLUMNS } from '@app/modules/declarations/data/increase-labor';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: ['./increase-labor.component.less']
})
export class IncreaseLaborComponent implements OnInit {
  form: FormGroup;
  declarations: Declaration[] = [];
  tableNestedHeaders: any[] = TABLE_NESTED_HEADERS;
  tableHeaderColumns: any[] = TABLE_HEADER_COLUMNS;
  employeeSelected: any[] = [];
  eventsSubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private cityService: CityService,
    private districtService: DistrictService,
    private declarationService: DeclarationService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService
  ) {
    this.getDistrictsByCityId = this.getDistrictsByCityId.bind(this);
    this.getWardsByDistrictId = this.getWardsByDistrictId.bind(this);
    this.getHospitalsByCityId = this.getHospitalsByCityId.bind(this);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      number: ['1'],
      month: ['03'],
      year: ['2020']
    });

    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
    ]).subscribe(([ cities, nationalities, peoples ]) => {
      this.updateSourceToColumn('peopleId', peoples);
      this.updateSourceToColumn('nationalityId', nationalities);
      this.updateSourceToColumn('registerCityId', cities);
      this.updateSourceToColumn('recipientsCityId', cities);

      // get filter columns
      this.updateFilterToColumn('registerDistrictId', this.getDistrictsByCityId);
      this.updateFilterToColumn('registerWardsId', this.getWardsByDistrictId);
      this.updateFilterToColumn('recipientsDistrictId', this.getDistrictsByCityId);
      this.updateFilterToColumn('recipientsWardsId', this.getWardsByDistrictId);
      this.updateFilterToColumn('hospitalFirstRegistId', this.getHospitalsByCityId);

      this.declarationService.getDeclarationInitials('600', this.tableHeaderColumns).subscribe(declarations => {
        this.declarations = declarations;
      });
    });
  }

  handleAddEmployee(type) {
    if (!this.employeeSelected.length) {
      return;
    }

    const declarations = [ ...this.declarations ];
    const parentIndex = findIndex(declarations, d => d.key === type);
    const childFirstIndex = findIndex(declarations, d => d.isLeaf && d.parentKey === type);
    const childLastIndex = findLastIndex(declarations, d => d.isLeaf && d.parentKey === type);

    if (childLastIndex > -1) {
      const employeeExists = declarations.filter(d => d.parentKey === type);

      this.employeeSelected.forEach(employee => {
        const accepted = employeeExists.findIndex(e => e.origin.id === employee.id) === -1;

        if (accepted) {
          if (declarations[childLastIndex].isInitialize) {
            // remove initialize data
            declarations.splice(childLastIndex, 1);

            // replace
            employee.orders = 1;

            declarations.splice(childLastIndex, 0, this.declarationService.getLeaf(declarations[parentIndex], employee, this.tableHeaderColumns));
          } else {
            console.log(childLastIndex, childFirstIndex)

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

      this.declarationService.create({
        documentType: 600,
        documentNo: number,
        documentName: 'Báo tăng lao động',
        createDate: `01/${ month }/${ year }`,
        documentStatus: 0,
        documentDetail: event.data
      }).subscribe(data => {
        console.log(data)
      });
    }
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

  private getDistrictsByCityId(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    return this.districtService.getDistrict(value).toPromise();
  }

  private getWardsByDistrictId(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    return this.wardService.getWards(value).toPromise();
  }

  private getHospitalsByCityId(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 5, r);

    return this.hospitalService.getHospitals(value).toPromise();
  }
}
