import format from '@app/shared/utils/format';
export const TABLE_ADJUST_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có Mã số BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Số CCCD/CMTND/ Hộ chiếu', rowspan: '3' }, 
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Vị trí làm việc', colspan: '3' },
    { title: 'Ngành/nghề nặng nhọc độc hại', colspan: '2' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '3', rowspan: '2' },
    { title: 'Tiền lương mức đóng cũ', colspan: '7' },
    { title: 'Tiền lương mức đóng mới', colspan: '7' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định điều chỉnh chức danh mức đóng', colspan: '2', rowspan: '2' },
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
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '5' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '5' },
    { title: 'Tháng. năm bắt đầu', rowspan: '2' },
    { title: 'Tháng. năm kết thúc', rowspan: '2' },
  ],
  [
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
  width: 123,
  title: '(4.2)',
  wordWrap: true,
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
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(8)',
  key: 'identityCar',
  fieldName: 'Số CCCD/CMTND/ Hộ chiếu',
  validations: {
    required:true,
    cardId: true,
    duplicate: true
  }
},{
  type: 'text',
  width: 135,
  title: '(9)',
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
  fieldName: 'Đến ngày',
},
{
  type: 'text',
  width: 100,
  title: '(11.1)',
  key: 'careFromDate',
  fieldName: 'Từ ngày',
}, {
  type: 'text',
  width: 100,
  title: '(11.2)',
  key: 'careTypeToDate',
  fieldName: 'Đến ngày',
},{
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 100,
  title: '(12.1)',
  key: 'contractTypeCode',
  fieldName: 'Loại hợp đồng'  
},{
  type: 'text',
  width: 100,
  title: '(12.2)',
  key: 'contractTypeFromDate',
  fieldName: 'Ngày băt đầu',   
},{
  type: 'text',
  width: 100,
  title: '(12.3)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  checkReadonly: true,
},{
  type: 'numeric',
  width: 80,
  title: '(14.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew',
  readOnly: true,
  fieldName: 'Mức lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(14.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  readOnly: true,
  key: 'ratioNew',
  fieldName: 'Hệ số lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(14.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  readOnly: true,
  key: 'allowanceSalaryNew',
  fieldName: 'Phụ cấp lương lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(14.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  readOnly: true,
  key: 'allowanceAdditionalNew',
  fieldName: 'Phụ cấp lương lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(14.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  readOnly: true,
  key: 'allowanceLevelNew',
  fieldName: 'Chức vụ lương mới',
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
  title: '(14.6)',
  key: 'allowanceSeniorityNew',
  suffix: '%',
  readOnly: true,
  fieldName: 'Thâm niên VK lương mới',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(14.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  fieldName: 'Thâm niên nghề lương mới',
  readOnly: true,
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(15.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  fieldName: 'Tiền lương',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(15.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio',
  fieldName: 'Hệ số',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(15.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  fieldName: 'Các khoản bổ sung',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(15.4)',
  mask: '#,##0',
  // decimal: ',',
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
  title: '(15.5)',
  fieldName: 'Phụ cấp chức vụ',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
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
  title: '(15.6)',
  fieldName: 'Thâm niên vK(%)',
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
  title: '(5.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề(%)',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'text',
  width: 60,
  title: '(16.1)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(16.2)',
  key: 'toDate',
  isCalendar: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(17)',
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
  title: '(18)',
  key: 'rate',
  readOnly: true,
  fieldName: 'Tỷ lệ đóng',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
},
{
  type: 'numeric',
  width: 100,
  title: '(19.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(19.2)',
  fieldName: 'Ngày quyết định',
  key: 'dateCancelSign',
  validations: {
    required: true
  }
},
{
  type: 'text',
  width: 180,
  title: '(20)',
  wordWrap: true,
  key: 'reason'
},{
  type: 'text',
  width: 280,
  title: '(21)',
  wordWrap: true,
  fieldName: 'Nơi làm việc',
  key: 'workAddress',
  validations: {
    required: true,
  },
},{
  type: 'checkbox',
  width: 60,
  title: '(22)',
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
