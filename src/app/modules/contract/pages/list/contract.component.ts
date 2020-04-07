import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  listOfData: any;
  constructor(
    private formBuilder: FormBuilder,
  ) {
  }
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
    });
    this.listOfData = [
      {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
       {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
      {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },{
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
       {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
      {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
      {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
       {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      },
      {
        gender: 'Lê văn đức',
        name: 'Lê văn đức'
      }
    ];
  }

  ngOnDestroy() {
  }

  get form() {
    return this.loginForm.controls;
  }
}

