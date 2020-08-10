import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NotificationService } from '@app/core/services';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';

@Component({
    selector: 'app-notification-emails-save',
    templateUrl: './notificationEmails-save.component.html',
    styleUrls: ['./notificationEmails-save.component.less', '../../../../../agencies/pages/agencies/agencies-add/agencies-add.component.less']
})
export class NotificationEmailsSaveComponent implements OnInit, OnDestroy {
    isEdit: boolean = false;
    id: number;
    loading = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NzModalService,
        private notificationService: NotificationService
    ) {
    }

    ngOnInit() {
        this.id = +this.route.snapshot.params.id;
        this.loadForm();
        if (this.id && this.id > 0) {
            this.isEdit = true;
            this.getDetail(this.id);
        }
    }

    public loadForm() {
        this.form = this.formBuilder.group({
            title: ["Thông tin đăng nhập hệ thống 'Hóa Đơn Điện Tử'", Validators.required],
            to: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            body: ['', [Validators.required]],
            status: ['1', Validators.required]
        });
    }

    public getDetail = (id) => {
        this.notificationService.getDetailById(id).subscribe(response => {
            this.form.patchValue({
                title: response.title,
                to: response.to,
                body: response.body,
                status: response.status,
            });
        });
    }

    public validateControl = (controlName: string) => {
        if (this.form.controls[controlName].invalid && this.form.controls[controlName].touched)
            return true;

        return false;
    }

    public hasError = (controlName: string, errorName: string) => {
        if (this.form.controls[controlName].hasError(errorName))
            return true;

        return false;
    }

    public save() {

        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }

        if (this.form.invalid) {
            return;
        }

        if (this.isEdit) {
            this.notificationService.update(this.id, this.form.value).subscribe(data => {
                this.router.navigate(['/notificationEmails/list']);
            });
        } else {
            this.notificationService.create(this.form.value).subscribe(data => {
                this.router.navigate(['/notificationEmails/list']);
            });
        }

    }

    ngOnDestroy() {

    }
}