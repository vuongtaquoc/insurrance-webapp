import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-request-reset-success',
  templateUrl: './request-reset-success.component.html',
  styleUrls: ['./request-reset-success.component.less']
})
export class RequestResetSuccessComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    private titleService: Title,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    // set page title
    this.subscription = this.translateService.get('auth.requestReset.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
