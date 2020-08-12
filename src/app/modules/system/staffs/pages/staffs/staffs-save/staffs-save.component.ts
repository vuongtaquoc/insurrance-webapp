import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { StaffService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-staffs-list',
    templateUrl: './staffs-save.component.html',
    styleUrls: ['./staffs-save.component.less', '../../../../../agencies/pages/agencies/agencies-add/agencies-add.component.less']
})
export class StaffsSaveComponent implements OnInit, OnDestroy {
    isEdit: boolean = false;
    id: number;
    loading = false; 
    form: FormGroup;
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
                this.router.navigate(['/staffs/list']);
            });
        } else {
            this.staffService.create(this.form.value).subscribe(data => {
                this.router.navigate(['/staffs/list']);
            });
        }

    }


}