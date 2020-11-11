import { Component, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';
@Component({
  selector: 'app-declaration-arrears-add',
  templateUrl: './arrears-add.component.html',
  styleUrls: ['./arrears-add.component.less']
})
export class ArrearsAddComponent extends PageCoreComponent {
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