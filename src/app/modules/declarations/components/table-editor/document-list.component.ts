import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation, ElementRef } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import { customPicker } from '@app/shared/utils/custom-editor';
import 'jsuites/dist/jsuites.js';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-document-list-table',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentListTableComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('spreadsheetDocumentList', { static: true }) spreadsheetEl;
  @Input() data: any[] = [];
  @Input() events: Observable<void>;
  @Input() columns: any[] = [];
  @Input() nestedHeaders: any[] = [];
  @Input() tableName: string;
  @Output() onChange: EventEmitter<any> = new EventEmitter();
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onAddRow: EventEmitter<any> = new EventEmitter();

  spreadsheet: any;
  eventValid: string  = 'adjust-general:validate';
  private eventsSubscription: Subscription;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe((type) => this.handleEvent(type));
  }


  ngOnDestroy() {
    if (this.spreadsheet) {
      this.spreadsheet.destroy(this.spreadsheetEl.nativeElement, true);
    }
    this.eventsSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (changes.data && changes.data.currentValue.length) {
      this.updateTable();
    }
  }

  ngAfterViewInit() {
    this.spreadsheet = jexcel(this.spreadsheetEl.nativeElement, {
      data: [],
      nestedHeaders: this.nestedHeaders,
      columns: this.columns,
      allowInsertColumn: false,
      allowInsertRow: true,
      tableOverflow: true,
      tableWidth: '100%',
      tableHeight: '100%',
      columnSorting: false,
      defaultColAlign: 'left',
      onchange: (instance, cell, c, r, value) => {
        this.onChange.emit({
          instance, cell, c, r, value,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
        this.validIsurrance();
      },
      ondeleterow: (el, rowNumber, numOfRows) => {
        this.onDelete.emit({
          rowNumber,
          numOfRows,
          records: this.spreadsheet.getJson(),
          columns: this.columns
        });
      },
      oninsertrow: (instance, rowNumber, numOfRows, rowRecords, insertBefore,c, r) => {
        this.spreadsheet.updateFreezeColumn();
        const records = this.spreadsheet.getJson();

        this.onAddRow.emit({
          rowNumber,
          numOfRows,
          afterRowIndex: rowNumber,
          beforeRowIndex: rowNumber,
          insertBefore,
          records: this.spreadsheet.getJson()
        });
      }      
    });
    this.updateEditorToColumn('dateRelease', 'date');
    this.updateEditorToColumn('dateEffective', 'date');
    this.spreadsheet.hideIndex();

    this.updateTable();
  }

  private updateTable() {
    const data = [];
    this.data.forEach((d, index) => {
      d.data.origin  = d.origin;
      data.push(d.data);
    });


    data.forEach((d, i) => d[0] = i + 1);

    this.data = data;
    this.spreadsheet.setData(this.data);
    this.validIsurrance();
    this.handleEvent({
      type: 'validate',      
    });
  }

  private handleEvent(eventData) {
    if (eventData.type === 'validate') {
      setTimeout(() => {
        const data = Object.values(this.spreadsheet.getJson());
        const leaf = true;
        const initialize = true;
        eventEmitter.emit(this.eventValid, {
          name: this.tableName,
          isValid: this.spreadsheet.isTableValid(),
          errors: this.getColumnNameValid(this.spreadsheet.getTableErrors()),
          leaf,
          initialize
        });
      }, 10);
      return;
    }
  }

  private updateEditorToColumn(key, type, isCustom = false) {
    const column = this.columns.find(c => c.key === key);

    if (!column) return;

    column.editor = customPicker(this.spreadsheet, type, isCustom);
  }

  private getColumnNameValid(errors) {
    const errorcopy = [...errors];

    errorcopy.forEach(error => {
      let fieldName = this.columns[(error.x - 1)].fieldName;
      if(!fieldName) {
        fieldName = this.columns[(error.x - 1)].title;
      }
      error.columnName = fieldName;
      error.subfix = 'Dòng';
      error.prefix = 'Cột';
    });

    return errorcopy;
  }

  private validIsurrance() {
    setTimeout(() => {
        const indexIsExitsIsurranceNo = this.columns.findIndex(c => c.key === 'isExitsIsurranceNo');
        const indexIsurranceCode = this.columns.findIndex(c => c.key === 'isurranceCode');
        this.data.forEach((d, y) => {
          const isExitsIsurranceNo =  d.origin.isExitsIsurranceNo;
            if(isExitsIsurranceNo) {
              const column = this.columns[indexIsurranceCode];
              const validIsurranceNo = {
                  required: true,
              }
              this.spreadsheet.validationCell(y, indexIsurranceCode, column.fieldName ? column.fieldName : column.title, validIsurranceNo);
            }
        });

        this.handleEvent({
          type: 'validate',      
        });

    }, 10);
  } 
}
