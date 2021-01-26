import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có mã số BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Nơi đăng ký KCB ban đầu', colspan: '2' },
    { title: 'Phương án BHYT', rowspan: '3' },
    { title: 'Có giảm chết', rowspan: '3' },
    { title: 'Ngày chết', rowspan: '3' },
    { title: 'Số biên lai', rowspan: '3' },
    { title: 'Ngày biên lai/Ngày văn bản phê duyệt', rowspan: '3' },
    { title: 'Hỗ trợ thêm', colspan: '2' },
    { title: 'Thời gian tham gia', colspan: '2' },
    { title: 'Tiền lương hoặc tổng hệ số', colspan: '2' },
    { title: 'Tiền lương, trợ cấp hoặc số tiền đóng', rowspan: '3' },
    { title: 'Ghi chú', rowspan: '3' }  
    
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mã đơn vị KCB', rowspan: '2' },
    { title: 'Tên đơn vị KCB', rowspan: '2' },
    { title: 'Tỷ lệ NSĐP hỗ trợ(%)', rowspan: '2' },
    { title: 'Tổ chức, cá nhân khác hỗ trợ(đồng)', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Số tháng', rowspan: '2' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Tổng hệ số', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
  ],
];

export const TABLE_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  readOnly: true,
  align: 'center'
}, {
  type: 'text',
  width: 220,
  title: '(2)',
  fieldName: 'Họ và tên',
  key: 'fullName',
  warnings: {
    duplicateUserFields: {
      primary: 'fullName',
      check: ['employeeId']
    },
  },
  validations: {
    required: true,
  }
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'isExitsIsurranceNo',   
}, {
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(4.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    required: true,
    duplicate: true,
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatus',
  width: 123,
  title: '(4.2)',
  wordWrap: true,
  readOnly:true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(5)',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  warnings: {
    duplicateUserFields: {
      primary: 'typeBirthday',
      check: ['fullName']
    }
  }
}, {
  type: 'text',
  width: 80,
  title: '(6)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(7)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(8.1)',
  align: 'left',
  source: [ 'Chọn' ],
  key: 'recipientsCityCode',
  fieldName: 'Tỉnh thành nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(8.2)',
  align: 'left',
  source: [ ],
  key: 'recipientsDistrictCode',
  defaultLoad: true,
  fieldName: 'Quận huyện nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(8.3)',
  align: 'left',
  source: [],
  key: 'recipientsWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phường nhận hồ sơ',
  validations: {
    required:true,
  }
}, {
  type: 'text',
  width: 165,
  title: '(8.4)',
  align: 'left',
  fieldName: 'số nhà, đường phố, thôn, xóm',
  wordWrap: true,
  key: 'recipientsAddress',
  validations: {
    required:true,
  }
}, {
  type: 'text',
  autocomplete: true,
  width: 100,
  title: '(9.1)',
  source: [ ],
  wordWrap: true,
  key: 'hospitalFirstRegistCode',
  fieldName: 'Mã đơn vị khám chữa bệnh',
  defaultLoad: true,
}, {
  type: 'text',
  width: 300,
  title: '(9.2)',
  align: 'left',
  wordWrap: true,
  fieldName: 'Tên đơn vị khám chữa bệnh',
  key: 'hospitalFirstRegistName'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 80,
  title: '(10)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(11)',
  align: 'center',
  fieldName: 'Có giản chết',
  key: 'isReductionWhenDead',
},{
  type: 'text',
  width: 80,
  title: '(12)',
  key: 'motherDayDead',
  fieldName: 'Ngày chết',
  readOnly: true,
},
 {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(13)',
  fieldName: 'Số biên lai',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(14)',
  key: 'dateSign',
  fieldName: 'Ngày lập biên lai/ Ngày văn bản phê duyệt',
  validations: {
    lessThanNow: true
  }
},{
  type: 'numeric',
  align: 'right',
  width: 70,
  title: '(15.1)',
  fieldName: 'Tỷ lệ NSDP hỗ trợ (%)',
  key: 'tyleNSDP',
  column: 'tyleNSDP',
  suffix: '%',
  validations: {
    // number: true,
    required: true,
    min: 0,
    max: 100
  }
},
{
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(15.2)',
  mask: '#,##0',
  fieldName: 'Tổ chức, cá nhân khác hỗ trợ',
  key: 'toChuCaNhanHTKhac',
  validations: {
    number: true,
    required: true,
    min: 0,
  },
  format: (value) => {
    return format.currency(value);
  }
},  {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(16.1)',
  key: 'fromDateJoin',
  fieldName: 'Từ ngày tham gia',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(16.2)',
  key: 'numberMonthJoin',
  fieldName: 'Số tháng tham gia',
  validations: {
    required: true,
    min: 1
  },
},{
  type: 'numeric',
  width: 120,
  title: '(17.1)',
  fieldName: 'Tiền lương',
  align: 'right',
  // decimal: ',',
  key: 'salary',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(17.2)',
  mask: '#,##0',
  key: 'sumRatio',
  fieldName: 'Tổng hệ số',
  validations: {
    required: true,
    min: 0,
    max: 13,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.0');
  }
},{
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(18)',
  mask: '#,##0',
  sum: true,
  key: 'moneyPayment',
  fieldName: 'Tiền lương, trợ cấp hoặc số tiền đóng',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 220,
  title: '(19)',
  wordWrap: true,
  key: 'reason'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'soTienNSDP',
  column: 'soTienNSDP',
}
,{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
}
,{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeIdClone'
}];
