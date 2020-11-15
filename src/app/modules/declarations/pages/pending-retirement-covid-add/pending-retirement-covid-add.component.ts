import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-pending-retirement-covid-add',
  templateUrl: './pending-retirement-covid-add.component.html',
  styleUrls: ['./pending-retirement-covid-add.component.less']
})
export class PendingRetirementCovidAddComponent extends PageCoreComponent {
  handlers: any[] = [];

  constructor(
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.handlers.push(eventEmitter.on('unsaved-changed', (isSubmit) => this.setIsUnsavedChanges(!isSubmit)));
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }
}
