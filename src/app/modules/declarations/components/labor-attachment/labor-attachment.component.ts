import { Component, ViewEncapsulation, OnInit } from '@angular/core';

@Component({
  selector: 'app-labor-attachment',
  templateUrl: './labor-attachment.component.html',
  styleUrls: ['./labor-attachment.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class LaborAttachmentComponent implements OnInit {
  rows: any[] = [];

  ngOnInit() {
    for (let i = 1; i <= 10; i++) {
      this.rows.push({
        no: i,
        id: i,
        title: '',
        file: {}
      });
    }
  }

  handleFileSelected(file, id) {
    const row = this.rows.find(r => r.id === id);

    if (!row) return;

    row.file = file;
  }
}
