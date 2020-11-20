import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Dân tộc', rowspan: '3' },
    { title: 'Quốc tịch', rowspan: '3' },
    { title: 'Mã số hộ gia đình', rowspan: '3' },
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: '3' },
    { title: 'Số điện thoại liên hệ', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Email', rowspan: '3' },
    { title: 'Nơi cấp giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
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
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(3.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatus',
  width: 123,
  title: '(3.2)',
  wordWrap: true,
  readOnly:true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(4)',
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
  title: '(5)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(6)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(7)',
  source: [ 'Chọn' ],
  key: 'peopleCode',
  validations: {
    required: true,
  },
  warnings: {
    duplicateUserFields: {
      primary: 'peopleCode',
      check: ['fullName']
    }
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(8)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode',
    validations: {
    required: true,
  },
  warnings: {
    duplicateUserFields: {
      primary: 'nationalityCode',
      check: ['fullName']
    }
  }
},{
  type: 'numeric',
  align: 'right',
  autocomplete: true,
  width: 135,
  title: '(9)',
  key: 'familyNo',
}, 
{
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(10)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    required: true,
    cardId: true,
    duplicate: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(11)',
  fieldName: 'Số điện thoại',
  key: 'mobile',
  validations: {
    phone: true
  }
},{
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(12)',
  key: 'departmentCode'
},{
  type: 'text',
  width: 150,
  title: '(13)',
  align: 'left',
  wordWrap: true,
  key: 'email'
},{
  type: 'dropdown',
  fieldName: 'Tỉnh thàng đăng ký khai sinh',
  autocomplete: true,
  validations: {
    required:true,
  },
  width: 145,
  title: '(14.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  fieldName: 'Quận huyện đăng ký khai sinh',
  validations: {
    required:true,
  },
  source: [ ],
  title: '(14.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 175,
  title: '(14.3)',
  source: [  ],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true,
  fieldName: 'Xã phương đăng ký khai sinh',
  validations: {
    required:true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(15.1)',
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
  title: '(15.2)',
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
  title: '(15.3)',
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
  title: '(15.4)',
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
  title: '(16.1)',
  source: [ ],
  wordWrap: true,
  key: 'hospitalFirstRegistCode',
  fieldName: 'Mã đơn vị khám chữa bệnh',
  defaultLoad: true,
}, {
  type: 'text',
  width: 300,
  title: '(16.2)',
  align: 'left',
  wordWrap: true,
  fieldName: 'Tên đơn vị khám chữa bệnh',
  key: 'hospitalFirstRegistName'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 80,
  title: '(17)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(18)',
  align: 'center',
  fieldName: 'Có giản chết',
  key: 'isReductionWhenDead',
},{
  type: 'text',
  width: 80,
  title: '(19)',
  key: 'motherDayDead',
  fieldName: 'Ngày chết',
  readOnly: true,
},
 {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(20)',
  fieldName: 'Số biên lai',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(21)',
  key: 'dateSign',
  fieldName: 'Ngày ký',
  validations: {
    lessThanNow: true
  }
},{
  type: 'numeric',
  align: 'right',
  width: 70,
  title: '(22.1)',
  fieldName: 'Tỷ lệ NSDP hỗ trợ (%)',
  key: 'tyleNSDP',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
},
{
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(22.2)',
  mask: '#,##0',
  // decimal: ',',
  key: 'toChuCaNhanHTKhac',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
},  {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(23.1)',
  key: 'fromDateJoin',
  fieldName: 'Từ ngày tham gia',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(23.2)',
  key: 'numberMonthJoin',
  fieldName: 'Số tháng tham gia',
  validations: {
    required: true,
    min: 1
  },
},{
  type: 'numeric',
  width: 120,
  title: '(24.1)',
  align: 'right',
  mask: '#,##0',
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
  title: '(24.2)',
  mask: '#,##0',
  key: 'sumRatio',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
},{
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(25)',
  mask: '#,##0',
  sum: true,
  key: 'moneyPayment',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 220,
  title: '(26)',
  wordWrap: true,
  key: 'note'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeIdClone'
}];
