import { Component } from '@angular/core';

import { eventEmitter } from '@app/shared/utils/event-emitter';

@Component({
  selector: 'app-regime-approval',
  templateUrl: './regime-approval.component.html',
  styleUrls: ['./regime-approval.component.less']
})
export class RegimeApprovalComponent {
  handleSelectTab({ index }) {
    eventEmitter.emit('regime-approval:tab:change', index);
  }

  handleTableChange(data, type) {
    console.log(data, type)
  }
}
