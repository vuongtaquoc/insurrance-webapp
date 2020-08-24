import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectItem } from '@app/core/interfaces';
import { validateLessThanEqualNowBirthday, validateDateSign, getBirthDay, validateIdentifyCard } from '@app/shared/utils/custom-validation';


@Component({
  selector: 'app-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class DashboardSearchComponent implements OnInit {
  searchForm: FormGroup;
  documentTypes: SelectItem[] = [];

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      type: [''],
      dateFrom: [''],
      dateTo: ['']
    });

    this.documentTypes = [{
      label: 'Hồ sơ 1',
      value: 1
    }];
  }
  get dateTo() {
    const dateTo = this.searchForm.get('dateTo').value;

    if (!dateTo) return '';

    const birth = getBirthDay(dateTo, false, false);

    return birth.format;
  }

  get dateFrom() {
    const dateFrom = this.searchForm.get('dateFrom').value;
    if (!dateFrom) return '';

    const birth = getBirthDay(dateFrom, false, false);

    return birth.format;
  }
}
