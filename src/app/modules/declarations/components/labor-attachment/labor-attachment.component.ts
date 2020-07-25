import { Component, ViewEncapsulation, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import uuid from 'uuid';

@Component({
  selector: 'app-labor-attachment',
  templateUrl: './labor-attachment.component.html',
  styleUrls: ['./labor-attachment.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LaborAttachmentComponent implements OnInit, OnChanges {
  @Input() files: any = [];
  @Output() onSelectedFileChanged = new EventEmitter<any>();

  rows: any[] = [];

  ngOnInit() {
    for (let i = 1; i <= 10; i++) {
      this.rows.push({
        no: i,
        rowId: uuid.v4(),
        documentName: '',
        data: {},
        hasFile: false
      });
    }
  }

  ngOnChanges(changes) {
    if (changes.files && changes.files.currentValue.length) {
      changes.files.currentValue.forEach((file, index) => {
        this.rows[index].documentName = file.documentName;
        this.rows[index].fileName = file.fileName;
        this.rows[index].hasFile = true;
      });
    }
  }

  handleFileSelected(file, rowId) {
    const row = this.rows.find(r => r.rowId === rowId);

    if (!row) return;

    row.data = file.file;
    row.fileName = file.metadata.name;
    row.size = file.metadata.size;
    row.hasFile = true;

    this.onSelectedFileChanged.emit(this.rows.filter(row => row.hasFile));
  }
}
