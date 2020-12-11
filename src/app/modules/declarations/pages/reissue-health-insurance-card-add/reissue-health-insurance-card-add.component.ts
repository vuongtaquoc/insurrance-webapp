import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-reissue-health-insurance-card-add',
  templateUrl: './reissue-health-insurance-card-add.component.html',
  styleUrls: ['./reissue-health-insurance-card-add.component.less']
})
export class ReissueHealthInsuranceCardAddComponent extends PageCoreComponent {
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
