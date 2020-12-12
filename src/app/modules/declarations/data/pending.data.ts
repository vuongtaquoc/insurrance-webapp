import format from '@app/shared/utils/format';
export const TABLE_ADJUST_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có sổ BHXH', rowspan: '3' },
    { title: 'Số sổ BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Dân tộc', rowspan: '3' },
    { title: 'Quốc tịch', rowspan: '3' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Vùng sinh sống', rowspan: '3' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Tiền lương mức đóng cũ', colspan: '8' },
    { title: 'Tiền lương mức đóng mới', colspan: '8' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định/Văn bản chứng minh', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' },
    { title: 'Tiền lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' },
    { title: 'Tháng. năm bắt đầu', rowspan: '2' },
    { title: 'Tháng. năm kết thúc', rowspan: '2' },
  ],
  [
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Tỉnh/TP' },
    { title: 'Quận/huyện' },
    { title: 'Xã/phường' },
    { title: 'Số nhà, đường phố, thôn, xóm' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
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
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo',
  warnings: {
    duplicateUserFields: {
      primary: 'isurranceNo',
      check: ['employeeId']
    },
  },
  fieldName: 'Số sổ BHXH',
  validations: {     
    required: true,    
    duplicate: true,
  }
}, {
  type: 'numeric',
  width: 123,
  title: '(5.1)',
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
  title: '(5.2)',
  wordWrap: true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
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
  title: '(7)',
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
  title: '(8)',
  align: 'center',
  key: 'gender'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(9)',
  source: [ 'Chọn' ],
  key: 'peopleCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode'
}, {
  type: 'dropdown',
  width: 145,
  title: '(11.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(11.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(11.3)',
  source: [],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.1)',
  align: 'left',
  source: [],
  key: 'recipientsCityCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.2)',
  align: 'left',
  source: [],
  key: 'recipientsDistrictCode',
  defaultLoad: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 145,
  title: '(12.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress'
},
{
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(13)',
  source: [],
  key: 'livesAreaCode'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(14)',
  source: [],
  key: 'salaryAreaCode'
},{
  type: 'text',
  width: 135,
  title: '(15)',
  fieldName: 'Cấp bậc, chức vụ, chức danh nghề',
  key: 'levelWork'
},
{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(16)',
  fieldName: 'Nới làm việc',
  key: 'workAddress',
  validations: {
    required: true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(17)',
  key: 'departmentCode'
}, {
  type: 'numeric',
  width: 80,
  title: '(18.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  fieldName: 'Tiền lương',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0');
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.2)',
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
  title: '(18.3)',
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
  title: '(18.4)',
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
  title: '(18.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    number: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(18.6)',
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
  title: '(18.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề(%)',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.8)',
  fieldName: 'Chênh lệch bảo lưu',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOther',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
},{
  type: 'numeric',
  width: 80,
  title: '(19.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew',
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
  title: '(19.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
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
  title: '(19.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
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
  title: '(19.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
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
  title: '(19.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevelNew',
  fieldName: 'Chức vụ lương mới',
  validations: {
    number: true,
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(19.6)',
  key: 'allowanceSeniorityNew',
  suffix: '%',
  fieldName: 'Thâm niên VK lương mới',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(19.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  fieldName: 'Thâm niên nghề lương mới',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(19.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOtherNew',
  fieldName: 'Chênh lệch bảo lưu lương mới',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 60,
  title: '(20.1)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(20.2)',
  key: 'toDate',
  isCalendar: true
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(21)',
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
  title: '(22)',
  key: 'ratio',
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
  title: '(23.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định',
  validations: {
    required: true
  }
}, {
  type: 'text',
  width: 100,
  title: '(23.2)',
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
  title: '(24)',
  wordWrap: true,
  key: 'reason'
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
