import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, NavigationCancel, NavigationError } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { NavigationService } from '@app/core/services';

import { environment } from '@config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'insurrance-webapp';

  private loadingSubscription: Subscription;

  constructor(
    private translate: TranslateService,
    private navigationService: NavigationService,
    private router: Router,
    private loadingBar: LoadingBarService,
  ) {
    translate.setDefaultLang(environment.defaultLanguage);
  }

  ngOnInit() {
    this.loading();
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

  loading() {
    this.loadingSubscription = this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart:
          if (!this.navigationService.getBackClicked()) {
            this.loadingBar.start();
          }

          break;

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          if (!this.navigationService.getBackClicked()) {
            this.loadingBar.complete();
          }

          break;

        default:
          break;
      }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
