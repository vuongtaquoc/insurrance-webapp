import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-declaration-adjust-general-edit',
  templateUrl: './adjust-general-edit.component.html',
  styleUrls: ['./adjust-general-edit.component.less']
})
export class AdjustGeneralEditComponent implements OnInit {
  declarationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
  }
}
