import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      subject: ['', Validators.required],
      name: ['', Validators.required],
      taxcode: ['', Validators.required],
      address: ['', Validators.required],
      addressregister: ['', Validators.required],
      companycode: ['', Validators.required] 
    });
  }

  ngOnDestroy() {
  }

  get form() {
    return this.loginForm.controls;
  }
}

