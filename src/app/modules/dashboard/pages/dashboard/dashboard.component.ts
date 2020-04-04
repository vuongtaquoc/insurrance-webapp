import { Component, OnInit } from '@angular/core';

import { SelectItem } from '@app/core/interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {
  documents: any[] = [];
  pageNumbers: SelectItem[];

  ngOnInit() {
    this.pageNumbers = [{
      label: '5',
      value: 5
    }, {
      label: '10',
      value: 10
    }, {
      label: '15',
      value: 15
    }];

    this.documents = [{
      id: 1,
      sendDate: {
        date: '17/03/2020',
        time: '12:02'
      },
      attachment: {
        title: 'Báo tăng lao động',
        data: [{
          title: '- 1: Danh sách lao động tham gia BHXH, BHYT, BHTN, BHTNLĐ, BNN (Mẫu D02-TS)',
          link: ''
        }]
      },
      sendTimes: 1,
      status: 'Đã có kết quả',
      result: {
        documentNumber: '27885/2020/00108',
        detailLink: ''
      }
    }, {
      id: 2,
      sendDate: {
        date: '17/03/2020',
        time: '12:02'
      },
      attachment: {
        title: 'Báo tăng lao động',
        data: [{
          title: '- 1: Danh sách lao động tham gia BHXH, BHYT, BHTN, BHTNLĐ, BNN (Mẫu D02-TS)',
          link: ''
        }]
      },
      sendTimes: 1,
      status: 'Đã có kết quả',
      result: {
        documentNumber: '27885/2020/00108',
        detailLink: ''
      }
    }]
  }
}
