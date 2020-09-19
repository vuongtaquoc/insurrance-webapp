import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-declaration-adjust-general-add',
  templateUrl: './adjust-general-add.component.html',
  styleUrls: ['./adjust-general-add.component.less']
})
export class AdjustGeneralAddComponent {
  constructor(
    private router: Router
  ) {}
}
