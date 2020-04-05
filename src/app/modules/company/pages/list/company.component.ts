import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-companies',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    });
  }

  ngOnDestroy() {
  }

  get form() {
    return this.loginForm.controls;
  }
}

