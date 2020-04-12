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
    if (changes.data && changes.data.currentValue.length) {
      this.updateTable();
    }
  }

  handleEvent(type) {
    if (type === 'ready' && !this.isInitialized) {
      this.isInitialized = true;

      this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
        data: this.data,
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

      this.updateTable();
    }
  }

  private updateTable() {
    const data = [];

    this.data.forEach((d, index) => {
      const familyRow = [];

      this.columns.forEach(column => {
        familyRow.push(d[column.key]);
      });

      data.push(familyRow);
    });

    // init default data
    if (!data.length) {
      for (let i = 1; i <= 15; i++) {
        data.push([ i ]);
      }
    }

    this.data = data;

    this.spreadsheet.setData(this.data);
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

  private getDistrictsByCityCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.districtService.getDistrict(value).toPromise();
  }

  private getWardsByDistrictCode(instance, cell, c, r, source) {
    const value = instance.jexcel.getValueFromCoords(c - 1, r);

    if (!value) {
      return [];
    }

    return this.wardsService.getWards(value).toPromise();
  }
}
