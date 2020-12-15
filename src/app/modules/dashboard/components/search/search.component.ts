import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeclarationConfigService } from '@app/core/services';
import { SelectItem } from '@app/core/interfaces';
import { validateLessThanEqualNowBirthday, validateDateSign, getBirthDay, validateIdentifyCard } from '@app/shared/utils/custom-validation';


@Component({
  selector: 'app-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class DashboardSearchComponent implements OnInit {
  @Output() onFormSearch: EventEmitter<any> = new EventEmitter();
  searchForm: FormGroup;
  declarationTypes: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private declarationConfigService: DeclarationConfigService,
  ) { }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      declarationCode: [''],
      dateFrom: [''],
      dateTo: ['']
    });

    this.loadDeclarationType();
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

  search() {
    this.onFormSearch.emit(
      {
       ...this.searchForm.value,
       fromDate: this.dateFrom,
       toDate: this.dateTo,
      }
    );
  }

  loadDeclarationType() {
    this.declarationConfigService.filter().subscribe(data => {
      this.declarationTypes = data;
    });
  }
}
