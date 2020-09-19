import { Component, ViewEncapsulation, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import uuid from 'uuid';
import cloneDeep from 'lodash/cloneDeep';

@Component({
  selector: 'app-file-attachment',
  templateUrl: './file-attachment.component.html',
  styleUrls: ['./file-attachment.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class FileAttachmentComponent implements OnInit, OnChanges {
  @Input() files: any = [];
  @Input() rowDefault: string;
  @Output() onChangeName = new EventEmitter<any>();
  @Output() onSelectedFileChanged = new EventEmitter<any>();

  rows: any[] = [];

  ngOnInit() {
    if (!this.rows.length) {
      this.loadDefaultData();
    }
  }

  ngOnChanges(changes) {
    if (!this.rows.length) {
      this.loadDefaultData();
    }

    if (changes.files && changes.files.currentValue && changes.files.currentValue.length) {
      changes.files.currentValue
        .forEach((file, index) => {
          this.rows[index].documentName = file.documentName;
          this.rows[index].fileName = file.fileName;
          this.rows[index].hasFile = true;
        });
    }
  }

  private loadDefaultData() {
    
    for (let i = 1; i <= 10; i++) {
      if (i === 1 && this.rowDefault !== '') {
        this.rows.push({
          no: i,
          rowId: uuid.v4(),
          documentName: this.rowDefault,
          data: {},
          hasFile: true
        });
      } else {
        this.rows.push({
          no: i,
          rowId: uuid.v4(),
          documentName: '',
          data: {},
          hasFile: false
        });
      }
        
    }
  }

  handleFileSelected(file, rowId) {
    const row = this.rows.find(r => r.rowId === rowId);

    if (!row) return;

    row.data = file.file;
    row.fileName = file.metadata.name;
    row.size = file.metadata.size;
    row.hasFile = true;

    const files = this.rows.filter(row => row.hasFile);

    this.onSelectedFileChanged.emit(cloneDeep([...files]));
  }

  handleChangeDocumentName(rowId) {
    const row = this.rows.find(r => r.rowId === rowId);

    if (!row) return;

    const files = this.rows.filter(row => row.hasFile);

    this.onSelectedFileChanged.emit(cloneDeep([...files]));
  }

  handleClearRow(rowId) {
    const row = this.rows.find(r => r.rowId === rowId);

    if (!row) return;

    row.data = null;
    row.fileName = null;
    row.size = null;
    row.hasFile = false;
    row.documentName = '';

    const files = this.rows.filter(row => row.hasFile);

    this.onSelectedFileChanged.emit(cloneDeep(cloneDeep([...files])));
  }
}
