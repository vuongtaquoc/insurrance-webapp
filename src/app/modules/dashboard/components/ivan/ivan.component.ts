import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard-ivan',
  templateUrl: './ivan.component.html',
  styleUrls: ['./ivan.component.less']
})
export class DashboardIvanComponent implements OnInit {
  ivanForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.ivanForm = this.formBuilder.group({
      expire: [''],
      expireDate: ['']
    });
  }
}
