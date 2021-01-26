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
    { title: 'Số CCCD/CMTND/ Hộ chiếu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Vị trí làm việc', colspan: '3' },
    { title: 'Tiền lương', colspan: '7' },
    { title: 'Ngành/nghề nặng nhọc độc hại', colspan: '2' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '5', rowspan: '2' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Loại', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '5' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Tháng. năm bắt đầu', rowspan: '2' },
    { title: 'Tháng. năm kết thúc', rowspan: '2' },
  ],
  [
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Số' },
    { title: 'Ngày ký' },
    { title: 'Loại hợp đồng' },
    { title: 'Ngày bắt đầu' },
    { title: 'Ngày kết thúc' },
   
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
    // duplicateUserFields: {
    //   primary: 'fullName',
    //   check: ['employeeId']
    // },
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
  // warnings: {
  //   duplicateUserFields: {
  //     primary: 'isurranceCode',
  //     check: ['employeeId']
  //   },
  // },
  validations: {
    required: true,
    duplicate: true   
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
    // duplicateUserFields: {
    //   primary: 'typeBirthday',
    //   check: ['fullName']
    // }
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
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(8)',
  key: 'identityCar',
  fieldName: 'Số CCCD/CMTND/ Hộ chiếu',
  validations: {
    required: true,
    cardId: true,
    duplicate: true
  }
}, {
  type: 'text',
  width: 135,
  title: '(9)',
  validations: {
    required: true,
  },
  fieldName: 'Cấp bậc, chức vụ, chức danh nghề',
  key: 'levelWork'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10.1)',
  source: [],
  key: 'workTypeCode'
}, {
  type: 'text',
  width: 80,
  title: '(10.2)',
  key: 'workTypeFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 80,
  title: '(10.3)',
  key: 'workTypeToDate',
  fieldName: 'Từ ngày',
},{
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(11.1)',
  mask: '#,##0',
  fieldName: 'Tiền lương',
  sum: true,
  key: 'salary',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(11.2)',
  fieldName: 'Hệ số',
  mask: '#,##0',
  validations: {
    required: true,
    min: 0,
    max: 13,
    number: true
  },
  sum: true,
  key: 'ratio',
  format: (value) => {
    return format.currency(value, '0,0.00');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(11.3)',
  mask: '#,##0',
  defaultValue:0,
  sum: true,
  key: 'allowanceSalary',
  fieldName: 'Phụ cấp lương',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value,'0,0.00');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 120,
  title: '(11.4)',
  mask: '#,##0',
  defaultValue:0,
  sum: true,
  key: 'allowanceAdditional',
  fieldName: 'Các khoản bổ sung',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 120,
  title: '(11.5)',
  mask: '#,##0',
  defaultValue:0,
  sum: true,
  key: 'allowanceLevel',
  fieldName: 'Chức vụ',
  validations: {
    required: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 70,
  title: '(11.6)',
  key: 'allowanceSeniority',
  fieldName: 'Thâm niên VK',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 70,
  title: '(11.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề',
  suffix: '%',
  validations: {
    min: 0,
    max: 100
  }
},{
  type: 'text',
  width: 100,
  title: '(12.1)',
  key: 'careFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 100,
  title: '(12.2)',
  key: 'careTypeToDate',
  fieldName: 'Từ ngày',
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(13.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(13.2)',
  key: 'dateSign',
  fieldName: 'Ngày ký',
  validations: {
    lessThanNow: true
  }
},{
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 100,
  title: '(13.3)',
  key: 'contractTypeCode',
  fieldName: 'Loại hợp đồng'  
},{
  type: 'text',
  width: 100,
  title: '(13.4)',
  key: 'contractTypeFromDate',
  fieldName: 'Ngày băt đầu',   
},{
  type: 'text',
  width: 100,
  title: '(13.5)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  checkReadonly: true,
},  {
  type: 'text',
  width: 60,
  title: '(14.1)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(14.2)',
  fieldName: 'Đến tháng năm',
  key: 'toDate',
  isCalendar: true

}, {
  type: 'dropdown',
  autocomplete: true,
  width: 50,
  title: '(15)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  align: 'right',
  mask: '#,##0',
  // decimal: ',',
  width: 50,
  title: '(16)',
  key: 'rate',
  fieldName: 'Tỷ lệ đóng',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'text',
  width: 180,
  title: '(17)',
  wordWrap: true,
  key: 'reason'
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
