import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subject } from 'rxjs';
import { NzModalRef } from 'ng-zorro-antd/modal';

import { DropdownItem } from '@app/core/interfaces';
import { City } from '@app/core/models';

import {
  CityService,
  DistrictService,
  DeclarationService,
  HospitalService,
  NationalityService,
  PeopleService,
  WardsService,
  SalaryAreaService
} from '@app/core/services';

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
  processSubject: Subject<string> = new Subject<string>();
  familySubject: Subject<string> = new Subject<string>();

  constructor(
    private formBuilder: FormBuilder,
    private modal: NzModalRef,
    private cityService: CityService,
    private districtService: DistrictService,
    private declarationService: DeclarationService,
    private hospitalService: HospitalService,
    private nationalityService: NationalityService,
    private peopleService: PeopleService,
    private wardService: WardsService,
    private salaryAreaService: SalaryAreaService
  ) {}

  ngOnInit() {
    forkJoin([
      this.cityService.getCities(),
      this.nationalityService.getNationalities(),
      this.peopleService.getPeoples(),
      this.salaryAreaService.getSalaryAreas(),
    ]).subscribe(([ cities, nationalities, peoples, salaryAreas ]) => {
      this.nationalities = nationalities;
      this.peoples = peoples;
      this.salaryAreas = salaryAreas;
      this.cities = cities;
    });

    this.employeeForm = this.formBuilder.group({
      fullName: [''],
      birthday: [''],
      gender: [''],
      nationalityId: [''],
      peopleId: [''],
      employeeCode: [''],
      departmentId: ['']
    });
  }

  save(): void {
    this.modal.destroy({ data: 'xxx' });
  }

  dismiss(): void {
    this.modal.destroy();
  }

  changeTab({ index }) {
    if (index === 1) {
      this.processSubject.next('ready');
    } else if (index === 2) {
      this.familySubject.next('ready');
    }
  }
}
