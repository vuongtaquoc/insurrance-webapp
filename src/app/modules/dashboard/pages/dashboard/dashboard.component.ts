import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
