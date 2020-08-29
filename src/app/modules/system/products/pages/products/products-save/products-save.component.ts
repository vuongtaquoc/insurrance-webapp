import { OnDestroy, OnInit, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProductService } from '@app/core/services';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';

@Component({
    selector: 'app-products-save',
    templateUrl: './products-save.component.html',
    styleUrls: ['./products-save.component.less']
})
export class ProductsSaveComponent implements OnInit, OnDestroy {
    isEdit: boolean = false;
    id: number;
    loading = false;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: NzModalService,
        private productService: ProductService) {

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
            productName: ['', Validators.required],
            productCode: ['', [Validators.required]],
            useTime: ['', [Validators.required]],
            productPrice: ['', [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER_INCLUDE_DECIMAL)]],
            status: ['1', Validators.required]
        });
    }

    public getDetail = (id) => {
        this.productService.getDetailById(id).subscribe(response => {
            this.form.patchValue({
                productName: response.productName,
                productCode: response.productCode,
                useTime: response.useTime,
                productPrice: response.productPrice,
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
            this.productService.update(this.id, this.form.value).subscribe(data => {
                this.router.navigate(['/products/list']);
            });
        } else {
            this.productService.create(this.form.value).subscribe(data => {
                this.router.navigate(['/products/list']);
            });
        }

    }

    ngOnDestroy() {

    }
}