import { Input, OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';
import { StaffService, AccountService, RoleService } from '@app/core/services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-accounts',
    templateUrl: './accounts.component.html',
    styleUrls: ['./accounts.component.less']
})
export class AccountsComponent implements OnInit, OnDestroy {
    @Input() accountId: string;
    isEdit: boolean = false;
    id: number;
    loading = false;
    form: FormGroup;
    roles: any[] = [];
    isSpinning: boolean = false;
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NzModalService,
        private accountService: AccountService,
        private roleService: RoleService,
    ) {
    }
    ngOnInit() {
        this.loadForm();
        if(this.accountId) {
            this.getDetail(this.accountId);
        } else {
            this.getRoles();
        }
    }

    ngOnDestroy() {

    }

    public loadForm() {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            loginId: ['', [Validators.required]],
            passWord: ['', [Validators.required]],
            mobile: ['', [Validators.required, Validators.maxLength(15), Validators.pattern(REGEX.PHONE_NUMBER)]],
            email: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
            active: [false, Validators.required],
        });
    }

    private getRoles() {
        this.isSpinning = true;
        this.roleService.getList().subscribe(data => {
            this.roles = data;
            this.isSpinning = false;
        })
    }

    private getDetail(id) {
        this.isSpinning = true;
        this.accountService.getDetailById(id).subscribe(data => {
            this.form.patchValue({
                name: data.name,
                loginId: data.loginId,
                password: data.password,
                email: data.email,
                mobile: data.mobile,
                active: data.active,
            });
            this.roles = data.roles;
            this.isSpinning = false;
        });

    }

    private save() {
       
        for (const i in this.form.controls) {
            this.form.controls[i].markAsDirty();
            this.form.controls[i].updateValueAndValidity();
        }

        if (this.form.invalid) {
            return;
        }

        const roleOfUser = this.formatRolesBeforeSendToServer();
        const accountInfo =  {
            ...this.form.value,
            roles: roleOfUser,
        }
        
        if(this.accountId) {
            this.updateAccount(this.accountId, accountInfo);
        }else {
            this.createAccount(accountInfo);
        }
 
    }
    private createAccount(account) {
        this.isSpinning = true;
        this.accountService.create(account).subscribe(data => {
            this.isSpinning = false;
            this.router.navigate(['/account-management/list']);
        });
    }

    private updateAccount(id, account) {
        this.isSpinning = true;
        this.accountService.update(id,account).subscribe(data => {
            this.isSpinning = false;
            this.router.navigate(['/account-management/list']);
        });
    }

    formatRolesBeforeSendToServer() {
        if (!this.roles || !this.roles.length) {
            return;
        }

        const rolefomats = [...this.roles];

        rolefomats.forEach((item) => {
            item.read = (item.read && item.read !== 2) ? 1 : 0;
            item.update = (item.update && item.update !== 2) ? 1 : 0;
            item.create = (item.create && item.create !== 2) ? 1 : 0;
            item.delete = (item.delete && item.delete !== 2) ? 1 : 0;
            item.active = (item.active && item.active !== 2) ? 1 : 0;
            item.approve = (item.approve && item.approve !== 2) ? 1 : 0;
            item.rejected = (item.rejected && item.rejected !== 2) ? 1 : 0;
        });

        return rolefomats;
    }

}