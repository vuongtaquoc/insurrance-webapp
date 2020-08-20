import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageCoreComponent } from '@app/shared/components';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-maternity-approval-edit',
  templateUrl: './maternity-approval-edit.component.html',
  styleUrls: ['./maternity-approval-edit.component.less']
})
export class MaternityApprovalEditComponent extends PageCoreComponent implements OnInit {
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
    this.handlers.push(eventEmitter.on('unsaved-changed', (isSubmit) => this.setIsUnsavedChanges(!isSubmit)));
  }

  ngOnDestroy() {
    eventEmitter.destroy(this.handlers);
  }
}
