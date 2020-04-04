import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';

import { AuthenticationService } from '@app/core/services';

@Component({
  selector: 'app-auth-request-reset',
  templateUrl: './request-reset-password.component.html',
  styleUrls: ['./request-reset-password.component.less']
})
export class RequestResetPasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  isLocked = false;
  errors: any[] = [];
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private titleService: Title,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // set page title
    this.subscription = this.translateService.get('auth.requestReset.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });

    this.resetForm = this.formBuilder.group({
      email: []
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleSubmit() {
    this.authService.requestResetPassword(this.resetForm.value.email)
      .subscribe(
        () => {
          this.router.navigate(['/auth/forgot-success'], { replaceUrl: true });
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
