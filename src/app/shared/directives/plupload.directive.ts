import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import plupload from 'plupload';

import { AuthenticationService } from '@app/core/services';
import { environment } from '@config';
import { FileUploadEmitter } from '@app/core/services';

const minDimensions = {
  width: 800,
  height: 600,
};

@Directive({
  selector: '[plupload]',
})
export class PluploadDirective {
  private init: any = {
    chunk_size: '128kb',
    unique_names: true,
    filters: {
      mime_types: [{
        title: 'Attachment files',
        extensions: 'xlsx,docx,pdf,pptx,xls,doc,ppt',
      }],
      max_file_size: '5mb',
    },
    multi_selection: false,
    headers:  this.getHeaders(),
  };
  private uploader;
  private fileUploadHandler;

  @Input('plupload') element;
  @Output() onSelectedFileChanged = new EventEmitter<any>();
  @Output() onSelectedFileUploaded = new EventEmitter<any>();
  @Output() onUploadError = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private authService: AuthenticationService,
    private fileUploadEmitter: FileUploadEmitter,
  ) {}

  ngOnInit() {
    this.init.url = this.setUploaderUrl();
    this.init.browse_button = this.el.nativeElement;
    this.init.headers = this.getHeaders();

    this.uploader = new plupload.Uploader(this.init);
    this.uploader.bind('FilesAdded', this.filesAdded.bind(this));
    this.uploader.bind('FileUploaded', this.fileUploaded.bind(this));
    this.uploader.bind('Error', this.uploadError.bind(this));
    this.uploader.init();

    this.fileUploadHandler = this.fileUploadEmitter.on('file:upload', this.uploadStart.bind(this));
  }

  private setUploaderUrl() {
    // return `${environment.apiUrl}/upload`;
    return 'http://media:3000/upload'
  }

  private filesAdded(uploader, files) {
    uploader.files.forEach(file => {
      if (file && file.id !== files[0].id) {
        uploader.removeFile(file);
      }
    });
    this.onSelectedFileChanged.emit(files[0]);
  }

  private fileUploaded(uploader, file, result) {
    file.serverPath = result.response;

    this.fileUploadEmitter.emit('file:uploaded', file);
  }

  private uploadError(uploader, error) {
    this.onUploadError.emit(error);
  }

  private uploadStart(data) {
    this.uploader.settings.multipart_params = this.uploader.settings.multipart_params || {};

    this.uploader.start();
  }

  private getHeaders() {
    let headers = {};
    const accessToken = this.authService.currentCredentials.token;

    headers['X-Authorization-Token'] = accessToken || '';

    return headers;
  }

  private readLocalFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        const target = <any>event.target;
        const image = new Image();
        image.src = target.result;
        image.onload = function() {
          if (image.width < minDimensions.width ||
            image.height < minDimensions.height) {
            return reject({
              minDimensions: true,
            });
          }

          return resolve(target.result);
        };
      };

      reader.readAsDataURL(file);
    });
  }

  ngOnDestroy() {
    this.uploader.unbindAll();
    this.uploader.destroy();
    this.fileUploadHandler();
  }
}
