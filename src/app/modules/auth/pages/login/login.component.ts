import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { eventEmitter } from '@app/shared/utils/event-emitter';
import { AuthenticationService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ROLE, REGEX } from '@app/shared/constant';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class AuthLoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  private subscription: Subscription;
  private handlers: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private titleService: Title,
    private translateService: TranslateService,
    private messageService: NzMessageService,
    private modalService: NzModalService,
  ) {
    this.navigatePageDefault();
  }

  ngOnInit() {

    // set page title
    this.subscription = this.translateService.get('auth.login.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],//, Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      password: ['', [Validators.required]],//, Validators.pattern(REGEX.ONLY_CHARACTER_NUMBER)]],
      remember: [false],
      // companyName: ['', Validators.required]
    });

    this.setDefault();
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setDefault() {
    const lcLoginForm = this.authService.getAutoLogin();
    if (lcLoginForm) {
      this.loading = true;
      this.loginForm.patchValue({
        username: lcLoginForm.username,
        password: lcLoginForm.password,
        remember: lcLoginForm.remember,
      });
    
      this.loginAction(lcLoginForm.username, lcLoginForm.password);
    }
  }

  handleSubmit() {
    
    if(this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loginAction(this.form.username.value, this.form.password.value);
  }

  private loginAction(username, password) {
    this.authService
    .login(username, password)
    .pipe(
      finalize(() => {
        this.loginForm.markAsPristine();
        this.loading = false;
      })
    )
    .subscribe(
      () => {
        this.authService.saveRememberMe(this.loginForm.value);
        this.navigatePageDefault();
      },
      (error) => {
        this.modalService.warning({
          nzTitle: error.message
        });
      }
    );
  }

  get form() {
    return this.loginForm.controls;
  }

  private navigatePageDefault() {

    if (this.authService.currentCredentials) {
      let defaultUrl = '/';
      if (ROLE.CUSTOMER === this.authService.currentCredentials.role.level
        && !this.authService.currentCredentials.companyInfo.hasContract) {
        defaultUrl = '/register-ivan';
      } else if (ROLE.SALE === this.authService.currentCredentials.role.level) {
        defaultUrl = this.authService.currentCredentials.role.defaultUrl;
      }
      this.router.navigate([defaultUrl]);
    }

  }
}
