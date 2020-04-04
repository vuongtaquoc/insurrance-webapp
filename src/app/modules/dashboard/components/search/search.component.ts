import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectItem } from '@app/core/interfaces';

@Component({
  selector: 'app-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class DashboardSearchComponent implements OnInit {
  searchForm: FormGroup;
  documentTypes: SelectItem[] = [];

  constructor(private formBuilder: FormBuilder) {}

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
}
