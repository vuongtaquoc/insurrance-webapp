import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-health-recovery-approval-add',
  templateUrl: './health-recovery-approval-add.component.html',
  styleUrls: ['./health-recovery-approval-add.component.less']
})
export class HealthRecoveryApprovalAddComponent extends PageCoreComponent {
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
