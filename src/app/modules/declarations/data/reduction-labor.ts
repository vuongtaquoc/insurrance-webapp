import format from '@app/shared/utils/format';
export const TABLE_REDUCTION_NESTED_HEADERS = [
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
    { title: 'Ngành/nghề nặng nhọc độc hại', colspan: '2' },   
    { title: 'Quyết định/Hợp đồng lao động', colspan: '5', rowspan: '2' },
    { title: 'Tiền lương', colspan: '7' },
    { title: 'Thời điểm đóng', colspan: '2' },
    { title: 'Phương án', rowspan: '3' },
    { title: 'Tỷ lệ đóng', rowspan: '3' },
    { title: 'Ngày chết', rowspan: '3' },
    { title: 'Quyết định châm dứt HĐLD/ chuyển công tác/nghỉ hưu', colspan: '2', rowspan: '2' },
    { title: 'Ghi chú', rowspan: '3' },
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
    { title: 'Số' },
    { title: 'Ngày ký' },
  ],
];

export const TABLE_REDUCTION_HEADER_COLUMNS = [{
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
  key: 'fullName',
  fieldName: 'Họ và tên',
  isMasterKey: true,
  warnings: {
    // duplicateUserFields: {
    //   primary: 'isurranceNo',
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
  readOnly: true
}, {
  type: 'numeric',
  width: 123,
  title: '(4.1)',
  key: 'isurranceCode',
  fieldName: 'Mã số BHXH',
  warnings: {
    // duplicateUserFields: {
    //   primary: 'isurranceCode',
    //   check: ['employeeId']
    // },
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
  fieldName: 'Trạng thái',
  readOnly: true,
  wordWrap: true,
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 70,
  title: '(5)',
  source: [ { id: '0', name: 'Ngày tháng năm' },{ id: '1', name: 'tháng/năm' }, { id: '2', name: 'năm' } ],
  key: 'typeBirthday',
  warnings: {
    // duplicateUserFields: {
    //   primary: 'typeBirthday',
    //   check: ['employeeId']
    // },
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
  },
  warnings: {
    // duplicateUserFields: {
    //   primary: 'birthday',
    //   check: ['employeeId']
    // },
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
},{
  type: 'text',
  width: 135,
  title: '(9)',
  validations: {
    required: true,
  },
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
  fieldName: 'Từ ngày',
},
{
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
  isCalendar: true
},{
  type: 'text',
  width: 100,
  title: '(13.5)',
  key: 'contractTypeToDate',
  fieldName: 'Ngày kết thúc',
  isCalendar: true
}, {
  type: 'numeric',
  width: 80,
  title: '(16.1)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'salary',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(16.2)',
  mask: '#,##0',
  // decimal: ',',
  fieldName: 'Hệ số',
  sum: true,
  key: 'ratio',
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
  title: '(16.3)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceSalary',
  validations: {
    number: true
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 80,
  title: '(16.4)',
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
  title: '(16.5)',
  mask: '#,##0',
  // decimal: ',',
  sum: true,
  key: 'allowanceLevel',
  validations: {
    min: 0,
    max: 99
  },
  format: (value) => {
    return format.currency(value);
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(16.6)',
  key: 'allowanceSeniority',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'numeric',
  width: 70,
  title: '(16.7)',
  key: 'allowanceSeniorityJob',
  suffix: '%',
  validations: {
    number: true
  }
}, {
  type: 'text',
  width: 60,
  title: '(17.1)',
  key: 'fromDate',
  fieldName: 'Từ tháng, năm',
  validations: {
    required: true
  },
  isCalendar: true
}, {
  type: 'text',
  width: 60,
  title: '(17.2)',
  key: 'toDate',
  isCalendar: true,
  fieldName: 'Đến tháng năm'
  
}, {
  type: 'dropdown',
  autocomplete: true,
  width: 60,
  title: '(18)',
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
  title: '(19)',
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
  width: 70,
  title: '(20)',
  key: 'motherDayDead',
  fieldName: 'Ngày chết',
  isCalendar: true
}, {
  type: 'numeric',
  width: 100,
  title: '(21.1)',
  key: 'contractCancelNo',
  fieldName: 'Số quyết định chấm dứt hợp đồng'
}, {
  type: 'text',
  width: 100,
  title: '(22.2)',
  key: 'dateCancelSign',
  fieldName: 'Ngày ký quyết định chấm dứt hợp đồng'
},
{
  type: 'text',
  width: 180,
  title: '(23)',
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
