import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-regime-approval',
  templateUrl: './regime-approval.component.html',
  styleUrls: ['./regime-approval.component.less']
})
export class RegimeApprovalComponent implements AfterViewInit {
  editorHeight: number;

  ngAfterViewInit() {
    this.editorHeight = this.getEditorHeight();
  }

  private getEditorHeight() {
    const content = document.getElementsByClassName('page-regime-approval__content')[0];
    const groupButtons: any = document.getElementsByClassName('page-regime-approval__group-button')[0];
    const form: any = document.getElementsByClassName('regime-approval-form')[0];

    const height = content.clientHeight;
    const GRID_GAP = 10;

    return height - groupButtons.offsetHeight - form.offsetHeight - (GRID_GAP * 2);
  }
}
