import { Component, OnInit, Input } from '@angular/core';
import { DataRegisterIvan, MustMatch } from "@app/shared/constant";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATE_FORMAT, REGEX } from '@app/shared/constant';

@Component({
  selector: 'app-register-ivan-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterIvanRegisterComponent implements OnInit {
  registerIvanData: any[] = [];
  registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {

  }
  ngOnInit() {
    this.registerIvanData = DataRegisterIvan;
    this.registerForm = this.formBuilder.group({
      registerCityCode: ['', [Validators.required]],
      registerMethod: ['', [Validators.required]],
      registerCompany: ['', [Validators.required]],
      groupCode: ['', [Validators.required]],
      groupCompany: ['', [Validators.required]],
      salaryAreaCode: ['', [Validators.required]],
      tax: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      addressRegister: ['', [Validators.required]],
      delegate: ['', [Validators.required]],
      position: ['', [Validators.required]],
      delegatePage: [''],
      checked: [''],
      isHasCertificate: [''],
      dateFrom: [''],
      tel: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      personContact: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(REGEX.PHONE_NUMBER)]],
      emailOfContract: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      emailOfContractConfirm: ['', [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      paymentMethodCode: ['', [Validators.required]],
      responseResults: ['', [Validators.required]],
      privateKey: ['', [Validators.required]],
      vendorToken: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      expired: ['', [Validators.required]],
    },
    {
      validator: MustMatch('emailOfContract', 'emailOfContractConfirm')
    })
  }

  handleUpperCase(key) {
    const value = this.registerForm.value[key];

    this.registerForm.patchValue({
      [key]: value.toUpperCase()
    });
  }

  save() {
    console.log(this.registerForm, 'this.registerForm');
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    // if (this.registerForm.invalid) {
    //   return;
    // }
  }
}
