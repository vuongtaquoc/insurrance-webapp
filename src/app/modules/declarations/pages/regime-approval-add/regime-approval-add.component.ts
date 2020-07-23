import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-declaration-regime-approval-add',
  templateUrl: './regime-approval-add.component.html',
  styleUrls: ['./regime-approval-add.component.less']
})
export class RegimeApprovalAddComponent extends PageCoreComponent {
  handlers: any[] = [];

  constructor(
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.handlers.push(eventEmitter.on('unsaved-changed', () => this.setIsUnsavedChanges(true)));
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }
}
