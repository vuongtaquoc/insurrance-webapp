import { Component, OnInit } from '@angular/core';

import { DeclarationService } from '@app/core/services';
import { Declaration } from '@app/core/interfaces';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-increase-labor-list',
  templateUrl: './increase-labor-list.component.html',
  styleUrls: ['./increase-labor-list.component.less']
})
export class IncreaseLaborListComponent implements OnInit {
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  listOfDisplayData: ItemData[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  year: any = null;
  declarations: Declaration[] = [];

  constructor(
    private declarationService: DeclarationService
  ) {}

  ngOnInit() {
    this.declarationService.getDeclarations({
      documentType: 600
    }).subscribe(declarations => {
      this.declarations = declarations;

      this.listOfDisplayData = [ ...declarations ];
    });

  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  onChange(value) {
    console.log(value)
  }
}
