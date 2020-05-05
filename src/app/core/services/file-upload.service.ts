import { Injectable } from '@angular/core';

import { EventEmitter } from '@app/shared/utils/event-emitter';

@Injectable()
export class FileUploadEmitter {
  fileUpload = new EventEmitter();

  emit(event, data?: any) {
    this.fileUpload.emit(event, data);
  }

  on(event, cb) {
    return this.fileUpload.on(event, cb);
  }
}
