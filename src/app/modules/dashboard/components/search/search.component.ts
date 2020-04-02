import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { DocumentTypeService } from '@app/core/services';

@Component({
  selector: 'app-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class DashboardSearchComponent implements OnInit {
  searchForm: FormGroup;
  documentTypes: SelectItem[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private documentTypeService: DocumentTypeService,
  ) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      type: [''],
      dateFrom: [''],
      dateTo: ['']
    });
    this.getDocumentTypies();
    // this.documentTypes = [{
    //   label: 'Hồ sơ 1',
    //   value: 1
    // }];
  }

  getDocumentTypies() {
    console.log('OOO');
    this.documentTypeService.categories();
  }
}
