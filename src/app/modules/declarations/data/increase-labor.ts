import format from '@app/shared/utils/format';

export const TABLE_NESTED_HEADERS = [
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
    { title: 'Số CMND/Hộ chiếu/Thẻ căn cước', rowspan: '3' },
    { title: 'Số điện thoại liên hệ', rowspan: '3' },
    { title: 'Mã số hộ gia đình', rowspan: '3' },
    { title: 'Địa chỉ đăng ký giấy khai sinh', subtitle: 'hoặc nguyên quán hoặc HKTT hoặc tạm trú', colspan: '3', rowspan: '2' },
    { title: 'Địa chỉ nhận hồ sơ', subtitle: 'nơi sinh sống', colspan: '4', rowspan: '2' },
    { title: 'Vùng lương tối thiểu', rowspan: '3' },
    { title: 'Nơi đăng ký KCB', colspan: '2' },
    { title: 'Cấp bập, chức vụ, chức danh nghề', rowspan: '3' },
    { title: 'Nơi làm việc', rowspan: '3' },
    { title: 'Phòng ban', rowspan: '3' },
    { title: 'Quyết định/Hợp đồng lao động', colspan: '2', rowspan: '2' },
    { title: 'Tiền lương', colspan: '8' },
    { title: 'Từ tháng, năm', rowspan: '3' },
    { title: 'Đến tháng, năm', rowspan: '3' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Ghi chú', rowspan: '3' },
  ],
  [
    { title: 'Mã số BHXH', rowspan: '2' },
    { title: 'Trạng thái', rowspan: '2' },
    { title: 'Mã đơn vị KCB', rowspan: '2' },
    { title: 'Tên đơn vị KCB', rowspan: '2' },
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
    { title: 'Số' },
    { title: 'Ngày ký' },
    { title: 'Phụ cấp lương' },
    { title: 'Các khoản bổ sung' },
    { title: 'Chức vụ' },
    { title: 'Thâm niên VK (%)' },
    { title: 'Thâm niên nghề (%)' },
    { title: 'Chênh lệch bảo lưu' },
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
  validations: {
    duplicateUserFields: {
      primary: 'fullName',
      check: ['employeeId']
    },
    required: true,
  }
}, {
  type: 'checkbox',
  width: 45,
  title: '(3)',
  align: 'center',
  key: 'hasBookIsurrance',
  readOnly: true
}, {
  type: 'text',
  width: 120,
  title: '(4)',
  key: 'isurranceNo',
  validations: {
    duplicateUserFields: {
      primary: 'isurranceNo',
      check: ['employeeId']
    },
    required: true,
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 123,
  title: '(5.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  validations: {
    numberLength: 10
  }
}, {
  type: 'text',
  key: 'isurranceCodeStatus',
  width: 123,
  readOnly: true,
  title: '(5.2)',
  wordWrap: true,
}, {
  type: 'dropdown',
  width: 70,
  title: '(6)',
  source: [ { id: '3', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  validations: {
    duplicateUserFields: {
      primary: 'typeBirthday',
      check: ['fullName']
    }
  }
}, {
  type: 'text',
  width: 80,
  title: '(7)',
  key: 'birthday'
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
    duplicateUserFields: {
      primary: 'peopleCode',
      check: ['fullName']
    }
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
    duplicateUserFields: {
      primary: 'nationalityCode',
      check: ['fullName']
    }
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 135,
  title: '(11)',
  key: 'identityCar',
  fieldName: 'Số CMND/Hộ chiếu/Thẻ căn cước',
  validations: {
    cardId: true,
    duplicate: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 135,
  title: '(12)',
  fieldName: 'Số điện thoại',
  key: 'mobile',
  validations: {
    phone: true
  }
}, {
  type: 'numeric',
  align: 'right',
  autocomplete: true,
  width: 135,
  title: '(13)',
  key: 'familyNo',
}, {
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
  source: [ ],
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
  wordWrap: true,
  key: 'recipientsAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 75,
  title: '(16)',
  source: [ ],
  key: 'salaryAreaCode'
}, {
  type: 'text',
  autocomplete: true,
  width: 85,
  title: '(17.1)',
  source: [ ],
  wordWrap: true,
  key: 'hospitalFirstRegistCode',
  defaultLoad: true
}, {
  type: 'text',
  width: 300,
  title: '(17.2)',
  align: 'left',
  wordWrap: true,
  key: 'hospitalFirstRegistName'
}, {
  type: 'text',
  width: 135,
  title: '(18)',
  key: 'levelWork'
}, {
  type: 'text',
  width: 135,
  wordWrap: true,
  title: '(19)',
  key: 'workAddress'
}, {
  type: 'dropdown',
  autocomplete: true,
  source: [ ],
  width: 135,
  title: '(20)',
  key: 'departmentId'
}, {
  type: 'numeric',
  align: 'right',
  width: 100,
  title: '(21.1)',
  key: 'contractNo'
}, {
  type: 'text',
  width: 100,
  title: '(21.2)',
  key: 'dateSign',
  fieldName: 'Ngày ký',
  validations: {
    lessThanNow: true
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(22.1)',
  mask: '#,##0',
  fieldName: 'Mức lương',
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
  title: '(22.2)',
  fieldName: 'Hệ số',
  mask: '#,##0',
  validations: {
    required: true,
    number: true
  },
  sum: true,
  key: 'ratio',
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(22.3)',
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
    return format.currency(value,'0,0.000');
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(22.4)',
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
  width: 80,
  title: '(22.5)',
  mask: '#,##0',
  defaultValue:0,
  sum: true,
  key: 'allowanceLevel',
  fieldName: 'Chức vụ',
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
  width: 70,
  title: '(22.6)',
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
  title: '(22.7)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề',
  suffix: '%',
  validations: {
    min: 0,
    max: 100
  }
}, {
  type: 'numeric',
  align: 'right',
  width: 80,
  title: '(22.8)',
  mask: '#,##0',
  defaultValue: 0,
  sum: true,
  key: 'allowanceOther',
  fieldName: 'Chênh lệch bảo lưu',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'text',
  width: 60,
  title: '(23)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(24)',
  fieldName: 'Đến tháng năm',
  key: 'toDate',
  isCalendar: true

}, {
  type: 'dropdown',
  autocomplete: true,
  width: 50,
  title: '(25)',
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
  title: '(26)',
  key: 'ratio',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value, '0,0.000');
  }
}, {
  type: 'text',
  width: 180,
  title: '(28)',
  wordWrap: true,
  key: 'note'
},{
  type: 'hidden',
  width: 140,
  title: 'key',
  key: 'employeeId',
  isMasterKey: true
}
];
