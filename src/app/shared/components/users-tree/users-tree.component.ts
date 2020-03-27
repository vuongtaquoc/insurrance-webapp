import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-users-tree',
  templateUrl: './users-tree.component.html',
  styleUrls: ['./users-tree.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersTreeComponent {
  @Input() data: any[];
}
