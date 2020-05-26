import { Component, Input, Output, OnInit, OnDestroy, OnChanges, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import {
  CityService,
  DistrictService,
  WardsService,
  RelationshipService
} from '@app/core/services';

import { TABLE_HEADER_COLUMNS, TABLE_NESTED_HEADERS } from './family-table.data';
import { customPicker } from '@app/shared/utils/custom-editor';

@Component({
  selector: 'app-employee-family-table',
  templateUrl: './family-table.component.html',
  styleUrls: ['./family-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeeFamilyTableComponent implements OnInit, OnDestroy, OnChanges {
  @ViewChild('spreadsheet', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() columns: any[] = TABLE_HEADER_COLUMNS;
  @Input() nestedHeaders: any[] = TABLE_NESTED_HEADERS;
  @Input() events: Observable<void>;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  isInitialized = false;
  private eventsSubscription: Subscription;

  constructor(
    private cityService: CityService,
    private districtService: DistrictService,
    private wardsService: WardsService,
    private relationshipService: RelationshipService
  ) {
    this.getDistrictsByCityCode = this.getDistrictsByCityCode.bind(this);
    this.getWardsByDistrictCode = this.getWardsByDistrictCode.bind(this);
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));

    forkJoin([
      this.cityService.getCities(),
      this.relationshipService.getRelationships()
    ]).subscribe(([ cities, relationships ]) => {
      // add sources
      this.updateSourceToColumn('cityCode', cities);
      this.updateSourceToColumn('relationshipCode', relationships);

      // add filter
      this.updateFilterToColumn('districtCode', this.getDistrictsByCityCode);
      this.updateFilterToColumn('wardsCode', this.getWardsByDistrictCode);
    });
  }

  ngOnDestroy() {
    jexcel.destroy(this.spreadsheetEl.nativeElement, true);
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue && changes.data.currentValue.length) {
       this.updateTable();
    }
  }

  handleEvent(type) {
    if (type === 'ready' && !this.isInitialized) {
      this.isInitialized = true;

      this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
        data: [],
        nestedHeaders: this.nestedHeaders,
        columns: this.columns,
        allowInsertColumn: false,
        allowInsertRow: false,
        tableOverflow: true,
        tableWidth: '100%',
        tableHeight: '100%',
        columnSorting: false,
        freezeColumns: 2,
        defaultColAlign: 'left',
        onchange: (instance, cell, c, r, value) => {
          this.onChange.emit({
            instance, cell, c, r, value,
            records: this.spreadsheet.getJson(),
            columns: this.columns
          });

          const column = this.columns[c];

          if (column.key === 'typeBirthday') {
            const nextColumn = jexcel.getColumnNameFromId([Number(c) + 1, r]);

            instance.jexcel.setValue(nextColumn, '');
          }
        },
        ondeleterow: (el, rowNumber, numOfRows) => {
          this.onDelete.emit({
            rowNumber,
            numOfRows,
            records: this.spreadsheet.getJson(),
            columns: this.columns
          });
        }
      });

      this.spreadsheet.hideIndex();

      this.updateEditorToColumn('birthday', 'month', true);

      this.updateTable();
    }
  }

  private updateTable() {
    const data = [];
    console.log(this.data,'updateTable');
    this.data.forEach((d, index) => {
      const familyRow = [];

      this.columns.forEach(column => {
        familyRow.push(d[column.key]);
      });

      data.push(familyRow);
    });

    // init default data
    if (data.length < 15) {
      const length = 15 - data.length;

      for (let i = 1; i <= length; i++) {
        data.push([ ]);
      }

      data.forEach((d, i) => d[0] = i + 1);
    }

    this.data = data;
    console.log(data,'data');
    this.spreadsheet.setData(this.data);

    // update dropdown data
    data.forEach((row, rowIndex) => {
      this.columns.forEach((column, colIndex) => {
        if (column.defaultLoad) {
          this.spreadsheet.updateDropdownValue(colIndex, rowIndex);
        }
      });
    });
  }

  private updateSourceToColumn(key, sources) {
    const column = this.columns.find(c => c.key === key);

    if (column) {
      column.source = sources;
    }
  }

  private updateFilterToColumn(key, filterCb) {
    const column = this.columns.find(c => c.key === key);

    if (column) {
      column.filter = filterCb;
    }
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    if (isCustom) {
      column.editor = customPicker(this.spreadsheet, type, true);
    } else {
      column.editor = customPicker(this.spreadsheet, type);
    }
  }

  private getDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise().then((districts) => {
      this.updateSourceToColumn('districtCode', districts);

      return districts;
    });
  }

  private getWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardsService.getWards(value).toPromise().then((wards) => {
      this.updateSourceToColumn('wardsCode', wards);

      return wards;
    });
  }
}
