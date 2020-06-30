import format from '@app/shared/utils/format';

export const TABLE_PROCESS_NESTED_HEADERS = [
  [
    { title: 'STT', rowspan: 2 },
    { title: 'Từ tháng/năm', rowspan: 2 },
    { title: 'Đến tháng/năm', rowspan: 2 },
    { title: 'Đơn vị', colspan: 2 },
    { title: 'Chức vụ/công việc', rowspan: 2 },
    { title: 'Mức đóng', rowspan: 2 },
    { title: 'PC chức vụ', rowspan: 2 },
    { title: 'Thâm niên VK (%)', rowspan: 2 },
    { title: 'Thâm niên nghề (%)', rowspan: 2 },
    { title: 'PC khác', rowspan: 2 },
    { title: 'PC lương', rowspan: 2 },
    { title: 'Các khoản bổ sung', rowspan: 2 },
    { title: 'PA', rowspan: 2 },
    { title: 'Tỷ lệ đóng (%)', colspan: 4 }
  ],
  [
    { title: 'Mã ĐV' },
    { title: 'Tên ĐV' },
    { title: 'BHXH' },
    { title: 'BHTNXH. BNN' },
    { title: 'BHTN' },
    { title: 'BHYT' }
  ]
];

export const TABLE_PROCESS_HEADER_COLUMNS = [{
  type: 'text',
  width: 35,
  title: '(1)',
  key: 'orders',
  align: 'center',
  readOnly: true,
}, {
  type: 'text',
  width: 70,
  title: '(2)',
  key: 'fromDate',
  isMasterKey: true,
  isCalendar: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'text',
  width: 70,
  title: '(3)',
  key: 'toDate',
  isCalendar: true,
  validations: {
    lessThanNow: true
  }
}, {
  type: 'text',
  width: 75,
  title: '(4)',
  key: 'companyCode',
  validations: {
    maxLength: 4,
    onlyCharacterNumber: true,
  }
}, {
  type: 'text',
  width: 210,
  title: '(5)',
  key: 'companyName'
}, {
  type: 'text',
  width: 120,
  title: '(6)',
  key: 'levelWork'
}, {
  type: 'numeric',
  width: 90,
  title: '(7)',
  mask: '#,##0',
  fieldName: 'Mức đóng',
  key: 'salary',
  validations: {
    required: true,
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numberic',
  width: 55,
  title: '(8)',
  key: 'allowanceLevel',
  mask: '#,##0',
  fieldName: 'Phụ cấp chức vụ',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numberic',
  width: 65,
  title: '(9)',
  key: 'allowanceSeniority',
  fieldName: 'Thâm niên VK',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numberic',
  width: 65,
  title: '(10)',
  key: 'allowanceSeniorityJob',
  fieldName: 'Thâm niên nghề',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numberic',
  width: 65,
  title: '(11)',
  key: 'allowanceOther',
  mask: '#,##0',
  fieldName: 'PC Khác',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numberic',
  width: 90,
  title: '(12)',
  key: 'allowanceSalary',
  mask: '#,##0',
  fieldName: 'Phụ cấp lương',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numberic',
  width: 90,
  title: '(13)',
  key: 'allowanceAdditional',
  mask: '#,##0',
  fieldName: 'Các khoản bổ sung',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }

}, {
  type: 'dropdown',
  autocomplete: true,
  width: 40,
  title: '(14)',
  source: [],
  key: 'planCode',
  validations: {
    required: true
  }
}, {
  type: 'numberic',
  width: 70,
  title: '(15)',
  key: 'ratioBHXH',
  fieldName: 'Tỷ lệ BHXH',
  defaultValue: '0',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numberic',
  width: 70,
  title: '(16)',
  key: 'ratioBHTNLD',
  fieldName: 'Tỷ lệ BHTNXH.BNN',
  suffix: '%',
  defaultValue: '0',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numberic',
  width: 70,
  title: '(17)',
  key: 'ratioBHTN',
  fieldName: 'Tỷ lệ BHTN',
  suffix: '%',
  defaultValue: '0',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}, {
  type: 'numberic',
  width: 70,
  title: '(18)',
  key: 'ratioBHYT',
  fieldName: 'Tỷ lệ BHYT',
  defaultValue: '0',
  suffix: '%',
  validations: {
    // number: true,
    min: 0,
    max: 100
  }
}];
