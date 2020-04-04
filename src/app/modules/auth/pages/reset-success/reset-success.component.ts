import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-reset-success',
  templateUrl: './reset-success.component.html',
  styleUrls: ['./reset-success.component.less']
})
export class ResetSuccessComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    // set page title
    this.subscription = this.translateService.get('auth.resetPassword.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
