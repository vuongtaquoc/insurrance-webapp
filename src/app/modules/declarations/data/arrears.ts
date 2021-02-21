export const TABLE_ARREARS_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: '3' },
    { title: 'Họ và tên', subtitle: 'Nhập chữ thường', rowspan: '3' },
    { title: 'Đã có mã số BHXH', rowspan: '3' },
    { title: 'Số sổ BHXH', rowspan: '3' },
    { title: 'Kiểm tra mã số BHXH', colspan: '2' },
    { title: 'Chỉ có năm sinh hoặc tháng/năm', rowspan: '3' },
    { title: 'Ngày, tháng, năm sinh', rowspan: '3' },
    { title: 'Nữ', rowspan: '3' },
    { title: 'Dân tộc', rowspan: '3' },
    { title: 'Quốc tịch', rowspan: '3' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Tiền lương mức đóng cũ', colspan: '8' },
    { title: 'Tiền lương mức đóng mới', colspan: '8' },
    { title: 'Từ tháng, năm', rowspan: '3' },
    { title: 'Đến tháng, năm', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Quyết định châm dứt HĐLD/ chuyển công tác/nghỉ hưu', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' },
    { title: 'Mức lương', rowspan: '2' },
    { title: 'Hệ số', rowspan: '2' },
    { title: 'Phụ cấp', colspan: '6' }
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

export const TABLE_ARREARS_HEADER_COLUMNS = [{
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
  isMasterKey: true
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'isurranceNo'
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo'
}, {
  type: 'numeric',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
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
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday'
}, {
  type: 'text',
  width: 80,
  fieldName: 'Ngày tháng năm sinh',
  key: 'birthday',
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
  key: 'peopleCode',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 100,
  title: '(10)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'nationalityCode',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  width: 145,
  title: '(11.1)',
  source: [ 'Chọn' ],
  align: 'left',
  key: 'registerCityCode',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  source: [ ],
  title: '(11.2)',
  align: 'left',
  key: 'registerDistrictCode',
  defaultLoad: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(11.3)',
  source: [],
  align: 'left',
  key: 'registerWardsCode',
  defaultLoad: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.1)',
  align: 'left',
  source: [],
  key: 'recipientsCityCode',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.2)',
  align: 'left',
  source: [],
  key: 'recipientsDistrictCode',
  defaultLoad: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 145,
  title: '(12.3)',
  align: 'left',
  source: [ ],
  key: 'recipientsWardsCode',
  defaultLoad: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'text',
  width: 145,
  title: '(12.4)',
  align: 'left',
  wordWrap: true,
  key: 'recipientsAddress',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(13)',
  source: [],
  key: 'salaryAreaCode'
},{
  type: 'text',
  width: 135,
  title: '(14)',
  key: 'levelWork'
},{
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(15)',
  fieldName: 'Nơi làm việc',
  key: 'workAddress',
  validations: {
    required: true,
  }
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(16)',
  key: 'departmentCode'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratio'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditional'
}, {
  type: 'numeric',
  width: 80,
  title: '(17.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    min: 0,
    max: 99
  },

}, {
  type: 'numeric',
  width: 70,
  title: '(17.6)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(17.7)',
  key: 'allowanceSeniorityJob',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(17.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOther',
  validations: {
    number: true
  }
},{
  type: 'numeric',
  width: 80,
  title: '(18.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salaryNew'
}, {
  type: 'numeric',
  width: 80,
  title: '(18.2)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'ratioNew'
}, {
  type: 'numeric',
  width: 80,
  title: '(18.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalaryNew'
}, {
  type: 'numeric',
  width: 80,
  title: '(18.4)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceAdditionalNew'
}, {
  type: 'numeric',
  width: 80,
  title: '(18.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevelNew',
  validations: {
    min: 0,
    max: 99
  },
}, {
  type: 'numeric',
  width: 70,
  title: '(18.6)',
  key: 'allowanceSeniorityNew',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(18.7)',
  key: 'allowanceSeniorityJobNew',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(18.8)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceOtherNew',
  validations: {
    number: true
  }
}, {
  type: 'text',
  width: 60,
  title: '(19)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(20)',
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
  key: 'ratio'
},
{
  type: 'numeric',
  width: 100,
  title: '(23.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(23.2)',
  key: 'dateSign'
},
{
  type: 'text',
  width: 180,
  title: '(24)',
  key: 'reason'
}];
