import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.less']
})
export class AccountEditComponent implements OnInit {
  accountId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.accountId = this.route.snapshot.params.id;
  }
}
