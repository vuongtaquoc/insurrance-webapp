import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthenticationService } from '@app/core/services';

@Component({
  selector: 'app-auth-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.less']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  resetForm: FormGroup;
  errors: any[] = [];
  token: string;
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
    this.subscription = this.translateService.get('auth.changePassword.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });

    this.token = this.route.snapshot.params.token;
    this.resetForm = this.formBuilder.group({
      userId: [],
      password: [],
      confirmPassword: []
    });

    this.authService.getUserByToken(this.token)
      .pipe(first())
      .subscribe(
        (data: any) => {
          // this.form.userId.setValue(data.userId);
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleSubmit() {
    this.authService.resetPassword(this.token, this.form.password.value, this.form.confirmPassword.value)
      .subscribe(
        () => {
          this.router.navigate(['/auth/reset-success'], { replaceUrl: true });
        },
        (error) => {
          console.error(error);
        }
      );
  }

  get form() {
    return this.resetForm.controls;
  }
}
