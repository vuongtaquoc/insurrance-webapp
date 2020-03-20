import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { SelectItem } from '@app/core/interfaces';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit {
  languages: SelectItem[] = [];
  selectedLanguage: string = 'vi';

  constructor(private translateService: TranslateService) {
  }

  ngOnInit() {
    this.translateService.get([
      'common.languages.vi',
      'common.languages.en'
    ]).subscribe(text => {
      this.languages.push({
        label: text['common.languages.vi'],
        value: 'vi'
      }, {
        label: text['common.languages.en'],
        value: 'en'
      });
    });
  }
}
