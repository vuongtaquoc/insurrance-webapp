import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-declaration-increase-labor',
  templateUrl: './increase-labor.component.html',
  styleUrls: ['./increase-labor.component.scss']
})
export class InCreaseLaborComponent implements OnInit {
  form: FormGroup;
  users: TreeNode[];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      number: ['1'],
      month: ['03'],
      year: ['2020']
    });

    // TODO mock data
    this.users = [
      {
        "label": "Documents",
        "data": "Documents Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [{
            "label": "Work",
            "data": "Work Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
          },
          {
            "label": "Home",
            "data": "Home Folder",
            "expandedIcon": "pi pi-folder-open",
            "collapsedIcon": "pi pi-folder",
          }]
      },
      {
        "label": "Pictures",
        "data": "Pictures Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [
          {"label": "barcelona.jpg", "icon": "pi pi-image", "data": "Barcelona Photo"},
          {"label": "logo.jpg", "icon": "pi pi-file", "data": "PrimeFaces Logo"},
          {"label": "primeui.png", "icon": "pi pi-image", "data": "PrimeUI Logo"}]
      },
      {
        "label": "Movies",
        "data": "Movies Folder",
        "expandedIcon": "pi pi-folder-open",
        "collapsedIcon": "pi pi-folder",
        "children": [{
            "label": "Al Pacino",
            "data": "Pacino Movies",
          },
          {
            "label": "Robert De Niro",
            "data": "De Niro Movies",
          }]
      }
    ]
  }
}
