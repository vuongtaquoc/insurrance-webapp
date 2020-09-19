import { Component, Input, Output, OnInit, OnDestroy, OnChanges, AfterViewInit, ViewChild, EventEmitter, ViewEncapsulation } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import * as jexcel from 'jstable-editor/dist/jexcel.js';
import 'jsuites/dist/jsuites.js';

import { TABLE_HEADER_COLUMNS } from './document-table.data';

@Component({
  selector: 'app-document-table',
  templateUrl: './document-table.component.html',
  styleUrls: ['./document-table.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class DocumentTableComponent implements OnInit, OnDestroy, OnChanges {
  @Input() data: any[] = [];

  constructor(
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ngOnChanges(changes) {
     
  }
   
}
