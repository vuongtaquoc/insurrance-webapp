import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/core/services';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class AuthLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  private subscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private titleService: Title,
    private translateService: TranslateService,
  ) {
    if (this.authService.currentCredentials) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    // set page title
    this.subscription = this.translateService.get('auth.login.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [ false ]
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleSubmit() {
    this.loading = true;

    this.authService
      .login(this.form.username.value, this.form.password.value)
      .pipe(
        finalize(() => {
          this.loginForm.markAsPristine();
          this.loading = false;
        })
      )
      .subscribe(
        () => {
          this.router.navigate(['/'], { replaceUrl: true });
        },
        (error) => {
          console.error(error)
        }
      );
  }

  get form() {
    return this.loginForm.controls;
  }
}
