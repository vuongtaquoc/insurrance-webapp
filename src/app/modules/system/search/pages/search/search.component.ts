import { Component, OnInit, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';
import { PAGE_SIZE, GENDER } from '@app/shared/constant';
import { DeclarationService, ExternalService } from '@app/core/services';
import { download } from '@app/shared/utils/download-file';
import { MIME_TYPE } from '@app/shared/constant';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit, OnDestroy {

  previous: string = "<<";
  isSpinning: boolean = false;
  years: any[];
  months: any[];

  constructor(
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private translateService: TranslateService,
    private declarationService: DeclarationService,
    private externalService: ExternalService,
  ) { }


  ngOnInit() {
    this.loadYear();  
  }

  private loadYear() {   
    this.declarationService.getDeclarationsYear().subscribe(data => {
      this.years = data;
      if(this.years.length > 0) {
        const max = this.years.reduce((a, b) => Math.max(a, b));
        this.loadMonth(max);
      }
    });
  }

  private loadMonth(year) {
    this.isSpinning = true;
    this.externalService.getC12OfYear(year).subscribe(data => {
      this.months = data;
      this.isSpinning = false;
    });
  }

  downloadC12(month) {

    if(!month.hasResult) {
      this.modalService.warning({
        nzTitle: 'Thông báo',
        nzContent: 'Tờ khai chưa có kết quả vui long kiểm tra email thời gian hẹn trả kết quả'
      });

      return;
    }

    month.isDownloading = true;
    const mimeType = this.getMimeType('.pdf');
    const fileName = `${ month.year }-${ month.month }.pdf`;
    this.externalService.downloadC12(month.year, month.month).then(response => {
      download(fileName, response, mimeType);
      month.isDownloading = false;
    });
    
  }

  ngOnDestroy() {

  }

  viewDeclaration(data) {
    this.loadMonth(data);
  }

  getMimeType(subfixFile: string) {
    const mimeType = MIME_TYPE.find(d => d.key === subfixFile);
    if (mimeType) {
      return mimeType.value;
    }
    return MIME_TYPE[0].value
  }

}
