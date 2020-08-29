import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX, PERMISSON_DATA_TEST } from '@app/shared/constant';
import { StaffService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-accounts-save',
    templateUrl: './accounts-save.component.html',
    styleUrls: ['./accounts-save.component.less']
})
export class AccountsSaveComponent implements OnInit, OnDestroy {
    isEdit: boolean = false;
    id: number;
    loading = false;
    form: FormGroup;

    permissions: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NzModalService,
        private staffService: StaffService) {

    }
    ngOnInit() {
        this.id = +this.route.snapshot.params.id;
        this.loadForm();
        if (this.id && this.id > 0) {
            this.isEdit = true;
            this.getDetail(this.id);
        }

        this.getPermission();
    }

    ngOnDestroy() {

    }

    public loadForm() {
        this.form = this.formBuilder.group({
            fullName: ['', Validators.required],
            userName: ['', [Validators.required, Validators.minLength(6)]],
            passWord: ['', [Validators.required, Validators.minLength(6)]],
            tel: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER)]],
            email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            status: ['1', Validators.required],
        });
    }

    getPermission() {
        this.staffService.getPermission(this.id).subscribe(res => {
            this.permissions = PERMISSON_DATA_TEST;
        })
    }

    public getDetail = (id) => {
        this.staffService.getDetailById(id).subscribe(response => {
            this.form.patchValue({
                fullName: response.fullName,
                userName: response.userName,
                passWord: response.passWord,
                tel: response.tel,
                email: response.email,
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
            this.staffService.update(this.id, this.form.value).subscribe(data => {
                this.router.navigate(['/accounts/list']);
            });
        } else {
            this.staffService.create(this.form.value).subscribe(data => {
                this.router.navigate(['/accounts/list']);
            });
        }

    }

    onItemChecked(id: number, checked: boolean, action: string) {
        let item = this.permissions.find(x => x.actionId == id);
        if (item) {
            for (let key in item) {
                if (key == action) {
                    item[key] = checked;
                    break;
                }
            }
        }

    }

    onAllChecked(checked: boolean, action: string) {
        this.permissions.forEach((item) => {
            this.onItemChecked(item.actionId, checked, action);
        });
    }

}