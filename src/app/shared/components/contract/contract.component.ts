import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { EmployeeService } from '@app/core/services';
import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.less'],
  encapsulation: ViewEncapsulation.None
})
export class ContractComponent implements OnInit, OnDestroy {
  @Input() events: Observable<any>;

  private eventsSubscription: Subscription;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit() {
 
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
    
  }
}
