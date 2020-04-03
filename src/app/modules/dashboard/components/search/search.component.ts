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
  }

  getDocumentTypies() {
    this.documentTypeService.getCategories().subscribe(datas => {
      this.formatObjectDropdown(datas)
    });
  }

  formatObjectDropdown(datas: any) {
    datas.forEach((item) => {
      this.documentTypes.push({
        label: item.groupName,
        value: item.groupCode
      });
    });
  }
}
