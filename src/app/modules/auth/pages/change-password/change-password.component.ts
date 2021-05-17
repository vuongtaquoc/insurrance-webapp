import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
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
    private translateService: TranslateService,
    private modalService: NzModalService,
  ) {}

  ngOnInit() {
    // set page title
    this.subscription = this.translateService.get('auth.changePassword.pageTitle').subscribe(text => {
      this.titleService.setTitle(text);
    });

    this.token = this.route.snapshot.params.token;
    this.resetForm = this.formBuilder.group({
      username: [{ value: '', disabled: true }],
      password: [],
      confirmPassword: []
    });
    this.authService.getUserByToken(this.token)
      .pipe(first())
      .subscribe(
        (data: any) => {
          if (data) {
            this.form.username.setValue(data.userId);
          } else {
            this.modalService.error({
              nzTitle: 'Thời gian đổi mật khẩu hết hạn vui lòng cấp lấy lại token'
            });
            this.router.navigate(['/auth/forgot'], { replaceUrl: true });
          }
        }
      );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleSubmit() {
    this.authService.resetPassword(this.token, this.form.password.value, this.form.confirmPassword.value)
      .subscribe(
        (data: any) => {
          this.modalService.info({
            nzTitle: 'Đổi mật khẩu thành công, vui lòng đang nhập hệ thống với mật khẩu đã thay đổi'
          });
          // this.router.navigate(['/auth/login'], { replaceUrl: true });
          this.router.navigate(['/auth/login'], { replaceUrl: true });
        },
        (error) => {
          this.modalService.warning({
            nzTitle: error.message
          });
        }
      );
  }

  get form() {
    return this.resetForm.controls;
  }
}
