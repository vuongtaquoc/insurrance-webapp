import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register-ivan-stop-service',
  templateUrl: './stop-service.component.html',
  styleUrls: ['./stop-service.component.less']
})
export class RegisterIvanStopServiceComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {

  }
  ngOnInit() {

    this.registerForm = this.formBuilder.group({
      registerCityCode: ['', [Validators.required]],
      registerCompany: ['', [Validators.required]],
      code: ['', [Validators.required]],
      name: ['', [Validators.required]],
      taxCode: ['', [Validators.required]],
    
      reason: ['', [Validators.required]],
    })
  }

  handleUpperCase(key) {
    const value = this.registerForm.value[key];

    this.registerForm.patchValue({
      [key]: value.toUpperCase()
    });
  }

  save() {
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity();
    }

    if (this.registerForm.invalid) {
      return;
    }
  }
}
