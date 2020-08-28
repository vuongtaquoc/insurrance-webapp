import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';

import { PAGE_SIZE, GENDER, PERMISSON_DATA_TEST } from '@app/shared/constant';
import { getBirthDay } from '@app/shared/utils/custom-validation';
import { StaffService } from '@app/core/services';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-staff-permission',
    templateUrl: './staffs-permission.component.html',
    styleUrls: ['./staffs-permission.component.less', '../../../../../agencies/pages/agencies/agencies-list/agencies-list.component.less']
})
export class StaffsPersmissonComponent implements OnInit, OnDestroy {

    permissions: any[] = [];
    id: number;

    constructor(
        private route: ActivatedRoute,
        private staffService: StaffService,
        private router: Router
    ) {

    }

    ngOnInit() {
        this.id = +this.route.snapshot.params.id;
        if (this.id && this.id > 0) {
            this.getPermission();
        } else {
            this.router.navigate(['/staffs/list']);
        }
    }

    getPermission() {
        this.staffService.getPermission(this.id).subscribe(res => {
            this.permissions = PERMISSON_DATA_TEST;
        })
    }

    save(data) {
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

    ngOnDestroy() {

    }




}