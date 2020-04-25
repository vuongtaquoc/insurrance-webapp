import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-declaration-regime-approval-edit',
  templateUrl: './regime-approval-edit.component.html',
  styleUrls: ['./regime-approval-edit.component.less']
})
export class RegimeApprovalEditComponent implements OnInit {
  declarationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
  }
}
