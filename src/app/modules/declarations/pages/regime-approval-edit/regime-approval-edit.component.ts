import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-declaration-regime-approval-edit',
  templateUrl: './regime-approval-edit.component.html',
  styleUrls: ['./regime-approval-edit.component.less']
})
export class RegimeApprovalEditComponent extends PageCoreComponent implements OnInit {
  declarationId: string;
  handlers: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {
    this.declarationId = this.route.snapshot.params.id;
    this.handlers.push(eventEmitter.on('unsaved-changed', () => this.setIsUnsavedChanges(true)));
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }
}
