import format from '@app/shared/utils/format';
export const TABLE_ADJUST_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có mã số BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Vị trí làm việc', colspan: '3' },        
    { title: 'Ngành/nghề nặng nhọc độc hại', colspan: '2' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '5', rowspan: '2' },
    { title: 'Tiền lương mức đóng cũ', colspan: '7' },
    { title: 'Tiền lương mức đóng mới', colspan: '7' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định/Văn bản chứng minh', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Tĩnh lãi', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Loại', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Từ ngày', rowspan: '2' },
    { title: 'Đến ngày', rowspan: '2' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '5' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '5' },
    { title: 'Tháng. năm bắt đầu', rowspan: '2' },
    { title: 'Tháng. năm kết thúc', rowspan: '2' },
  ],
  [
    { title: 'Số' },
    { title: 'Ngày ký' },
    { title: 'Loại hợp đồng' },
    { title: 'Ngày bắt đầu' },
    { title: 'Ngày kết thúc' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Số' },
    { title: 'Ngày ký' },
  ],
];

export const TABLE_ADJUST_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  readOnly: true,
  align: 'left'
}, {
  type: 'text',
  width: 170,
  title: '(2)',
  key: 'fullName',
  fieldName: 'Họ và tên',
  warnings: {
    duplicateUserFields: {
      primary: 'fullName',
      check: ['employeeId']
    },
  },
  validations: {
    required: true
  }
   
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'isExitsIsurranceNo',
  readOnly: true
}, {
  type: 'numeric',
  width: 123,
  title: '(4.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  warnings: {
    duplicateUserFields: {
      primary: 'isurranceCode',
      check: ['employeeId']
    },
  },
  validations: {
    required: true,
    duplicate: true,
    numberLength: 10
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
  source: [{ id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  warnings: {
    duplicateUserFields: {
      primary: 'typeBirthday',
      check: ['employeeId']
    },
  },
}, {
  type: 'text',
  width: 80,
  title: '(6)',
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
  warnings: {
    duplicateUserFields: {
      primary: 'birthday',
      check: ['employeeId']
    },
  },
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
},{
  type: 'text',
  width: 135,
  title: '(8)',
  fieldName: 'Cấp bậc, chức vụ, chức danh nghề',
  key: 'levelWork'
},{
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(9.1)',
  source: [],
  key: 'workTypeCode'
}, {
  type: 'text',
  width: 80,
  title: '(9.2)',
  key: 'workTypeFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 80,
  title: '(9.3)',
  key: 'workTypeToDate',
  fieldName: 'Từ ngày',
},{
  type: 'text',
  width: 100,
  title: '(10.1)',
  key: 'careFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 100,
  title: '(10.2)',
  key: 'careTypeToDate',
  fieldName: 'Từ ngày',
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(11.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(11.2)',
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
  title: '(11.3)',
  key: 'contractTypeCode',
  fieldName: 'Loại hợp đồng'  
},{
  type: 'text',
  width: 100,
  title: '(11.4)',
  key: 'contractTypeFromDate',
  fieldName: 'Ngày băt đầu',   
},{
  type: 'text',
  width: 100,
  title: '(11.5)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  checkReadonly: true,
},{
  type: 'numeric',
  width: 80,
  title: '(12.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew',
  fieldName: 'Mức lương',
  readOnly: true,
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(12.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratioNew',
  fieldName: 'Hệ số',
  readOnly: true,
  validations: {
    required: true,
    min: 0,
    max: 13,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(12.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalaryNew',
  fieldName: 'Phụ cấp lương',
  readOnly: true,
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(12.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditionalNew',
  fieldName: 'Phụ cấp lương',
  readOnly: true,
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(12.5)',
  mask: '#,##0',
  // decimal: ',',
  readOnly: true,
  sum: true,
  key: 'allowanceLevelNew',
  fieldName: 'Chức vụ lương',
  suffix: '%',
  validations: {
    required: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value,'0,0.00');
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(12.6)',
  key: 'allowanceSeniorityNew',
  suffix: '%',
  fieldName: 'Thâm niên VK lương',
  readOnly: true,
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(12.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  fieldName: 'Thâm niên nghề lương',
  readOnly: true,
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
},
 {
  type: 'numeric',
  width: 80,
  title: '(13.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  fieldName: 'Tiền lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(13.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio',
  fieldName: 'Hệ số mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(13.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  fieldName: 'Phụ cấp lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(13.4)',
  mask: '#,##0',
  // decimal: ',',
  fieldName: 'Các khoản bổ sung lương mới',
  sum: true,
  key: 'allowanceAdditional',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
  
}, {
  type: 'numeric',
  width: 80,
  title: '(13.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  fieldName: 'Phụ cấp chức vụ lương mới',
  suffix: '%',
  validations: {
    required: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value,'0,0.00');
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(13.6)',
  fieldName: 'Thâm niên vK(%) lương mới',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(13.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề(%) lương mới',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
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
  key: 'toDate',
  isCalendar: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(15)',
  source: [ ],
  key: 'planCode',
  fieldName: 'Phương án',
  validations: {
    required: true
  }
}, {
  type: 'numeric',
  mask: '#,##0',
  // decimal: ',',
  width: 50,
  title: '(16)',
  key: 'rate',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
},
{
  type: 'numeric',
  width: 100,
  title: '(17.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(17.2)',
  fieldName: 'Ngày quyết định',
  key: 'dateCancelSign',
  validations: {
    lessThanNow: true,
    required: true
  }
},
{
  type: 'text',
  width: 180,
  title: '(18)',
  wordWrap: true,
  key: 'reason'
},{
  type: 'text',
  width: 280,
  title: '(19)',
  wordWrap: true,
  key: 'workAddress',
  fieldName: 'Nơi làm việc',
  validations: {
    required: true,
  },
},{
  type: 'checkbox',
  width: 60,
  title: '(20)',
  align: 'center',
  key: 'interest',
},
{
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
