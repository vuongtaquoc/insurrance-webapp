import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  cols: any[];
  documents: any[] = [];

  ngOnInit() {
    // this.cols = [
    //   { field: 'sendDate', header: 'Ngày gửi' },
    //   { field: 'attachment', header: 'Giấy tờ đi kèm' },
    //   { field: 'sendTimes', header: 'Lần gửi' },
    //   { field: 'status', header: 'Trạng thái' },
    //   { field: 'result', header: 'Kết quả xử lý HS của cơ quan BHXH' }
    // ];
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
