import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có mã số BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },   
    { title: 'Địa chỉ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Mực thu nhập tháng đóng BHXH', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Phương thức đóng', colspan: '3', rowspan: '2' },
    { title: 'Số tiền đóng', colspan: '8'},
    { title: 'Ghi chú', rowspan: '3' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Tổng số tiền phải đóng', rowspan: '2' },
    { title: 'NSNN hỗ trợ', colspan: '2' },
    { title: 'NS địa phương hỗ trợ', colspan: '2' },
    { title: 'Tổ chức, cá nhân khác hỗ trợ', colspan: '2' },
    { title: 'Người tham gia đóng', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
    { title: 'Phương thức đóng' },
    { title: 'Số tháng đóng' },
    { title: 'Từ tháng/ năm' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
    { title: 'Tỷ lệ(%)' },
    { title: 'Số tiền' },
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
  width: 170,
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
  key: 'isExitsIsurranceNo'
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
},  {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(5.1)',
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
  title: '(5.2)',
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
  title: '(5.3)',
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
  title: '(5.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'numeric',
  width: 120,
  title: '(6)',
  align: 'right',
  mask: '#,##0',
  fieldName: 'Mức thu nhập tháng đóng BHXH',
  key: 'salary',
  validations: {
    number: true,
    min: 1,
  },
  format: (value) => {
    return format.currency(value);
  }
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 50,
  title: '(7)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 150,
  title: '(8.1)',
  align: 'left',
  wordWrap: true,
  source: [ ],
  fieldName: 'Phương thức đóng',
  key: 'paymentMethodCode',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(8.2)',
  key: 'numberMonthJoin',
  fieldName: 'Số tháng đóng',
  validations: {
    required: true,
    min: 1,
    number: true
  },
},
{
  type: 'text',
  width: 60,
  title: '(8.3)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
},
{
  type: 'numeric',
  width: 120,
  title: '(9.1)',
  align: 'right',
  mask: '#,##0',
  fieldName: 'Tổng số tiền phải đóng',
  sum: true,
  readOnly: true,
  key: 'moneyPayment',
  validations: {
    number: true,
    min: 1,
  },
  format: (value) => {
    return format.currency(value);
  }
},{
  type: 'dropdown',
  align: 'right',
  width: 70,
  title: '(9.2)',
  fieldName: 'Tỷ lệ NSNN hỗ trợ (%)',
  source: [ { id: 0 , name: '0 %' },{ id: 10 , name: '10 %' },{ id: 25 , name: '25 %' }, { id: 30 , name: '30 %' } ],
  key: 'tyleNSNN',
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
  title: '(9.3)',
  mask: '#,##0',
  fieldName: 'Số tiền NS nhà nước hỗ trợ',
  sum: true,
  key: 'soTienNSNN',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 70,
  title: '(9.4)',
  fieldName: 'Tỷ lệ NSĐP hỗ trợ (%)',
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
  title: '(9.5)',
  mask: '#,##0',
  fieldName: 'Số tiền NS địa phương hỗ trợ',
  sum: true,
  key: 'soTienNSDP',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 90,
  title: '(9.6)',
  fieldName: 'Tỷ lệ tổ chức, cá nhân khác hỗ trợ (%)',
  key: 'tyleTCCNHTK',
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
  width: 100,
  title: '(9.7)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'toChuCaNhanHTKhac',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(9.8)',
  mask: '#,##0',
  fieldName: 'Người tham gia đóng',
  sum: true,
  key: 'playerClose',
  validations: {
    number: true,
    min: 0,
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 220,
  title: '(10)',
  wordWrap: true,
  key: 'reason'
},{
  type: 'dropdown',
  width: 70,
  title: '(11)',
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
  title: '(12)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  validations: {
    required: true,
    lessThanNow: true
  }
}, {
  type: 'checkbox',
  width: 35,
  title: '(13)',
  align: 'center',
  key: 'gender'
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
